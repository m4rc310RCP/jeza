import { useContext } from "react";
import { MAppContext, MTabContext } from "@jeza-v2/presentation/jeza/contexts";

export const useMApp = () => useContext(MAppContext);
export const useMTab = () => useContext(MTabContext);
