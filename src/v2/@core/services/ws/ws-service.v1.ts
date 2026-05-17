type Handler<T> = (payload: T) => void;

interface IWsData {
  type?: "success" | "error" | "message";
  action?: "join" | "unjoin";
  channel?: string;
  message?: unknown;
  payload?: unknown;
}

interface WsServiceOptions {
  reconnect?: boolean;
  reconnectInterval?: number;
  debug?: boolean;
}

type HandlerMap<ChannelMap extends Record<string, unknown>> = Partial<{
  [K in keyof ChannelMap]: Handler<ChannelMap[K]>[];
}>;

type BufferMap<ChannelMap extends Record<string, unknown>> = Partial<{
  [K in keyof ChannelMap]: ChannelMap[K][];
}>;

export class WsService<ChannelMap extends Record<string, unknown>> {
  private socket?: WebSocket;

  private url: string;

  private options: WsServiceOptions;

  private handlers: HandlerMap<ChannelMap> = {};

  private pendingMessages: string[] = [];

  private joinedChannels = new Set<string>();

  private joinedConfirmed = new Set<string>();

  private pendingJoinResolvers = new Map<string, () => void>();

  private messageBuffer: BufferMap<ChannelMap> = {};

  private reconnectTimeout?: number;

  private readyPromise!: Promise<void>;

  private readyResolver!: () => void;

  constructor(url: string, options?: WsServiceOptions) {
    this.url = url;

    this.options = {
      reconnect: true,
      reconnectInterval: 3000,
      debug: false,
      ...options,
    };

    this.resetReady();

    this.connect();
  }

  // =====================
  // NORMALIZAÇÃO
  // =====================

  private normalizeChannel<K extends keyof ChannelMap>(channel: K): K {
    return String(channel).trim() as K;
  }

  private normalizeRawChannel(channel: string) {
    return channel.trim();
  }

  // =====================
  // READY
  // =====================

  private resetReady() {
    this.readyPromise = new Promise<void>((resolve) => {
      this.readyResolver = resolve;
    });
  }

  ready() {
    return this.readyPromise;
  }

  // =====================
  // CONNECTION
  // =====================

  private connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.readyResolver();

      // envia fila
      this.pendingMessages.forEach((msg) => {
        this.socket?.send(msg);
      });

      this.pendingMessages = [];

      // rejoin
      this.joinedChannels.forEach((channel) => {
        this.send({
          type: "join",
          channel,
        });
      });
    };

    this.socket.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.socket.onerror = (err) => {
      this.log("WS erro:", err);
    };

    this.socket.onclose = () => {
      this.log("WS fechado");

      this.resetReady();

      this.joinedConfirmed.clear();

      if (this.options.reconnect) {
        this.scheduleReconnect();
      }
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;

    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectTimeout = undefined;

      this.connect();
    }, this.options.reconnectInterval);
  }

  // =====================
  // MESSAGE HANDLING
  // =====================

  private handleMessage(raw: string) {
    let data: IWsData;

    try {
      data = JSON.parse(raw);
    } catch {
      this.log("Mensagem inválida:", raw);
      return;
    }

    // ACK JOIN
    if (data.type === "success" && data.action === "join" && data.channel) {
      const ch = this.normalizeRawChannel(data.channel);

      this.joinedConfirmed.add(ch);

      const resolve = this.pendingJoinResolvers.get(ch);

      if (resolve) {
        resolve();

        this.pendingJoinResolvers.delete(ch);
      }

      return;
    }

    if (!data.channel) return;

    const ch = this.normalizeRawChannel(data.channel) as keyof ChannelMap;

    const payload = (data.payload ??
      data.message ??
      data) as ChannelMap[keyof ChannelMap];

    const handlers = this.handlers[ch];

    // bufferiza se não houver handlers
    if (!handlers || handlers.length === 0) {
      if (!this.messageBuffer[ch]) {
        this.messageBuffer[ch] = [];
      }

      this.messageBuffer[ch]!.push(payload);

      return;
    }

    handlers.forEach((fn) => {
      fn(payload);
    });
  }

  // =====================
  // JOIN CONTROL
  // =====================

  async joinAsync<K extends keyof ChannelMap>(channel: K) {
    const ch = this.normalizeChannel(channel);

    await this.ready();

    if (this.joinedConfirmed.has(ch as string)) {
      return;
    }

    return new Promise<void>((resolve) => {
      this.pendingJoinResolvers.set(ch as string, resolve);

      this.join(ch);
    });
  }

  // =====================
  // API
  // =====================

  async on<K extends keyof ChannelMap>(
    channel: K,
    handler: Handler<ChannelMap[K]>,
  ) {
    const ch = this.normalizeChannel(channel);

    if (!this.handlers[ch]) {
      this.handlers[ch] = [];

      // join imediato
      this.join(ch);

      // confirmação async
      this.joinAsync(ch).catch(() => {});
    }

    const handlers = this.handlers[ch] as Handler<ChannelMap[K]>[];

    if (!handlers.includes(handler)) {
      handlers.push(handler);
    }

    // libera buffer
    const buffered = this.messageBuffer[ch] as ChannelMap[K][] | undefined;

    if (buffered?.length) {
      buffered.forEach((msg) => {
        handler(msg);
      });

      delete this.messageBuffer[ch];
    }
  }

  off<K extends keyof ChannelMap>(channel: K, handler: Handler<ChannelMap[K]>) {
    const ch = this.normalizeChannel(channel);

    const handlers = this.handlers[ch] as Handler<ChannelMap[K]>[] | undefined;

    if (!handlers) return;

    this.handlers[ch] = handlers.filter(
      (h) => h !== handler,
    ) as HandlerMap<ChannelMap>[K];

    if (!this.handlers[ch]?.length) {
      this.unjoin(ch);
    }
  }

  async send<T>(data: T) {
    const message = JSON.stringify(data);

    await this.ready();

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.pendingMessages.push(message);
      return;
    }

    this.socket.send(message);
  }

  join<K extends keyof ChannelMap>(channel: K) {
    const ch = this.normalizeChannel(channel);

    if (this.joinedChannels.has(ch as string)) {
      return;
    }

    this.joinedChannels.add(ch as string);

    this.send({
      type: "join",
      channel: ch,
    });
  }

  unjoin<K extends keyof ChannelMap>(channel: K) {
    const ch = this.normalizeChannel(channel);

    if (
      !this.joinedChannels.has(ch as string) &&
      !this.joinedConfirmed.has(ch as string)
    ) {
      return;
    }

    this.joinedChannels.delete(ch as string);

    this.joinedConfirmed.delete(ch as string);

    this.send({
      type: "unjoin",
      channel: ch,
    });
  }

  close() {
    this.options.reconnect = false;

    this.socket?.close();
  }

  private log(...args: unknown[]) {
    if (this.options.debug) {
      console.log("[WS]", ...args);
    }
  }
}
