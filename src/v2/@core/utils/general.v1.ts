import type { Dispatch, SetStateAction } from "react";
import { isAfter } from "date-fns";
/******************************************************************************/
type UpdateValueFunction<T> = <K extends keyof T>(
  key: K,
  value: T[K],
) => Promise<void>;

export const createUpdateValue = <T>(
  setValue: Dispatch<SetStateAction<T>>,
): UpdateValueFunction<T> => {
  return async <K extends keyof T>(key: K, value: T[K]) => {
    await new Promise<void>((resolve) => {
      setValue((old) => ({ ...old, [key]: value }));
      resolve();
    });
  };
};
/******************************************************************************/
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload;

    if (!payload.exp) {
      return null;
    }

    return new Date(payload.exp * 1000);
  } catch {
    return null;
  }
};

export const validateTokenExpiration = (token: string): boolean => {
  const now = new Date();
  const exp = getTokenExpiration(token) ?? now;
  return isAfter(exp, now);
};

/******************************************************************************/
export const encodeJson = (value: unknown) => {
  return btoa(encodeURIComponent(JSON.stringify(value)));
};

export const decodeJson = <T>(value: string): T => {
  return JSON.parse(decodeURIComponent(atob(value)));
};
/******************************************************************************/
