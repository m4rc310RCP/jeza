import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createUpdateValue } from "@jeza-v2/core/utils/general.v1";
import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { usePersistentScheduler } from "@jeza-v2/core/schedules/schedule-control-time-context.v1";
import { apiMP, createSiginoutChannel } from "@jeza-v2/core/index";
import { sanitizeDocument } from "@jeza-v2/core/utils/documents.v1";
import { getTokenExpiration } from "@jeza-v2/core/utils/general.v1";
import { isApiError } from "@jeza-v2/core/services/http/typed-fetch.v2";
import { createJezaUserWs } from "@jeza-v2/core/services/ws/jesa-user-ws.v1";

// --------------------------------------------------------
// TYPES
// --------------------------------------------------------

interface IMAuthValues {
  oc_autenticado: IAwaitValue<IUserAuth>;
  nr_cpfcnpj: string | null;
  st_screen: TScreen;
  ds_test: string;
  fn_login: (auth: IUserAuth) => Promise<void>;
  fn_logout: () => Promise<void>;
  fn_refresh: () => Promise<void>;
}

// --------------------------------------------------------
// DEFAULT
// --------------------------------------------------------

const defaultValue = {} as IMAuthValues;

// --------------------------------------------------------
// CONTEXT
// --------------------------------------------------------

const MAuthContext = createContext<IMAuthValues>(defaultValue);

// --------------------------------------------------------
// PROVIDER
// --------------------------------------------------------

const MAuthProvider: FC<PropsWithChildren> = ({ children }) => {
  // --------------------------------------------------------
  // STATE
  // --------------------------------------------------------

  const [value, setValue] = useState<IMAuthValues>(defaultValue);

  const update = useMemo(() => createUpdateValue(setValue), []);

  // --------------------------------------------------------
  // STORE
  // --------------------------------------------------------

  const setToken = useLayoutStore((s) => s.setToken);
  const setScreen = useLayoutStore((s) => s.setScreen);
  const setDateExpiration = useLayoutStore((s) => s.setDateExpiration);
  const dateExpiration = useLayoutStore((s) => s.dateExpiration);
  const user = useLayoutStore((s) => s.user);
  const setUser = useLayoutStore((s) => s.setUser);
  const cpfCnpj = useLayoutStore((s) => s.cpfCnpj);
  const setCpfCnpj = useLayoutStore((s) => s.setCpfCnpj);

  // --------------------------------------------------------
  // WS
  // --------------------------------------------------------

  const wsRef = useRef(createJezaUserWs());
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const activeSiginOutChannelRef = useRef<string | null>(null);

  // --------------------------------------------------------
  // HELPERS
  // --------------------------------------------------------

  const clearAuth = useCallback(() => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    activeSiginOutChannelRef.current = null;
    wsRef.current.destroySession();
    setUser(null);
    setToken(null);
    setDateExpiration(null);
    setCpfCnpj(null);
    update("oc_autenticado", {
      loading: false,
    });
  }, [setCpfCnpj, setDateExpiration, setToken, setUser, update]);

  // --------------------------------------------------------
  // USER -> SCREEN
  // --------------------------------------------------------

  useEffect(() => {
    if (!user) {
      setScreen("signin");
      return;
    }
    const document = sanitizeDocument(user.nr_cpfcnpj);
    setCpfCnpj(document);
    setScreen("home");
  }, [user, setCpfCnpj, setScreen]);

  // --------------------------------------------------------
  // WS SUBSCRIBE
  // --------------------------------------------------------
  useEffect(() => {
    if (!cpfCnpj) {
      return;
    }
    const siginoutCPFChannel = createSiginoutChannel(cpfCnpj);
    // evita subscribe duplicado
    if (activeSiginOutChannelRef.current === siginoutCPFChannel) {
      return;
    }
    // limpa subscribe anterior
    unsubscribeRef.current?.();
    unsubscribeRef.current = wsRef.current.subscribe(siginoutCPFChannel, () => {
      // logout remoto
      clearAuth();
    });
    activeSiginOutChannelRef.current = siginoutCPFChannel;
    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
      activeSiginOutChannelRef.current = null;
    };
  }, [clearAuth, cpfCnpj, update]);

  // --------------------------------------------------------
  // REFRESH TOKEN
  // --------------------------------------------------------

  const handleRefresh = useCallback(async () => {
    try {
      console.log("refshtoken");
      const refresh = await apiMP.post("/jeza/refresh", undefined, "include");
      const token = refresh.ds_token;
      setToken(token);
      setDateExpiration(getTokenExpiration(token));
      const currentUser = await apiMP.post("/jeza/user");
      setUser(currentUser);
      setCpfCnpj(sanitizeDocument(currentUser.nr_cpfcnpj));
    } catch (error) {
      if (isApiError(error) && error.cd_erro === 401) {
        clearAuth();
        return;
      }
      console.error(error);
    }
  }, [clearAuth, setCpfCnpj, setDateExpiration, setToken, setUser]);

  // --------------------------------------------------------
  // PERSISTENT SCHEDULER
  // --------------------------------------------------------

  usePersistentScheduler({
    nextDate: dateExpiration,
    onRun() {
      handleRefresh();
    },
  });

  // --------------------------------------------------------
  // LOGIN
  // --------------------------------------------------------

  const handleLogin = useCallback(
    async ({ nr_cpfcnpj, vl_senha }: IUserAuth) => {
      try {
        update("oc_autenticado", {
          loading: true,
        });
        const document = sanitizeDocument(nr_cpfcnpj);
        const response = await apiMP.post(
          "/jeza/login",
          {
            nr_cpfcnpj: document,
            vl_senha,
          },
          "include",
        );

        const token = response.ds_token;
        setToken(token);
        setDateExpiration(getTokenExpiration(token));
        const currentUser = await apiMP.post("/jeza/user");
        setUser(currentUser);
        update("oc_autenticado", {
          loading: false,
          value: currentUser,
        });
      } catch (error) {
        update("oc_autenticado", {
          loading: false,

          error: isApiError(error) ? error.ds_mensagem : "Erro ao autenticar.",
        });
      }
    },
    [setDateExpiration, setToken, setUser, update],
  );

  // --------------------------------------------------------
  // LOGOUT
  // --------------------------------------------------------

  const handleLogout = useCallback(async () => {
    clearAuth();
  }, [clearAuth]);

  // --------------------------------------------------------
  // CONTEXT FUNCTIONS
  // --------------------------------------------------------

  useEffect(() => {
    update("fn_login", handleLogin);
    update("fn_logout", handleLogout);
    update("fn_refresh", handleRefresh);
  }, [handleLogin, handleLogout, handleRefresh, update]);

  // --------------------------------------------------------
  // UNMOUNT
  // --------------------------------------------------------

  useEffect(() => {
    const ws = wsRef.current;

    return () => {
      unsubscribeRef.current?.();
      ws.close();
    };
  }, []);

  // --------------------------------------------------------
  // PROVIDER
  // --------------------------------------------------------

  return (
    <MAuthContext.Provider value={value}>{children}</MAuthContext.Provider>
  );
};

// --------------------------------------------------------
// EXPORTS
// --------------------------------------------------------

export { MAuthContext, MAuthProvider };
