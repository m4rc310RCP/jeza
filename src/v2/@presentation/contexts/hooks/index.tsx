import { useContext } from "react";
import { MMainContext, MAuthContext } from "../index";

export const useMMain = () => useContext(MMainContext);
export const useMAuth = () => useContext(MAuthContext);
