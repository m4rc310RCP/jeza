import { useEffect, useRef } from "react";
import mqtt, { MqttClient } from "mqtt";

export const useMQTT = () => {
  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    const client = mqtt.connect(
      "https://mosquitto.mls.m4rc310.com.br",
      {
        clientId: `web-${crypto.randomUUID()}`,
        reconnectPeriod: 5000,
      }
    );

    clientRef.current = client;

    return () => {
      client.end();
    };
  }, []);

  const publish = (topic: string, message: string) => {
    clientRef.current?.publish(topic, message);
  };

  const subscribe = (
    topic: string,
    callback: (message: string) => void
  ) => {
    const client = clientRef.current;

    if (!client) return;

    client.subscribe(topic);

    client.on("message", (receivedTopic, payload) => {
      if (receivedTopic === topic) {
        callback(payload.toString());
      }
    });
  };

  return {
    publish,
    subscribe,
  };
};