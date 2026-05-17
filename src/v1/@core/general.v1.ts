import type { Dispatch, SetStateAction } from "react";
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
