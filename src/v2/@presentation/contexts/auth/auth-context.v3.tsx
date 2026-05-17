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
//   ws,
//   createSiginoutChannel,
// } from "@jeza-v2/core/services/ws/geza-ws.v1";
// import { usePersistentScheduler } from "@jeza-v2/core/schedules/schedule-control-time-context.v1";
// import {
//   useStoreLocal,
//   useTokenStore,
// } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
// import { isApiError } from "@jeza-v2/core/services/http/typed-fetch.v2";
// import { sanitizeDocument } from "@jeza-v2/core/utils/documents.v1";

// interface IMAuthValues {
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
//   const [screen, setScreen] = useState<TScreen>("startup");
//   // ----------------------------
//   const setToken = useTokenStore((s) => s.setToken);
//   const token = useTokenStore((s) => s.ds_token);
//   useEffect(() => {
//     if (!token) return;
//   }, [token]);
//   // ----------------------------
//   useEffect(() => {
//     if (!screen) return;
//     update("st_screen", screen);
//   }, [screen]);
//   // ----------------------------
//   const cpfCnpj = useStoreLocal((s) => s.cpfCnpj);
//   const setCpfCnpj = useStoreLocal((s) => s.setCpfCnpj);
//   useEffect(() => {
//     if (!cpfCnpj) return;
//     update("nr_cpfcnpj", cpfCnpj);
//     ws.on("geza:log", (log) => {
//       console.log(log);
//     });
//     ws.on(createSiginoutChannel(cpfCnpj), ({ ds_motivo }) => {
//       console.log(ds_motivo);
//     });
//   }, [cpfCnpj]);
//   // ----------------------------

//   const refreshToken = async () => {
//     try {
//       setScreen("startup");
//       const resp = await apiMP.post("/geza/refresh", undefined, "include");
//       setToken(resp.ds_token);
//       const user = await apiMP.post("/geza/user", undefined);
//       setScreen("home");
//     } catch (error) {
//       if (isApiError(error) && error.cd_erro === 401) {
//         update("fn_login", ({ nr_cpfcnpj, vl_senha }) => {
//           const cc = sanitizeDocument(nr_cpfcnpj);
//           update("oc_autenticado", { loading: true });
//           apiMP
//             .post("/geza/signin", { nr_cpfcnpj: cc, vl_senha })
//             .then((resp) => {
//               setToken(resp.ds_token);
//               setCpfCnpj(cc);
//             })
//             .catch((error) => {
//               //update('oc_autenticado', {loading: false})
//               if (isApiError(error)) {
//                 update("oc_autenticado", {
//                   loading: false,
//                   error: error?.ds_mensagem,
//                 });
//               } else {
//                 update("oc_autenticado", {
//                   loading: false,
//                   error: "Erro desconhecido",
//                 });
//               }
//             });
//         });
//         update("st_screen", "signin");
//       }
//     }
//   };
//   // ----------------------------
//   useEffect(() => {
//     refreshToken();
//   }, [update]);
//   // ----------------------------
//   return (
//     <MAuthContext.Provider value={value}>{children}</MAuthContext.Provider>
//   );
// };

// export { MAuthProvider, MAuthContext };
