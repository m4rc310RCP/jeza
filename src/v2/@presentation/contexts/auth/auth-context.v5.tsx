// import {
// 	createContext,
// 	type FC,
// 	type PropsWithChildren,
// 	useEffect,
// 	useMemo,
// 	useRef,
// 	useState
// } from "react";

// import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
// import { apiMP } from "@jeza-v2/core/services/http/geza/geza-map-service.v1";
// import { isApiError } from "@jeza-v2/core/services/http/typed-fetch.v2";
// import {
// 	createUpdateValue,
// 	getTokenExpiration,
// } from "@jeza-v2/core/utils/general.v1";

// import { sanitizeDocument } from "@jeza-v2/core/utils/documents.v1";

// import { usePersistentScheduler } from "@jeza-v2/core/schedules/schedule-control-time-context.v1";

// // --------------------------------------------------------
// // Types
// // --------------------------------------------------------

// interface IMAuthValues {
// 	oc_autenticado: IAwaitValue<IUserAuth>;
//   nr_cpfcnpj: string | null;
//   st_screen: TScreen;

//   fn_login: (auth: IUserAuth) => void;
//   fn_logout: () => void;
//   fn_refresh: () => void;
// }

// // --------------------------------------------------------
// // Default
// // --------------------------------------------------------

// const defaultValue: IMAuthValues = {
//   // oc_autenticado: {
//   //   loading: true,
//   // },
// } as IMAuthValues;

// // --------------------------------------------------------
// // Context
// // --------------------------------------------------------

// const MAuthContext = createContext<IMAuthValues>(defaultValue);

// // --------------------------------------------------------
// // Provider
// // --------------------------------------------------------

// const MAuthProvider: FC<PropsWithChildren> = ({ children }) => {
// 	const [value, setValue] = useState<IMAuthValues>(defaultValue);
// 	const update = useMemo(() => createUpdateValue(setValue), []);
// 	//--------------------------------------------------------
// 	const token = useLayoutStore(s => s.token);
// 	const setToken = useLayoutStore(s => s.setToken);
// 	const loginRef = useRef(false);
// 	const refreshTokenRef = useRef(false);

// 	const setScreen = useLayoutStore(s => s.setScreen);
// 	const setDateExpiration = useLayoutStore(s => s.setDateExpiration);
// 	const dateExpiration = useLayoutStore(s => s.dateExpiration);
// 	const setUser = useLayoutStore(s => s.setUser);

// 	const handleLogout  = useMemo(() => () => {
// 		if (refreshTokenRef.current){
// 			return;
// 		}
// 		setUser(null);
// 		setDateExpiration(null)
// 		setScreen('signin');
// 		update('oc_autenticado', {loading:false })
// 	}, [setDateExpiration, setScreen, setUser, update]);

// 	//--------------------------------------------------------
// 	const loadUser = useMemo(()=> async (token: string) => {
// 		loginRef.current = false;
// 		const now = new Date();
// 		const exp = getTokenExpiration(token) ?? now;
// 		setDateExpiration(exp);
// 		apiMP.post('/geza/user')
// 		.then(resp => {
// 			setUser(resp);
// 			console.log(resp)
// 			setScreen('home');
// 			}).catch((error) => {
// 								console.log(error);

// 				if (isApiError(error) && error.cd_erro === 401){
// 					handleLogout();
// 				}
// 			});
// 	}, [handleLogout, setDateExpiration, setScreen, setUser,])
// 	//--------------------------------------------------------
// 	// eslint-disable-next-line react-hooks/set-state-in-effect
// 	useEffect(()=>{
// 		if (!token){
// 			return;
// 		}else{
// 			if (loginRef.current) {
// 				loadUser(token)
// 			} else {
// 				console.log("token restaurado");
// 			}
// 		}
// 	}, [token, loadUser]);
// 	//--------------------------------------------------------
// 	usePersistentScheduler({
// 		nextDate: dateExpiration,
// 		onRun() {
// 			handleRefresh();
// 		},
// 	})
// 	//--------------------------------------------------------
// 	const handleLogin  = useMemo(() => (auth: IUserAuth) => {
// 		update('oc_autenticado', {loading: true});
// 		const { nr_cpfcnpj, vl_senha } = auth;
// 		apiMP.post('/geza/signin', {
// 			nr_cpfcnpj: sanitizeDocument(nr_cpfcnpj), vl_senha
// 		}, 'include')
// 		.then(resp => {
// 			loginRef.current = true;
// 			setToken(resp.ds_token);
// 		})
// 		.catch(error => {
// 			update('oc_autenticado', {loading: false, error: isApiError(error)?error.ds_mensagem : error});
// 		})
// 	}, [setToken, update])

// 	const handleRefresh = useMemo(() => () => {
// 		refreshTokenRef.current = true;
// 		apiMP.post('/geza/refresh', undefined, 'include')
// 			.then(resp => {
// 				loginRef.current = true;
// 				setToken(resp.ds_token);
// 				refreshTokenRef.current = false;
// 			})
// 			.catch((error)=>{
// 				refreshTokenRef.current = false;
// 				console.log(error);
// 				if (isApiError(error) && error.cd_erro === 401){
// 					handleLogout();
// 				}
// 			})
// 	}, [setToken]);
// 	//--------------------------------------------------------
// 	useEffect(()=>{
// 		update('fn_login', handleLogin);
// 		update('fn_logout', handleLogout);
// 		update('fn_refresh', handleRefresh);
// 	}, [update, handleLogin, handleRefresh, handleLogout]);
// 	//--------------------------------------------------------
//   return (
//     <MAuthContext.Provider value={value}>{children}</MAuthContext.Provider>
//   );
// };

// // --------------------------------------------------------
// // Exports
// // --------------------------------------------------------

// export { MAuthContext, MAuthProvider };
