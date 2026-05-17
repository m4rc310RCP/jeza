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
// import {
//   sanitizeDocument,
//   formatDocument,
// } from "@jeza-v2/core/utils/documents.v1";
// import { usePersistentScheduler } from "@jeza-v2/core/schedules/schedule-control-time-context.v1";
// import {
//   useStoreLocal,
//   useTokenStore,
// } from "@jeza-v2/core/data/zustand/zustand-storage.v1";

// type TScreen = "startup" | "signin" | "home";

// interface IMAuthValues {
//   // changeAuth: (auth: IUserAuth) => void;
//   // processSignIn: () => void;
//   auth: IAwaitValue<IUserAuth>;
//   token: string;
//   hadleSignIn: (auth: IUserAuth) => void;
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

//   useEffect(() => {
//     if (cpfCnpj) {
//       update("nr_cpfcnpj", formatDocument(cpfCnpj));
//     }
//   }, [cpfCnpj, update]);

//   useEffect(() => {
//     if (!screen) return;
//     update("st_screen", screen);
//   }, [screen, update]);

//   const refreshToken = () => {
//     apiMP.post("/geza/refresh", undefined, "include").then((resp) => {
//       // setToken("eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6Ik00cmMzMTAifQ.eyJucl9jcGZjbnBqIjoiMDMwNTc1MzI5MDAiLCJpYXQiOjE3NzgwODUxNzQsImV4cCI6MTc3ODA4NTIxMH0.6fTCbQLrVasA3JKCFgmQc93YrfwCt2TlCTiIjdLX7Df36SBgRPTQ-kNkgF2WlanIiO_9zJunorM8ejic8D1Iiw");
//       setToken(resp.ds_token);
//       setDateExpiredToken(getTokenExpiration(resp.ds_token));
//       setScreen("home");
//     });
//   };

//   useEffect(() => {
//     update("token", "");
//     if (token) {
//       setDateExpiredToken(getTokenExpiration(token));
//       update("token", token);
//     }
//   }, [token, update, setDateExpiredToken]);

//   usePersistentScheduler({
//     nextDate: dateExpiredToken,
//     onRun() {
//       refreshToken();
//     },
//   });

//   useEffect(() => {
//     update("fn_teste", () => {
//       apiMP.post("/geza/test").then((resp) => {
//         console.log(resp);
//       });
//     });

//     update("hadleSignIn", (auth: IUserAuth) => {
//       update("auth", { loading: true });
//       apiMP
//         .post(
//           "/geza/signin",
//           {
//             nr_cpfcnpj: sanitizeDocument(auth.nr_cpfcnpj),
//             vl_senha: auth.vl_senha,
//           },
//           "include",
//         )
//         .then((resp) => {
//           update("auth", { loading: false, value: auth });
//           update("token", resp.ds_token);
//           setToken(resp.ds_token);
//           setCpfCnpj(auth.nr_cpfcnpj);
//         })
//         .catch((e) => {
//           update("auth", { loading: false, error: e.ds_mensagem });
//         });
//     });

//     // --------------------------------------------- //
//     apiMP.onRefresh(() => {
//       refreshToken();
//     });
//     // --------------------------------------------- //
//     // setScreen("startup");
//     refreshToken();
//   }, [update, refreshToken, setCpfCnpj, setToken]);
//   return (
//     <MAuthContext.Provider value={value}>{children}</MAuthContext.Provider>
//   );
// };

// export { MAuthProvider, MAuthContext };
