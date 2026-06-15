import {
  createContext,
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  createUpdateValue,
  validateTokenExpiration,
  getTokenExpiration,
} from "@jeza-v2/core/utils/general.v1";
import { sanitizeDocument } from "@jeza-v2/core/utils/documents.v1";
import { apiMP } from "@jeza-v2/core/index";
import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { isApiError } from "@jeza-v2/core/services/http/typed-fetch.v2";
import { usePersistentScheduler } from "@jeza-v2/core/schedules/schedule-control-time-context.v1";

const defaultValue: IAppControl = {} as IAppControl;
const MAppContext = createContext<IAppControl>(defaultValue);

type TFlux =
  | "START"
  | "VALIDATE_TOKEN"
  | "REFRESH_TOKEN"
  | "LOAD_USER"
  | "ONLINE"
  | "LOGOUT"
  | "NO_TOKEN";

type TAction =
  | { type: "START" }
  | { type: "VALIDATE_TOKEN" }
  | { type: "REFRESH_TOKEN" }
  | { type: "LOAD_USER" }
  | { type: "ONLINE" }
  | { type: "LOGOUT" }
  | { type: "NO_TOKEN" };

function fluxReducer(_: TFlux, action: TAction): TFlux {
  switch (action.type) {
    case "START":
      return "START";
    case "VALIDATE_TOKEN":
      return "VALIDATE_TOKEN";
    case "REFRESH_TOKEN":
      return "REFRESH_TOKEN";
    case "LOAD_USER":
      return "LOAD_USER";
    case "ONLINE":
      return "ONLINE";
    case "LOGOUT":
      return "LOGOUT";
    case "NO_TOKEN":
      return "NO_TOKEN";
    default:
      return "START";
  }
}

const MAppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState<IAppControl>(defaultValue);
  const update = useMemo(() => createUpdateValue(setValue), []);

  const [flux, dispatch] = useReducer(fluxReducer, "START");

  const token = useStoreV1((s) => s.token);
  const setToken = useStoreV1((s) => s.setToken);
  const setAppState = useStoreV1((s) => s.setAppState);
  const dateTokenExp = useStoreV1((s) => s.dateTokenExp);
  const setDateTokenExp = useStoreV1((s) => s.setDateTokenExp);

  /**
   * Refresh automático
   */
  usePersistentScheduler({
    nextDate: dateTokenExp,
    onRun() {
      dispatch({ type: "REFRESH_TOKEN" });
    },
  });

  /**
   * Registra handlers apenas uma vez
   */
  useEffect(() => {
    update("handleLogin", async (documento, senha) => {
      try {
        update("userAuth", {
          loading: true,
        });

        const auth = await apiMP.post("/jeza/login", {
          nr_cpfcnpj: sanitizeDocument(documento),
          vl_senha: senha,
        });

        setToken(auth.ds_token);

        dispatch({
          type: "VALIDATE_TOKEN",
        });
      } catch (error) {
        const message = isApiError(error) ? error.ds_mensagem : String(error);

        update("userAuth", {
          loading: false,
          error: message,
        });
      }
    });

    update("handleLogout", () => {
      dispatch({ type: "LOGOUT" });
    });
  }, [update, setToken]);

  /**
   * Inicialização
   */
  useEffect(() => {
    dispatch({ type: "VALIDATE_TOKEN" });
  }, []);

  /**
   * Máquina de estados
   */
  useEffect(() => {
    const run = async () => {
      try {
        switch (flux) {
          case "START":
            break;

          case "VALIDATE_TOKEN":
            if (!token) {
              dispatch({
                type: "NO_TOKEN",
              });
              return;
            }
            if (!validateTokenExpiration(token)) {
              dispatch({
                type: "REFRESH_TOKEN",
              });
              return;
            }
            setDateTokenExp(getTokenExpiration(token));
            dispatch({
              type: "LOAD_USER",
            });
            break;
          case "REFRESH_TOKEN": {
            const refresh = await apiMP.post(
              "/jeza/refresh",
              undefined,
              "include",
            );
            setToken(refresh.ds_token);
            dispatch({
              type: "VALIDATE_TOKEN",
            });
            break;
          }
          case "LOAD_USER": {
            update("userAuth", {
              loading: true,
            });
            const user = await apiMP.post("/jeza/user");
            update("userAuth", {
              loading: false,
              value: user,
            });
            dispatch({
              type: "ONLINE",
            });
            break;
          }
          case "ONLINE":
            setAppState("ON-LINE");
            break;
          case "NO_TOKEN":
            setDateTokenExp(null);
            dispatch({
              type: "LOGOUT",
            });
            break;
          case "LOGOUT":
            setToken(null);
            setDateTokenExp(null);

            update("userAuth", {
              loading: false,
            });

            setAppState("SIGNIN");
            break;
        }
      } catch (error) {
        const message = isApiError(error) ? error.ds_mensagem : String(error);

        update("userAuth", {
          loading: false,
          error: message,
        });

        dispatch({
          type: "LOGOUT",
        });
      }
    };

    void run();
  }, [flux, token, update, setToken, setAppState, setDateTokenExp]);

  return <MAppContext.Provider value={value}>{children}</MAppContext.Provider>;
};

export { MAppProvider, MAppContext };
