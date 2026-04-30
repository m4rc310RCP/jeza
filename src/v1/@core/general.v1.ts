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
