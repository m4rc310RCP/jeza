import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";
import { apiMP } from "@jeza-v2/core/index";
import { usePersistentScheduler } from "@jeza-v2/core/schedules/schedule-control-time-context.v1";
import { isApiError } from "@jeza-v2/core/services/http/typed-fetch.v2";
import { sanitizeDocument } from "@jeza-v2/core/utils/documents.v1";
import {
	createUpdateValue,
	getTokenExpiration
} from "@jeza-v2/core/utils/general.v1";
import {
	createContext,
	type FC,
	type PropsWithChildren,
	useEffect,
	useMemo,
	useState
} from "react";

const defaultValue: IAppControl = {} as IAppControl;
const MAppContext = createContext<IAppControl>(defaultValue);

type TFlux =
  | "START"
  | "VALIDATE_TOKEN"
  | "REFRESH_TOKEN"
  | "LOAD_USER"
  | "ONLINE"
  | "OFFLINE"
  | "LOGOUT"
  | "NO_TOKEN";

const MAppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [flux, setFlux] = useState<TFlux>("OFFLINE");
  const [auth, setAuth] = useState<{
    doc: string;
    pass: string;
  } | null>();
  const [value, setValue] = useState<IAppControl>(defaultValue);
  const update = useMemo(() => createUpdateValue(setValue), []);

  //--~>
  const setToken = useStoreV1((s) => s.setToken);
  const token = useStoreV1((s) => s.token);
  const nextDate = useStoreV1((s) => s.dateTokenExp);
  const setDateTokenExp = useStoreV1((s) => s.setDateTokenExp);
  const setAppState = useStoreV1((s) => s.setAppState);
  const setUser = useStoreV1((s) => s.setUser);

  //--~>
  usePersistentScheduler({
    nextDate,
    onRun() {
      setFlux("REFRESH_TOKEN");
    },
  });
  //--~>
  useEffect(() => {
    if (!auth) return;
    const process = async () => {
      update("userAuth", { loading: true });
      try {
        const resp = await apiMP.post(
          "/jeza/login",
          { nr_cpfcnpj: sanitizeDocument(auth.doc), vl_senha: auth.pass },
          "include",
        );
        setAuth(null);
        setToken(resp.ds_token);
      } catch (error) {
        setAuth(null);
        setToken(null);

        const message = isApiError(error) ? error.ds_mensagem : String(error);
        update("userAuth", { loading: false, error: message });
      }
    };
    process();
  }, [auth]);

  useEffect(() => {
    if (!token) {
      setDateTokenExp(null);
      setUser(null);
    } else {
      setDateTokenExp(getTokenExpiration(token));
      setFlux("LOAD_USER");
    }
  }, [token]);

  useEffect(() => {
    const process = async () => {
      if (flux === "LOGOUT") {
        setToken(null);
        setAppState("SIGNIN");
      }

      if (flux === "ONLINE") {
        setAppState("ON-LINE");
      }

      if (flux === "REFRESH_TOKEN" && token) {
        try {
          const resp = await apiMP.post("/jeza/refresh", undefined, "include");
          setToken(resp.ds_token);
        } catch (_) {
          // const message = isApiError(error)?error.ds_mensagem: String(error)
          //const message = isApiError(error)?error.ds_mensagem: String(error)
          update("userAuth", {
            loading: false,
            error: m.error_refresh_token_expired,
          });
          setFlux("LOGOUT");
        }
      }
      if (flux === "LOAD_USER" && token) {
        try {
          const resp = await apiMP.post("/jeza/user");
          setUser(resp);
          update("userAuth", { loading: false, value: resp });
          setFlux("ONLINE");
        } catch (error) {
          const message = isApiError(error) ? error.ds_mensagem : String(error);
          update("userAuth", { loading: false, error: message });
          setFlux("LOGOUT");
        }
      }
    };
    process();
  }, [flux]);
  //--~>

  useEffect(() => {
    update("handleLogout", () => {
      setFlux("LOGOUT");
    });
    update("handleLogin", (doc, pass) => {
      setAuth({
        doc,
        pass,
      });
    });
  }, [update]);

  return <MAppContext.Provider value={value}>{children}</MAppContext.Provider>;
};

export { MAppContext, MAppProvider };
