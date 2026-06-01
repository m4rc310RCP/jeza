import { useContext } from "react";
import { MAuthContext } from "../auth/auth-context.v1";
import { MAppContext } from "../app/app-context.v1";

export const useMAuth = () => useContext(MAuthContext);
export const useMApp = () => useContext(MAppContext);