import { createUpdateValue } from "@core/general.v1";
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";

interface IMainValues {
  title: string;
  changeTitle: (title: string) => void;
}
const defaultValue: IMainValues = {} as IMainValues;

const MainContext = createContext<IMainValues>(defaultValue);

const MainProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState<IMainValues>(defaultValue);
  const update = useMemo(() => createUpdateValue(setValue), []);

  useEffect(() => {
    update("changeTitle", (title: string) => {
      update("title", title);
    });
  }, [update]);

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export { MainContext, MainProvider };
