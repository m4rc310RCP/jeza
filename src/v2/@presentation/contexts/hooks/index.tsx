import { useContext } from "react";
import {
  MMainContext,
  MAuthContext,
  MTabContextContext,
  MAppContext,
} from "../index";

export const useMMain = () => useContext(MMainContext);
export const useMAuth = () => useContext(MAuthContext);
export const useMTab = () => useContext(MTabContextContext);
export const useMApp = () => useContext(MAppContext);
