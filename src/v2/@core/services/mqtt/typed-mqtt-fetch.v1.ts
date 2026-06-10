import mqtt, { type IClientOptions, type MqttClient } from "mqtt";

type Handler<T> = (payload: T) => void;

type HandlerMap<ChannelMap extends Record<string, unknown>> = Partial<{
  [K in keyof ChannelMap]: Handler<ChannelMap[K]>[];
}>;

interface TypedMqttOptions extends IClientOptions {
  brokerUrl: string;
}

export class TypedMqtt<ChannelMap extends Record<string, unknown>> {
  private client: MqttClient;
  private handlers: HandlerMap<ChannelMap> = {};
  constructor(options: TypedMqttOptions) {
    this.client = mqtt.connect(options.brokerUrl, options);
    this.client.on("message", (topic, payload) => {
      try {
        const data = JSON.parse(payload.toString());
        this.handlers[topic as keyof ChannelMap]?.forEach((handler) =>
          handler(data as never),
        );
      } catch (error) {
        console.error(`Erro ao processar tópico "${topic}"`, error);
      }
    });
  }

  // public subscribe<K extends keyof ChannelMap>(
  // 	topic: K,
  // 	handler: Handler<ChannelMap[K]>,
  // ) {
  // 	this.handlers[topic] ??= [];
  // 	if (!this.handlers[topic]!.includes(handler)) {
  // 		this.handlers[topic]!.push(handler);
  // 	}
  // 	if (this.handlers[topic]!.length === 1) {
  // 		this.client.subscribe(topic as string);
  // 	}
  // }

  public subscribe<K extends keyof ChannelMap>(
    topic: K,
    handler: Handler<ChannelMap[K]>,
  ): () => void {
    this.handlers[topic] ??= [];
    this.handlers[topic]!.push(handler);

    if (this.handlers[topic]!.length === 1) {
      this.client.subscribe(topic as string);
    }

    return () => {
      this.unsubscribe(topic, handler);
    };
  }

  // public unsubscribe<K extends keyof ChannelMap>(
  //   topic: K,
  //   handler?: Handler<ChannelMap[K]>,
  // ) {
  //   if (handler) {
  //     this.handlers[topic] =
  //       this.handlers[topic]?.filter((h) => h !== handler) ?? [];
  //   } else {
  //     delete this.handlers[topic];
  //     this.client.unsubscribe(topic as string);
  //   }
  // }
  public unsubscribe<K extends keyof ChannelMap>(
    topic: K,
    handler?: Handler<ChannelMap[K]>,
  ) {
    if (!this.handlers[topic]) return;

    if (handler) {
      this.handlers[topic] = this.handlers[topic]!.filter((h) => h !== handler);

      if (this.handlers[topic]!.length === 0) {
        delete this.handlers[topic];
        this.client.unsubscribe(topic as string);
      }

      return;
    }
    delete this.handlers[topic];
    this.client.unsubscribe(topic as string);
  }

  public publish<K extends keyof ChannelMap>(topic: K, payload: ChannelMap[K]) {
    this.client.publish(topic as string, JSON.stringify(payload));
  }

  public disconnect() {
    this.client.end();
  }
}
