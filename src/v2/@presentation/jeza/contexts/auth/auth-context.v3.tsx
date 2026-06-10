import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { apiMP } from "@jeza-v2/core/index";
import { usePersistentScheduler } from "@jeza-v2/core/schedules/schedule-control-time-context.v1";
import { isApiError } from "@jeza-v2/core/services/http/typed-fetch.v2";
import { sanitizeDocument } from "@jeza-v2/core/utils/documents.v1";
import {
  createSiginoutChannel,
  mqttClient,
} from "@jeza-v2/core/services/mqtt/mqtt-service.v1";
import {
  createUpdateValue,
  getTokenExpiration,
} from "@jeza-v2/core/utils/general.v1";
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";

interface IMAuthContextValues {
  user: IAwaitValue<IUserAuth>;
  signin: (document: string, password: string) => void;
  signout: () => void;
}
const defaultValue: IMAuthContextValues = {} as IMAuthContextValues;

const MAuthContext = createContext<IMAuthContextValues>(defaultValue);

// const client = mqtt.connect('mqtt://mosquitto.mls.m4rc310.com.br', mqttOptions);
// const client = mqtt.connect('mqtt://mosquitto.mls.m4rc310.com.br', mqttOptions);

const MAuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState<IMAuthContextValues>(defaultValue);
  const update = useMemo(() => createUpdateValue(setValue), []);

  const authStatus = useStoreV1((s) => s.authStatus);
  const setAuthStatus = useStoreV1((s) => s.setAuthStatus);
  const dateTokenExp = useStoreV1((s) => s.dateTokenExp);
  const setDateTokenExp = useStoreV1((s) => s.setDateTokenExp);
  const user = useStoreV1((s) => s.user);
  const setUser = useStoreV1((s) => s.setUser);
  const token = useStoreV1((s) => s.token);
  const setToken = useStoreV1((s) => s.setToken);
  const layoutPropsAuth = useStoreV1((s) => s.layoutPropsAuth);
  const setLastDocument = useStoreV1((s) => s.setLastDocument);

  usePersistentScheduler({
    nextDate: dateTokenExp,
    onRun() {
      setAuthStatus("TOKEN_EXPIRED");
    },
  });

  const channel = useMemo(
    () => createSiginoutChannel(user?.nr_cpfcnpj ?? ""),
    [user],
  );

  useEffect(() => {
    if (!user) {
      return;
    }
    update("user", { loading: false, value: user });
    setAuthStatus("AUTHORIZED");

    if (layoutPropsAuth?.isSaveLastDocument) {
      setLastDocument(user.nr_cpfcnpj);
    } else {
      setLastDocument(null);
    }

    const sub = mqttClient.subscribe(channel, () => {
      setAuthStatus("UNAUTHORIZED");
      sub();
    });
    return () => sub();
  }, [user]);

  useEffect(() => {
    if (authStatus !== "AUTHORIZED") {
      update("signin", async (doc, pass) => {
        update("user", { loading: true });
        try {
          const cc = sanitizeDocument(doc);
          const auth = await apiMP.post("/geza/signin", {
            nr_cpfcnpj: cc,
            vl_senha: pass,
          });
          setToken(auth.ds_token);
          setDateTokenExp(getTokenExpiration(auth.ds_token));

          const user = await apiMP.post("/geza/user");
          setUser(user);
        } catch (error) {
          if (isApiError(error)) {
            update("user", { loading: false, error: error.ds_mensagem });
          }
        }
        // setAuthStatus('AUTHORIZED');
      });
    }
  }, [authStatus]);

  useEffect(() => {
    switch (authStatus) {
      case "TOKEN_EXPIRED":
        if (!token) {
          setAuthStatus("UNAUTHORIZED");
          return;
        }
        apiMP
          .post("/geza/refresh", undefined, "include")
          .then((resp) => {
            setToken(resp.ds_token);
            setDateTokenExp(getTokenExpiration(resp.ds_token));
            setAuthStatus("AUTHORIZED");
          })
          .catch(() => {
            setAuthStatus("UNAUTHORIZED");
          });
        break;
      case "UNAUTHORIZED":
        setToken(null);
        setDateTokenExp(null);
        setUser(null);
        break;
      case "AUTHORIZED":
        if (!token) {
          setAuthStatus("UNAUTHORIZED");
          return;
        }

        update("signout", () => {
          setAuthStatus("UNAUTHORIZED");
        });
        break;
      default:
        break;
    }
  }, [authStatus, update]);

  return (
    <MAuthContext.Provider value={value}>{children}</MAuthContext.Provider>
  );
};

export { MAuthContext, MAuthContextProvider };
