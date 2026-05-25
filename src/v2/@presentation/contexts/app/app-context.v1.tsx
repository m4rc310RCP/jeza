import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { apiMP } from "@jeza-v2/core/services/http/geza/geza-map-service.v1";
import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";
import { createJezaBalanceWS, createBalanceChannel } from "@jeza-v2/core/index";
import { createUpdateValue } from "@jeza-v2/core/utils/general.v1";

interface IMAppValues {
	openDeliveries: () => void;
}

const defaultValue: IMAppValues = {} as IMAppValues;

const MAppContext = createContext<IMAppValues>(defaultValue);

const MAppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState<IMAppValues>(defaultValue);	
	const update = useMemo(()=>createUpdateValue(setValue), []);

	// const activeTab = useLayoutStore(s => s.activeTab);
	const tabs = useLayoutStore(s => s.tabs);
	const setTabs = useLayoutStore(s => s.setTabs);
	const setBalance = useLayoutStore(s => s.setBalance);
	const cpfCnpj = useLayoutStore(s => s.cpfCnpj);
	const setTab = useLayoutStore(s => s.setTab);
	// const setTabs = useLayoutStore(s => s.setTabs);

	const unsubscribeRef = useRef<(() => void) | null>(null);
	// const activeChannelRef = useRef<string | null>(null);
	const wsRef = useRef(createJezaBalanceWS());


	const createTab = useCallback((tab: TTab) => {
		setTabs([
			...tabs,{
				...tab
			}
		]);

		setTab(tab);
	}, [setTab, setTabs, tabs]);

	useEffect(()=>{
		unsubscribeRef.current?.();
		if (cpfCnpj){
			const channel = createBalanceChannel(cpfCnpj);
			unsubscribeRef.current = wsRef.current.subscribe(channel, (r)=>{
				console.log(r)
			});
		}

		update('openDeliveries', () => {
			const tab = tabs.find(i => i.id === 'DELIVERIES');
			if (!tab){
				createTab({
					id: "DELIVERIES",
					title: m.text_jeza_tab_title_deliveries_title,
					icon: 'deliveries',
					view: 'deliveries',
					loading: false
				});
			}else{
				setTab(tab);
			}
		});

		return () => {
			unsubscribeRef.current?.();
			// wsRef.current.close();
		}
	}, [cpfCnpj, createTab, setTab, tabs, update])

	useEffect(() => {
		if (!tabs) return;
		const tabDashboard = tabs.find( f => f.view === 'dashboard');
		if (!tabDashboard){
			createTab({
				id: 'dash',
				title: m.text_jeza_tab_title_dashboard,
				icon: "dashboard",
				view: "dashboard",
				pinned: true,
			})
		}
	}, [tabs, createTab]);

	useEffect(()=>{
		// setTabs([])
		apiMP.post('/jeza/user/refresh/balances')
			.then(setBalance);
	}, [ setBalance])


  return <MAppContext.Provider value={value}>{children}</MAppContext.Provider>;
};

export { MAppProvider, MAppContext };
