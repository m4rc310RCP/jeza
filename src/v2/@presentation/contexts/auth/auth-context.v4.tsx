import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { isBefore, subSeconds } from "date-fns";

import { apiMP } from "@jeza-v2/core/services/http/geza/geza-map-service.v1";

import { isApiError } from "@jeza-v2/core/services/http/typed-fetch.v2";

import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";

import {
  createUpdateValue,
  getTokenExpiration,
} from "@jeza-v2/core/utils/general.v1";

import { sanitizeDocument } from "@jeza-v2/core/utils/documents.v1";

import { usePersistentScheduler } from "@jeza-v2/core/schedules/schedule-control-time-context.v1";

// --------------------------------------------------------
// Types
// --------------------------------------------------------

interface IMAuthValues {
  oc_autenticado: IAwaitValue<IUserAuth>;

  fn_login: (auth: IUserAuth) => Promise<void>;

  fn_logout: () => Promise<void>;

  fn_refresh: () => Promise<void>;

  nr_cpfcnpj: string | null;

  st_screen: TScreen;
}

// --------------------------------------------------------
// Default
// --------------------------------------------------------

const defaultValue: IMAuthValues = {
  oc_autenticado: {
    loading: true,
  },
} as IMAuthValues;

// --------------------------------------------------------
// Context
// --------------------------------------------------------

const MAuthContext = createContext<IMAuthValues>(defaultValue);

// --------------------------------------------------------
// Provider
// --------------------------------------------------------

