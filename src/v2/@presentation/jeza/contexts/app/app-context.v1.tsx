import { createContext, type FC, type PropsWithChildren, useEffect, useMemo, useState } from "react";
import { createUpdateValue } from "@jeza-v2/core/utils/general.v1";
import { useStoreV1, type ILayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { apiMP } from "@jeza-v2/core/index";
import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";
import { v4 as uuid } from "uuid";

interface IMAppValues {
	changeAppState: (state: ILayoutStore['appState']) => void;
}
const defaultValue: IMAppValues = {} as IMAppValues;

const MAppContext = createContext<IMAppValues>(defaultValue);

const MAppProvider: FC<PropsWithChildren> = ({ children }) => {
	const [value, setValue] = useState<IMAppValues>(defaultValue);
	const update = useMemo(() => createUpdateValue(setValue), []);

	const [initialized, setInitialized] = useState(false);
	//----------------------
	const setAppTitle = useStoreV1(s => s.setAppTitle);
	//----------------------
	const appState = useStoreV1(s => s.appState);
	const setAppState = useStoreV1(s => s.setAppState);
	//----------------------
	const authStatus = useStoreV1(s => s.authStatus);
	const setAuthStatus = useStoreV1(s => s.setAuthStatus);

	// useEffect(()=>{
	// 	if (!initialized) return;
	// 	update('appState', { loading:false, value: appState });
	// }, [appState, initialized]);
	
	//----------------------
	// Faz o registro caso ainda não esteja no servidor
	const registerId = useStoreV1(s => s.registerId);
	const setRegisterId = useStoreV1(s => s.setRegisterId);
	useEffect(()=>{
		if (!initialized) return;
		if (registerId) {
			setAuthStatus('REGISTERED');
			return;
		};
		const _uuid = uuid();
		apiMP.post('/jeza/app/register', { nr_registro: _uuid })
		.then(()=> {
			console.log(_uuid);
			setRegisterId(_uuid);
		});
	}, [registerId, initialized]);
	//----------------------
	useEffect(()=>{
		update('changeAppState', setAppState);
		//setRegisterId(null);
		setAppTitle(`${m.text_appname} - ${m.text_geza_slogan}`)
		setInitialized(true);
	}, [update, setAppState]);
	
	//----------------------

	return <MAppContext.Provider value={value}>{children}</MAppContext.Provider>;
};

export { MAppProvider, MAppContext };