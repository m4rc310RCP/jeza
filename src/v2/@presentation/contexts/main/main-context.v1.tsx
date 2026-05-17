import {
  createContext,
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createUpdateValue, m } from "@jeza-v2/core/index";
import {
  useStoreLocal,
} from "@jeza-v2/core/data/zustand/zustand-storage.v1";

interface IMMainValues {
  nr_versao: string;
  nm_aplicativo: string;
  oc_usuario: IAwaitValue<IUserApp>;
  fn_login: (auth: IUserAuth) => void;
  fn_refreshToken: () => void;
}
const defaultValue: IMMainValues = {} as IMMainValues;

const MMainContext = createContext<IMMainValues>(defaultValue);

const MMainProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState<IMMainValues>(defaultValue);
  const update = useMemo(() => createUpdateValue(setValue), []);
  const userApp = useStoreLocal((s) => s.userApp);
  useEffect(() => {
    if (!userApp) return;
    update("oc_usuario", { loading: false, value: userApp });
  }, [userApp, update]);

  useEffect(() => {
    window.document.title = m.app_default_title;
    update("nm_aplicativo", m.text_appname);
    // update("fn_login", (nr_cpfcnpj, vl_senha) => {
    //   console.log(vl_senha);

    //   update("oc_usuario", { loading: true });
    //   apiMP
    //     .post(
    //       "/geza/signin",
    //       {
    //         nr_cpfcnpj,
    //         vl_senha,
    //       },
    //       "include",
    //     )
    //     .then((resp) => {
    //       setToken(resp.ds_token);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // });

    update("fn_refreshToken", () => {
      // apiMP
      //   .post("/geza/refresh", undefined, "include")
      //   .then((resp) => {
      //     setToken(resp.ds_token);
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //     setToken(null);
      //   });
    });
  }, [update]);

  return (
    <MMainContext.Provider value={value}>{children}</MMainContext.Provider>
  );
};

export { MMainProvider, MMainContext };
