import { useContext } from "react";
import { MMainContext, MAuthContext, MTabContextContext } from "../index";

export const useMMain = () => useContext(MMainContext);
export const useMAuth = () => useContext(MAuthContext);
export const useMTab = () => useContext(MTabContextContext);
