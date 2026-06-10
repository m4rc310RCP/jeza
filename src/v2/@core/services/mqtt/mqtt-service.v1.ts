// import mqtt from 'mqtt';
// export const mqttClient = mqtt.connect(
// 	'wss://mosquitto.mls.m4rc310.com.br/mqtt',
// 	{
// 		clientId: 'react-debug-client',
// 		clean: true,
// 		reconnectPeriod: 1000,
// 		keepalive: 30,
// 		protocolId: 'MQTT',
// 		protocolVersion: 5,
// 		will: {
// 			topic: 'WillMsg',
// 			payload: 'Connection Closed abnormally..!',
// 			qos: 0,
// 			retain: false
// 		},
// 	}
// );

import { TypedMqtt } from "./typed-mqtt-fetch.v1";

export const mqttClient = new TypedMqtt<IMQTTParams["mqttChannels"]>({
  // brokerUrl: "mqtt://mosquitto.mls.m4rc310.com.br",
  brokerUrl: "wss://mosquitto.mls.m4rc310.com.br",
  clientId: "client",
  protocolId: "MQTT",
  protocolVersion: 5,
  clean: true,
  resubscribe: true,
  reconnectPeriod: 5000,
  connectTimeout: 10000,
  keepalive: 60,
});

export const createSiginoutChannel = <T extends string>(
  nr_cpfcnpj: T,
): `jeza:signout_${T}` => {
  return `jeza:signout_${nr_cpfcnpj}`;
};
