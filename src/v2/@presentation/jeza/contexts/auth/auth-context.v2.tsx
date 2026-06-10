import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { usePersistentScheduler } from "@jeza-v2/core/schedules/schedule-control-time-context.v1";
import { createUpdateValue } from "@jeza-v2/core/utils/general.v1";
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getTokenExpiration } from "@jeza-v2/core/utils/general.v1";
import { apiMP } from "@jeza-v2/core/services/http/geza/geza-map-service.v1";
import { sanitizeDocument } from "@jeza-v2/core/utils/documents.v1";
// import { useMMqtt } from "@jeza-v2/@presentation/jeza/contexts";
// import {
//   createSiginoutChannel,
//   mqttClient,
// } from "@jeza-v2/core/services/mqtt/mqtt-service.v1";
import { isApiError } from "@jeza-v2/core/services/http/typed-fetch.v2";
import { useMMqtt } from "@jeza-v2/presentation/jeza";

interface IMAuthContextValues {
  user: IAwaitValue<IUserAuth>;
  signin: (document: string, password: string) => void;
  signout: () => void;
}
const defaultValue: IMAuthContextValues = {} as IMAuthContextValues;

const MAuthContext = createContext<IMAuthContextValues>(defaultValue);

const MAuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState<IMAuthContextValues>(defaultValue);
  const update = useMemo(() => createUpdateValue(setValue), []);
  // ---------------
  const authStatus = useStoreV1((s) => s.authStatus);
  const setAuthStatus = useStoreV1((s) => s.setAuthStatus);
  const dateTokenExp = useStoreV1((s) => s.dateTokenExp);
  const setDateTokenExp = useStoreV1((s) => s.setDateTokenExp);
  const setToken = useStoreV1((s) => s.setToken);
  const setUser = useStoreV1((s) => s.setUser);
  const user = useStoreV1((s) => s.user);
  const layoutPropsAuth = useStoreV1((s) => s.layoutPropsAuth);
  const setLastDocument = useStoreV1((s) => s.setLastDocument);
  // ---------------
  const { subscribe } = useMMqtt();
  // ---------------
  usePersistentScheduler({
    nextDate: dateTokenExp,
    onRun() {
      setAuthStatus("TOKEN_EXPIRED");
    },
  });
  // ---------------
  const handleSetToken = useCallback(
    (token: string) => {
      setAuthStatus("AUTHORIZED");
      setToken(token);
      setDateTokenExp(getTokenExpiration(token));
    },
    [setAuthStatus, setDateTokenExp, setToken],
  );

  const handleSignout = useCallback(() => {
    setAuthStatus("UNAUTHORIZED");
    setToken(null);
    setDateTokenExp(null);
    setUser(null);
  }, [setAuthStatus, setToken, setDateTokenExp, setUser]);

  const handleSignin = useCallback(
    async (document: string, password: string) => {
      update("user", { loading: true });
      try {
        const cc = sanitizeDocument(document);
        const resp = await apiMP.post("/geza/signin", {
          nr_cpfcnpj: cc,
          vl_senha: password,
        });
        handleSetToken(resp.ds_token);
        const user = await apiMP.post("/geza/user");
        setUser(user);
      } catch (error) {
        const message = isApiError(error) ? error.ds_mensagem : String(error);
        update("user", { loading: false, error: message });
      }
    },
    [handleSetToken, setUser, update],
  );

  const handleRefreshToken = useCallback(async () => {
    try {
      const resp = await apiMP.post("/geza/refresh", undefined, "include");
      handleSetToken(resp.ds_token);
    } catch (error) {}
  }, []);

  // ---------------
  // useEffect(() => {
  //   if (authStatus !== "AUTHORIZED") return;
  //   const document = user?.nr_cpfcnpj;
  //   if (!document) return;
  //   const channel = createSiginoutChannel(document);
  //   console.log("[MQTT] REGISTER", channel);
  //   const unsubscribe = mqttClient.subscribe(channel, (payload) => {
  //     console.log("[MQTT] SIGNOUT MESSAGE", payload);
  //     handleSignout();
  //   });
  //   return () => {
  //     console.log("[MQTT] UNREGISTER", channel);
  //     unsubscribe();
  //   };
  // }, [authStatus, user?.nr_cpfcnpj, handleSignout]);
  // ---------------
  useEffect(() => {
    if (layoutPropsAuth && user) {
      if (layoutPropsAuth.isSaveLastDocument) {
        setLastDocument(user.nr_cpfcnpj);
      } else {
        setLastDocument(null);
      }
    }
  }, [layoutPropsAuth, user]);
  // ---------------
  useEffect(() => {
    if (user) {
      update("user", { loading: false, value: user });
    }
  }, [user, update]);
  // ---------------
  useEffect(() => {
    if (authStatus === "TOKEN_EXPIRED") {
      handleRefreshToken();
    }
  }, [authStatus, handleRefreshToken]);
  // ---------------
  useEffect(() => {
    // setLastDocument('03057532900')
    update("signin", handleSignin);
    update("signout", handleSignout);
  }, [update, handleSetToken, handleSignin, handleSignout]);
  // ---------------
  return (
    <MAuthContext.Provider value={value}>{children}</MAuthContext.Provider>
  );
};

export { MAuthContext, MAuthContextProvider };
