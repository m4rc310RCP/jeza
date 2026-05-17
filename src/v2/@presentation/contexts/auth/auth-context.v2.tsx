// import {
//   createContext,
//   type FC,
//   type PropsWithChildren,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import {
//   createUpdateValue,
//   getTokenExpiration,
// } from "@jeza-v2/core/utils/general.v1";
// import { apiMP } from "@jeza-v2/core/services/http/geza/geza-map-service.v1";
// import { usePersistentScheduler } from "@jeza-v2/core/schedules/schedule-control-time-context.v1";
// import {
//   useStoreLocal,
//   useTokenStore,
// } from "@jeza-v2/core/data/zustand/zustand-storage.v1";

// type TScreen = "startup" | "signin" | "home";

// interface IMAuthValues {
//   // changeAuth: (auth: IUserAuth) => void;
//   // processSignIn: () => void;
//   // auth: IAwaitValue<IUserAuth>;
//   // token: string;
//   // hadleSignIn: (auth: IUserAuth) => void;
//   oc_autenticado: IAwaitValue<IUserAuth>;
//   fn_login: (auth: IUserAuth) => void;
//   fn_teste: () => void;
//   nr_cpfcnpj: string | null;
//   st_screen: TScreen;
// }
// const defaultValue: IMAuthValues = {} as IMAuthValues;

// const MAuthContext = createContext<IMAuthValues>(defaultValue);

// const MAuthProvider: FC<PropsWithChildren> = ({ children }) => {
//   const [value, setValue] = useState<IMAuthValues>(defaultValue);
//   const update = useMemo(() => createUpdateValue(setValue), []);
//   // const [token, setToken] = useState<string | undefined>();
//   const [screen, setScreen] = useState<TScreen>("startup");

//   const dateExpiredToken = useStoreLocal((s) => s.dateExpiredToken);
//   const setDateExpiredToken = useStoreLocal((s) => s.setDateExpiredToken);
//   const cpfCnpj = useStoreLocal((s) => s.cpfCnpj);
//   const setCpfCnpj = useStoreLocal((s) => s.setCpfCnpj);

//   const token = useTokenStore((s) => s.ds_token);
//   const setToken = useTokenStore((s) => s.setToken);

//   // ------------------------------------
//   const refreshToken = () => {
//     apiMP
//       .post("/geza/refresh", undefined, "include")
//       .then((resp) => {
//         setToken(resp.ds_token);
//       })
//       .catch(() => {
//         setScreen("signin");
//       });
//   };
//   // ------------------------------------
//   usePersistentScheduler({
//     nextDate: dateExpiredToken,
//     onRun() {
//       refreshToken();
//     },
//   });
//   // ------------------------------------
//   useEffect(() => {
//     if (cpfCnpj) update("nr_cpfcnpj", cpfCnpj);
//   }, [cpfCnpj, update]);
//   // ------------------------------------
//   useEffect(() => {
//     if (token) {
//       const dateExpiredToken = getTokenExpiration(token);
//       setDateExpiredToken(dateExpiredToken);

//       apiMP
//         .post("/geza/user", undefined)
//         .then((resp) => {
//           console.log(resp);
//         })
//         .catch(() => {
//         //  setScreen("signin");
//         });

//       //setScreen("home");
//     }
//   }, [token, setScreen, refreshToken, setDateExpiredToken]);
//   // ------------------------------------
//   useEffect(() => {
//     if (!screen) return;
//     update("st_screen", screen);
//   }, [screen, update]);
//   // ------------------------------------
//   useEffect(() => {
//     apiMP.onRefresh(() => {
//       refreshToken();
//     });

//     update("fn_login", ({ nr_cpfcnpj, vl_senha }) => {
//       update("oc_autenticado", { loading: true });

//       apiMP
//         .post(
//           "/geza/signin",
//           {
//             nr_cpfcnpj,
//             vl_senha,
//           },
//           "include",
//         )
//         .then((resp) => {
//           setToken(resp.ds_token);
//           setCpfCnpj(nr_cpfcnpj);
//           // update('oc_autenticado', { loading: false, value: {} })
//         });
//     });

//     update("fn_teste", () => {
//       apiMP.post("/geza/test", undefined).then((resp) => {
//         console.log(resp);
//       });
//     });

//     refreshToken();
//   }, [update]);
//   // ------------------------------------

//   return (
//     <MAuthContext.Provider value={value}>{children}</MAuthContext.Provider>
//   );
// };

// export { MAuthProvider, MAuthContext };
