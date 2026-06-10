import { useContext } from "react";
import { MAuthContext } from "../auth/auth-context.v3";
import { MAppContext } from "../app/app-context.v1";
import { MMqttContext } from "../mqtt/mqtt-context.v1";
import { MTabContext } from "../tabs/tab-context.v1";

export const useMAuth = () => useContext(MAuthContext);
export const useMApp = () => useContext(MAppContext);
// export const useMMqtt = () => useContext(MMqttContext);
export const useMMqtt = () => useContext(MMqttContext);
export const useMTab = () => useContext(MTabContext);
