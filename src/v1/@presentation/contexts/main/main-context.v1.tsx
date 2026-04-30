import { createUpdateValue } from "@core/general.v1";
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";

import { m } from "@presentation/i18n/locale-i18n.v1";

interface IMainValues {
  changeTitle: (title: string) => void;
}
const defaultValue: IMainValues = {} as IMainValues;

const MainContext = createContext<IMainValues>(defaultValue);

const MainProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState<IMainValues>(defaultValue);
  const update = useMemo(() => createUpdateValue(setValue), []);

  useEffect(() => {
    window.document.title = m.app_default_title;
    update("changeTitle", (title: string) => {
      window.document.title = title ?? m.app_default_title;
    });
  }, [update]);

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export { MainContext, MainProvider };
