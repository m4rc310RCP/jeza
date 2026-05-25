// ws-service.v2.ts

type Handler<T> = (payload: T) => void;

interface IWsData {
  type?: "success" | "error" | "message" | "ping" | "pong";

  action?: "join" | "unjoin";

  channel?: string;

  message?: unknown;

  payload?: unknown;
}

interface WsServiceOptions {
  reconnect?: boolean;

  reconnectInterval?: number;

  reconnectMaxInterval?: number;

  heartbeat?: boolean;

  heartbeatInterval?: number;

  heartbeatTimeout?: number;

  debug?: boolean;
}

type HandlerMap<ChannelMap extends object> = {
  [K in keyof ChannelMap]?: Set<Handler<ChannelMap[K]>>;
};

type BufferMap<ChannelMap extends object> = {
  [K in keyof ChannelMap]?: ChannelMap[K][];
};

type ConnectionState =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "closed";

export class WsService<ChannelMap extends object> {
  private socket?: WebSocket;

  private url: string;

  private options: Required<WsServiceOptions>;

  private handlers = {} as HandlerMap<ChannelMap>;

  private messageBuffer = {} as BufferMap<ChannelMap>;

  private pendingMessages: string[] = [];

  // canais desejados pela aplicação
  private desiredChannels = new Set<string>();

  // canais confirmados pelo backend
  private activeChannels = new Set<string>();

  private reconnectTimeout?: number;

  private reconnectAttempts = 0;

  private heartbeatTimer?: number;

  private pongTimeout?: number;

  private readyPromise!: Promise<void>;

  private readyResolver!: () => void;

  private state: ConnectionState = "idle";

  constructor(url: string, options?: WsServiceOptions) {
    this.url = url;

    this.options = {
      reconnect: true,

      reconnectInterval: 1000,

      reconnectMaxInterval: 30000,

      heartbeat: true,

      heartbeatInterval: 15000,

      heartbeatTimeout: 10000,

      debug: false,

      ...options,
    };

    this.resetReady();

    this.connect();

    document.addEventListener("visibilitychange", this.handleVisibilityChange);

    window.addEventListener("online", this.handleOnline);
  }

  // =========================
  // READY
  // =========================

  private resetReady() {
    this.readyPromise = new Promise<void>((resolve) => {
      this.readyResolver = resolve;
    });
  }

  ready() {
    return this.readyPromise;
  }

  // =========================
  // NORMALIZE
  // =========================

  private normalizeChannel(channel: keyof ChannelMap): string {
    return String(channel).trim();
  }

  // =========================
  // CONNECTION
  // =========================

  private connect() {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    this.state = this.reconnectAttempts > 0 ? "reconnecting" : "connecting";

    this.log("connecting...");

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.log("connected");

      this.state = "connected";

      this.reconnectAttempts = 0;

      this.readyResolver();

      this.flushPendingMessages();

      this.rejoinChannels();

      this.startHeartbeat();
    };

    this.socket.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.socket.onerror = (error) => {
      this.log("socket error", error);
    };

    this.socket.onclose = () => {
      this.log("socket closed");

      this.stopHeartbeat();

      this.activeChannels.clear();

      this.resetReady();

      if (!this.options.reconnect) {
        return;
      }

      this.scheduleReconnect();
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      return;
    }

    const delay = Math.min(
      this.options.reconnectInterval * 2 ** this.reconnectAttempts,

      this.options.reconnectMaxInterval,
    );

    this.log(`reconnecting in ${delay}ms`);

    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectTimeout = undefined;

      this.reconnectAttempts++;

