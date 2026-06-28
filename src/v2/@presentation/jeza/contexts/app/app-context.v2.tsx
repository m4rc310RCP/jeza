import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";
import { apiMP } from "@jeza-v2/core/index";
import { usePersistentScheduler } from "@jeza-v2/core/schedules/schedule-control-time-context.v1";
import { isApiError } from "@jeza-v2/core/services/http/typed-fetch.v2";
import { sanitizeDocument } from "@jeza-v2/core/utils/documents.v1";
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
  const [flux, setFlux] = useState<TFlux>("START");
  const [loadingUser, setLoadingUser] = useState(false);
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
  const user = useStoreV1((s) => s.user);
  const setUser = useStoreV1((s) => s.setUser);
  const userBalance = useStoreV1((s) => s.userBalance);
  const setUserBalance = useStoreV1((s) => s.setUserBalance);
  const weatherCurrent = useStoreV1((s) => s.weatherCurrent);
  const setWeatherCurrent = useStoreV1((s) => s.setWeatherCurrent);
  const dateUpdateWeather = useStoreV1((s) => s.dateUpdateWeather);
  const setDateUpdateWeather = useStoreV1((s) => s.setDateUpdateWeather);
  const setTabs = useStoreV1((s) => s.setTabs);
  // const user = useStoreV1((s) => s.user);

  //--~>
  usePersistentScheduler({
    nextDate,
    onRun() {
      setFlux("REFRESH_TOKEN");
    },
  });

  usePersistentScheduler({
    nextDate: dateUpdateWeather,
    onRun() {
      update("currentWeather", { loading: true });
      apiMP
        .post("/weather/geo", {
          nr_latitude: -24.024543395979688,
          nr_longitude: -52.36377194182342,
					// nr_latitude: 13.783635141917905, 
          // nr_longitude: 124.33037938102889,
          tp_clima: "CURRENT",
        })
        .then((resp) => {
          setWeatherCurrent(resp);
          let nextUpdate = new Date();
          nextUpdate = new Date(nextUpdate.getTime() + 10 * 60 * 1000);
          setDateUpdateWeather(nextUpdate);
        });
    },
  });

  //--~>

  useEffect(() => {
    if (!weatherCurrent || !dateUpdateWeather) return;
    const r = {
      ...weatherCurrent.oc_geo,
      ...weatherCurrent.oc_atual,
    };
    update("currentWeather", {
      loading: false,
      value: { ...r, dt_atualizacao: dateUpdateWeather },
    });
  }, [weatherCurrent]);

  useEffect(() => {
    if (!userBalance) return;
    update("userBalance", { loading: false, value: userBalance });
  }, [userBalance]);

  useEffect(() => {
    if (user) {
      update("userAuth", { loading: false, value: user });
    }
  }, [user]);

  useEffect(() => {
    if (!token) return;
    update("userBalance", { loading: true, value: userBalance });
    apiMP
      .post("/jeza/user/refresh/balances")
      .then((resp) => {
        setUserBalance(resp);
      })
      .catch((error) => {
        //setUserBalance(null);
        update("userBalance", {
          loading: false,
          error: isApiError(error) ? error.ds_mensagem : String(error),
        });
      });
  }, [token]);

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
    //console.log("[TOKEN]", token);
    if (!token) {
      //console.log("[TOKEN] null");
      setDateTokenExp(null);
      setUser(null);
    } else {
      //console.log("[TOKEN] LOAD_USER");
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
          if (loadingUser) return;

          setLoadingUser(true);
          //console.log("[LOAD_USER] iniciando");
          const resp = await apiMP.post("/jeza/user");
          //console.log("[LOAD_USER] sucesso", resp);
          setUser(resp);
          update("userAuth", { loading: false, value: resp });
          setFlux("ONLINE");
        } catch (error) {
          const message = isApiError(error) ? error.ds_mensagem : String(error);
          update("userAuth", { loading: false, error: message });
          // setFlux("LOGOUT");
        } finally {
          setLoadingUser(false);
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

    if (!dateUpdateWeather) {
      setDateUpdateWeather(new Date());
    }

		update("handleOpenWeatherTab", () => {
			console.log('Open Weatcher...');
			// createTab({
			// 	id: "weather",
			// 	title: "Weather",
			// 	subtitle: "...",
			// 	view: 'none'
			// })
		});

    // setWeatherCurrent(null);
    // setDateUpdateWeather(null);

    //TESTE - REMOVER DEPOIS
    // apiMP.post('/weather/geo', {
    // 	nr_latitude: -24.043,
    // 	nr_longitude: -52.377,
    // 	tp_clima: "CURRENT"
    // }).then(resp =>{
    // 	setWeatherCurrent(resp.oc_atual)
    // })

		// console.log(tabs)

  }, [update]);

  return <MAppContext.Provider value={value}>{children}</MAppContext.Provider>;
};

export { MAppContext, MAppProvider };