const MAuthProvider: FC<PropsWithChildren> = ({ children }) => {
  // --------------------------------------------------------
  // Context State
  // --------------------------------------------------------

  const [value, setValue] = useState<IMAuthValues>(defaultValue);

  const update = useMemo(() => createUpdateValue(setValue), []);

  // --------------------------------------------------------
  // Zustand
  // --------------------------------------------------------

  const token = useLayoutStore((s) => s.token);
  const setToken = useLayoutStore((s) => s.setToken);

  const setScreen = useLayoutStore((s) => s.setScreen);

  const setUser = useLayoutStore((s) => s.setUser);

  const setCpfCnpj = useLayoutStore((s) => s.setCpfCnpj);
  // --------------------------------------------------------
  // Scheduler
  // --------------------------------------------------------

  const [nextRefreshDate, setNextRefreshDate] = useState<Date>();

  // --------------------------------------------------------
  // Helpers
  // --------------------------------------------------------

  const scheduleRefresh = useCallback((currentToken: string) => {
    const exp = getTokenExpiration(currentToken);

    if (!exp) {
      setNextRefreshDate(undefined);

      return;
    }

    /**
     * refresh 30s antes
     */
    const refreshDate = subSeconds(exp, 30);

    const now = new Date();

    /**
     * evita datas passadas
     */
    if (!isBefore(now, refreshDate)) {
      setNextRefreshDate(new Date(now.getTime() + 5000));

      return;
    }

    setNextRefreshDate(refreshDate);
  }, []);

  // --------------------------------------------------------
  // Logout
  // --------------------------------------------------------

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);

    setNextRefreshDate(undefined);

    update("oc_autenticado", {
      loading: false,
      value: undefined,
      error: undefined,
    });

    setScreen("signin");
  }, [setToken, setScreen, update, setUser]);

  // --------------------------------------------------------
  // Fetch User
  // --------------------------------------------------------

  const fetchUser = useCallback(async () => {
    try {
      update("oc_autenticado", { loading: true });
      const user = await apiMP.post("/geza/user", undefined);

      update("oc_autenticado", {
        loading: false,
        value: user,
        error: undefined,
      });

      setUser(user);
      setCpfCnpj(user.nr_cpfcnpj);

      setScreen("home");

      return user;
    } catch {
      await logout();

      return null;
    }
  }, [logout, setScreen, update, setCpfCnpj, setUser]);

  // --------------------------------------------------------
  // Refresh Token
  // --------------------------------------------------------

  const refreshToken = useCallback(async () => {
    try {
      const res = await apiMP.post("/geza/refresh", undefined, "include");

      const newToken = res.ds_token as string;

      setToken(newToken);

      /**
       * reagenda próximo refresh
       */
      scheduleRefresh(newToken);

      return newToken;
    } catch {
      await logout();

      return null;
    }
  }, [logout, scheduleRefresh, setToken]);

  // --------------------------------------------------------
  // Validate Session
  // --------------------------------------------------------

  const validateSession = useCallback(
    async (currentToken?: string) => {
      try {
        const tokenValue = currentToken ?? token;

        if (!tokenValue) {
          await logout();

          return;
        }

        const now = new Date();

        const exp = getTokenExpiration(tokenValue);

        if (!exp) {
          await logout();

          return;
        }

        /**
         * token expirado
         */
        if (!isBefore(now, exp)) {
          const newToken = await refreshToken();

          if (!newToken) {
            return;
          }

          await fetchUser();

          return newToken;
        }

        /**
         * token válido
         * reagenda refresh
         */
        scheduleRefresh(tokenValue);

        await fetchUser();

        return tokenValue;
      } catch {
        await logout();
      }
    },
    [token, logout, fetchUser, refreshToken, scheduleRefresh],
  );

  // --------------------------------------------------------
  // Login
  // --------------------------------------------------------

  const login = useCallback(
    async ({ nr_cpfcnpj, vl_senha }: IUserAuth) => {
      try {
        update("oc_autenticado", {
          loading: true,
          error: undefined,
        });

        const document = sanitizeDocument(nr_cpfcnpj);

        const res = await apiMP.post("/geza/signin", {
          nr_cpfcnpj: document,
          vl_senha,
        });

        const newToken = res.ds_token as string;

        setToken(newToken);

        /**
         * agenda refresh
         */
        scheduleRefresh(newToken);

        update("nr_cpfcnpj", document);

        await validateSession(newToken);
      } catch (error) {
        const message = isApiError(error) ? error.ds_mensagem : "Erro interno";

        update("oc_autenticado", {
          loading: false,
          error: message,
        });
      }
    },
    [setToken, scheduleRefresh, update, validateSession],
  );

  // --------------------------------------------------------
  // Manual Refresh
  // --------------------------------------------------------

  const handleRefresh = useCallback(async () => {
    const newToken = await refreshToken();
    if (!newToken) {
      return;
    }
    await fetchUser();
  }, [refreshToken, fetchUser]);

  // --------------------------------------------------------
  // Scheduler
  // --------------------------------------------------------

  usePersistentScheduler({
    enabled: !!nextRefreshDate,
    nextDate: nextRefreshDate,
    async onRun() {
      await handleRefresh();
    },
  });

  // --------------------------------------------------------
  // Bootstrap
  // --------------------------------------------------------

  useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		validateSession();
  }, [validateSession]);

  // useEffect(() => {
  //   let mounted = true;

  //   const bootstrap = async () => {
  //     await Promise.resolve();

  //     if (!mounted) return;

  //     const validToken = await validateSession();

  //     if (!mounted || !validToken) {
  //       return;
  //     }

  //     await fetchUser();
  //   };

  //   void bootstrap();

  //   return () => {
  //     mounted = false;
  //   };
  // }, [validateSession, fetchUser]);

  // --------------------------------------------------------
  // Context Functions
  // --------------------------------------------------------

  useEffect(() => {
    update("fn_login", login);
    update("fn_logout", logout);
    update("fn_refresh", handleRefresh);
  }, [login, logout, handleRefresh, update]);

  // --------------------------------------------------------
  // Provider
  // --------------------------------------------------------

  return (
    <MAuthContext.Provider value={value}>{children}</MAuthContext.Provider>
  );
};

// --------------------------------------------------------
// Exports
// --------------------------------------------------------

export { MAuthContext, MAuthProvider };
