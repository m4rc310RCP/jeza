// ws.ts

import { WsService } from "./ws-service.v2";

const URL = "wss://node-red.mls.m4rc310.com.br";

export const createJezaUserWs = () => {
  return new WsService<IWsUserChannels["wsAuthChannels"]>(`${URL}/ws/jeza`, {
    debug: true,
    reconnect: true,
    reconnectInterval: 1000,
    reconnectMaxInterval: 30000,
    heartbeat: false,
    heartbeatInterval: 15000,
    heartbeatTimeout: 10000,
  });
};

export const createJezaBalanceWS = () => {
	return new WsService<IWsUserChannels['wsBalanceChannels']>(`${URL}/ws/jeza`, {
		heartbeat:false
	});
}

export const createSiginoutChannel = <T extends string>(
  nr_cpfcnpj: T,
): `jeza:siginout_${T}` => {
  return `jeza:siginout_${nr_cpfcnpj}`;
};

export const createBalanceChannel = <T extends string>(
  nr_cpfcnpj: T,
): `jeza:user_balances_${T}` => {
  return `jeza:user_balances_${nr_cpfcnpj}`;
};