      this.connect();
    }, delay);
  }

  private forceReconnect() {
    this.log("force reconnect");

    this.socket?.close();
  }

  // =========================
  // HEARTBEAT
  // =========================

  private startHeartbeat() {
    if (!this.options.heartbeat) {
      return;
    }

    this.stopHeartbeat();

    this.heartbeatTimer = window.setInterval(() => {
      if (this.socket?.readyState !== WebSocket.OPEN) {
        return;
      }

      this.sendRaw({
        type: "ping",
      });

      this.pongTimeout = window.setTimeout(() => {
        this.log("heartbeat timeout");

        this.forceReconnect();
      }, this.options.heartbeatTimeout);
    }, this.options.heartbeatInterval);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
    }
  }

  // =========================
  // MESSAGE
  // =========================

  private handleMessage(raw: string) {
    let data: IWsData;

    try {
      data = JSON.parse(raw);
    } catch {
      this.log("invalid message", raw);

      return;
    }

    // pong
    if (data.type === "pong") {
      if (this.pongTimeout) {
        clearTimeout(this.pongTimeout);
      }

      return;
    }

    // ack join
    if (data.type === "success" && data.action === "join" && data.channel) {
      this.activeChannels.add(data.channel);

      return;
    }

    // ack unjoin
    if (data.type === "success" && data.action === "unjoin" && data.channel) {
      this.activeChannels.delete(data.channel);

      return;
    }

    if (!data.channel) {
      return;
    }

    const channel = data.channel as Extract<keyof ChannelMap, string>;

    const payload = (data.payload ??
      data.message ??
      data) as ChannelMap[typeof channel];

    const handlers = this.handlers[channel];

    // sem listeners -> bufferiza
    if (!handlers || handlers.size === 0) {
      if (!this.messageBuffer[channel]) {
        this.messageBuffer[channel] = [];
      }

      this.messageBuffer[channel]!.push(payload);

      return;
    }

    handlers.forEach((handler) => {
      handler(payload);
    });
  }

  // =========================
  // SEND
  // =========================

  private sendRaw(data: unknown) {
    const message = JSON.stringify(data);

    if (!this.socket) {
      this.pendingMessages.push(message);

      return;
    }

    if (this.socket.readyState !== WebSocket.OPEN) {
      this.pendingMessages.push(message);

      return;
    }

    this.socket.send(message);
  }

  send<T>(data: T) {
    this.sendRaw(data);
  }

  private flushPendingMessages() {
    if (!this.socket) {
      return;
    }

    if (this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.pendingMessages.forEach((message) => {
      this.socket?.send(message);
    });

    this.pendingMessages = [];
  }

  // =========================
  // CHANNELS
  // =========================

  private rejoinChannels() {
    this.desiredChannels.forEach((channel) => {
      this.sendRaw({
        type: "join",

        channel,
      });
    });
  }

  private join(channel: string) {
    if (this.activeChannels.has(channel)) {
      return;
    }

    this.sendRaw({
      type: "join",

      channel,
    });
  }

  private unjoin(channel: string) {
    this.activeChannels.delete(channel);

    this.sendRaw({
      type: "unjoin",

      channel,
    });
  }

  // =========================
  // SUBSCRIBE
  // =========================

  subscribe<K extends keyof ChannelMap>(
    channel: K,
    handler: Handler<ChannelMap[K]>,
  ) {
    const ch = this.normalizeChannel(channel);

    if (!this.handlers[channel]) {
      this.handlers[channel] = new Set();
    }

    this.handlers[channel]!.add(handler);

    this.desiredChannels.add(ch);

    this.join(ch);

    // flush buffer
    const buffered = this.messageBuffer[channel];

    if (buffered?.length) {
      buffered.forEach((payload) => {
        handler(payload);
      });

      delete this.messageBuffer[channel];
    }

    return () => {
      this.unsubscribe(channel, handler);
    };
  }

  unsubscribe<K extends keyof ChannelMap>(
    channel: K,
    handler: Handler<ChannelMap[K]>,
  ) {
    const ch = this.normalizeChannel(channel);

    const handlers = this.handlers[channel];

    if (!handlers) {
      return;
    }

    handlers.delete(handler);

    // ainda existem listeners
    if (handlers.size > 0) {
      return;
    }

    delete this.handlers[channel];

    this.desiredChannels.delete(ch);

    this.unjoin(ch);
  }

  // =========================
  // SESSION
  // =========================

  destroySession() {
    this.log("destroy session");

    this.handlers = {} as HandlerMap<ChannelMap>;

    this.messageBuffer = {} as BufferMap<ChannelMap>;

    this.pendingMessages = [];

    this.desiredChannels.clear();

    this.activeChannels.clear();

    this.stopHeartbeat();

    this.socket?.close();
  }

  close() {
    this.options.reconnect = false;

    this.destroySession();

    this.state = "closed";

    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
    );

    window.removeEventListener("online", this.handleOnline);
  }

  // =========================
  // ONLINE / VISIBILITY
  // =========================

  private handleVisibilityChange = () => {
    if (document.visibilityState !== "visible") {
      return;
    }

    this.checkConnection();
  };

  private handleOnline = () => {
    this.checkConnection();
  };

  private checkConnection() {
    if (!this.socket) {
      this.connect();

      return;
    }

    if (this.socket.readyState === WebSocket.CLOSED) {
      this.connect();
    }
  }

  // =========================
  // LOG
  // =========================

  private log(...args: unknown[]) {
    if (!this.options.debug) {
      return;
    }

    console.log("[WS]", ...args);
  }
}
