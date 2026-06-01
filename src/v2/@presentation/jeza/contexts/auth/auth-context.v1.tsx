import { createContext, type FC, type PropsWithChildren, useEffect, useRef, useState } from "react";
import { createUpdateValue } from "@jeza-v2/core/utils/general.v1";
import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { apiMP } from '@jeza-v2/core/services/http/geza/geza-map-service.v1'

interface IMAuthContextValues {
	signin: (document: string, password: string) => void;
	signout: () => void;
}
const defaultValue: IMAuthContextValues  = {} as IMAuthContextValues;

const MAuthContext = createContext<IMAuthContextValues>(defaultValue);

const MAuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
	const [value, setValue] = useState<IMAuthContextValues>(defaultValue);
	const update = createUpdateValue(setValue);
	// ---------------

	// ---------------
	
	const appState = useStoreV1(s => s.appState);
	const authStatus = useStoreV1(s => s.authStatus);
	const setAuthStatus = useStoreV1(s => s.setAuthStatus);
	const setAppState = useStoreV1(s => s.setAppState);
	const token = useStoreV1(s => s.token);
	const setToken = useStoreV1(s => s.setToken);
	useEffect(()=>{
		console.log(authStatus);
		if (authStatus === 'UNREGISTERED') return;
		// if (appState != 'REGISTERED') return;
		// if (!token) {
		// 	setAppState('SIGNIN');
		// 	update('signin', (doc, pwd) => {
		// 		apiMP.post('/geza/signin', {nr_cpfcnpj: doc, vl_senha: pwd}, "include")
		// 			.then((resp) => {
		// 				setAppState('REGISTERED');
		// 				setToken(resp.ds_token);
		// 			})
		// 	});
		// 	return;
		// }

		// setAppState('ON-LINE');
		// update('signout', () => {
		// 	setToken(null);
		// 	// setAppState('REGISTERED')
		// });
	}, [token, appState]);
	// ---------------
	useEffect(()=>{
		if (appState != 'ON-LINE') return;
		
	}, [token])
	// ---------------
	return <MAuthContext.Provider value={value}>{children}</MAuthContext.Provider>;
};

export { MAuthContextProvider, MAuthContext };