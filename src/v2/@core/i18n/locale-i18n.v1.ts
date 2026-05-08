import { sprintf } from "sprintf-js";
import ref from "./locales/pt-br.json";

export const m = ref;

export const fmt = <K extends keyof typeof ref>(key: K, ...args: unknown[]) => {
  return sprintf(ref[key], ...args);
};
