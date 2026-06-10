// import { createContext, type FC, type PropsWithChildren, useEffect, useState } from "react";
// import { createUpdateValue, getTokenExpiration } from "@jeza-v2/core/utils/general.v1";
// import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
// import { apiMP } from '@jeza-v2/core/services/http/geza/geza-map-service.v1'
// import { createSiginoutChannel, mqttClient } from "@jeza-v2/core/services/mqtt/mqtt-service.v1";
// import { usePersistentScheduler } from "@jeza-v2/core/schedules/schedule-control-time-context.v1";

// interface IMAuthContextValues {
// 	signin: (document: string, password: string) => void;
// 	signout: () => void;
// }
// const defaultValue: IMAuthContextValues  = {} as IMAuthContextValues;

// const MAuthContext = createContext<IMAuthContextValues>(defaultValue);

// const MAuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
// 	const [value, setValue] = useState<IMAuthContextValues>(defaultValue);
// 	const update = createUpdateValue(setValue);
// 	// ---------------

// 	// ---------------

// 	const appState = useStoreV1(s => s.appState);
// 	const authStatus = useStoreV1(s => s.authStatus);
// 	const setAuthStatus = useStoreV1(s => s.setAuthStatus);
// 	const setAppState = useStoreV1(s => s.setAppState);
// 		// const setAppState = useStoreV1(s => s.appState);

// 	const dateTokenExp = useStoreV1(s => s.dateTokenExp);
// 	const setDateTokenExp = useStoreV1(s => s.setDateTokenExp);
// 	const token = useStoreV1(s => s.token);
// 	const setToken = useStoreV1(s => s.setToken);
// 	useEffect(()=>{
// 		if (authStatus === 'UNREGISTERED') return;
// 		if (!token){
// 			update('signin', (doc, pwd)=>{
// 				apiMP.post('/geza/signin', {nr_cpfcnpj: doc, vl_senha: pwd}, "include")
// 				.then((resp) => {
// 					setAuthStatus('AUTHORIZED');
// 					setAppState('ON-LINE');
// 					setToken(resp.ds_token);
// 				});
// 			});
// 			setAuthStatus('UNAUTHORIZED');
// 			setAppState('SIGNIN');
// 			return;
// 		}

// 		update('signout', handleSignout);

// 		setDateTokenExp(getTokenExpiration(token));
// 	}, [token, appState]);
// 	// ---------------
// 	const handleSignout = () => {
// 		console.log('--------')
// 		setAuthStatus('UNAUTHORIZED');
// 		setToken(null);
// 		setDateTokenExp(null);
// 	}
// 	// ---------------
// 	usePersistentScheduler({
// 		nextDate: dateTokenExp,
// 		onRun() {
// 			setAuthStatus('TOKEN_EXPIRED');
// 		},
// 	});
// 	// ---------------
// 	useEffect(()=>{
// 		if (authStatus != 'TOKEN_EXPIRED') return;

// 		setAuthStatus('PROCESSING_REFRESH_TOKEN');
// 		apiMP.post('/geza/refresh', undefined, 'include')
// 			.then(res => {
// 				setToken(res.ds_token);
// 				setAuthStatus('AUTHORIZED');
// 			})
// 	}, [authStatus]);
// 	// ---------------
// 	useEffect(() => {

// 		if (!mqttClient) return;
// 		mqttClient.subscribe('jeza:log', ({ds_log})=>{
// 			console.log(ds_log);
// 		});

// 		const channel = createSiginoutChannel('03057532900');
// 		mqttClient.subscribe(channel, ()=>{
// 			handleSignout();
// 			mqttClient.disconnect();
// 		});

// 		return () => {
// 			mqttClient.disconnect();
// 		};
// 	}, [mqttClient]);
// 	// ---------------

// 	useEffect(()=>{
// 		if (appState != 'ON-LINE') return;

// 	}, [token])
// 	// ---------------
// 	return <MAuthContext.Provider value={value}>{children}</MAuthContext.Provider>;
// };

// export { MAuthContextProvider, MAuthContext };
