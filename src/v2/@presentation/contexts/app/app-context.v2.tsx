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
import { createUpdateValue } from "@jeza-v2/core/utils/general.v1";

interface IMAppValues {
  openDeliveries: () => void;
  balanceUser: IAwaitValue<IUserBalance>;
}

const defaultValue: IMAppValues = {} as IMAppValues;
const MAppContext = createContext<IMAppValues>(defaultValue);

const defaultUserBalance: IUserBalance = {
  qt_entregas: 0,
  vl_saldo: 0,
};

const MAppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState<IMAppValues>(defaultValue);
  const update = useMemo(() => createUpdateValue(setValue), []);
  // ------------------------------------------------------ //
  const refstarting = useRef<boolean>(true);
  // ------------------------------------------------------ //
  const tabs = useLayoutStore((s) => s.tabs);
  const setTab = useLayoutStore((s) => s.setTab);
  const setTabs = useLayoutStore((s) => s.setTabs);

  // ------------------------------------------------------ //
  useEffect(() => {
    console.log(`-> ${tabs}`);
  }, [tabs]);
  // ------------------------------------------------------ //
  const createTab = useCallback(
    (tab: TTab) => {
      setTabs([
        ...tabs,
        {
          ...tab,
        },
      ]);
      setTab(tab);
    },
    [setTab, setTabs, tabs],
  );
  // ------------------------------------------------------ //
  const balance = useLayoutStore((s) => s.balance);
  const setBalance = useLayoutStore((s) => s.setBalance);
  useEffect(() => {
    if (refstarting.current) {
      const value = balance ?? defaultUserBalance;
      update("balanceUser", { loading: true, value });
    } else {
      update("balanceUser", { loading: false, value: balance });
    }
  }, [update, balance]);
  // ------------------------------------------------------ //
  // const openDeliveries =  useCallback(()=> {
  // 		const tab = tabs.find(i => i.id === 'TRANSACTIONS');
  // 		// const ntabs = useLayoutStore(s => tabs);
  // 		// console.log(tabs)
  // 		// console.log(ntabs)
  // 		if (!tab){
  // 			createTab({
  // 				id: "TRANSACTIONS",
  // 				title: m.text_jeza_tab_balance_movto_list,
  // 				icon: 'finantials_movements',
  // 				view: 'finantials_movements',
  // 				loading: false
  // 			});
  // 		}else{
  // 			setTab(tab);
  // 		}
  // }, [createTab, setTab, tabs, update]);

  useEffect(() => {
    update("openDeliveries", () => {
      const tab = tabs.find((i) => i.id === "TRANSACTIONS");
      if (!tab) {
				const ntab: TTab = {
					id: "TRANSACTIONS",
					title: m.text_jeza_tab_balance_movto_list,
					icon: "finantials_movements",
					view: "finantials_movements",
					loading: true,
				}
        createTab(ntab);

				apiMP.post('/jeza/deliveries')
					.then(() => {
						setTabs([...tabs, {...ntab, loading:false}]);
					})

      } else {
        setTab(tab);
      }
    });
  }, [createTab, setTabs, setTab, tabs, update]);
  // ------------------------------------------------------ //

  useEffect(() => {
    apiMP.post("/jeza/user/refresh/balances").then((resp) => {
      refstarting.current = false;
      setBalance(resp);
    });

    // apiMP.post('/jeza/deliveries').then(res => {
    // 	console.log(res)
    // })

    // update('openDeliveries', openDeliveries);
  }, [setBalance]);

  return <MAppContext.Provider value={value}>{children}</MAppContext.Provider>;
};

export { MAppProvider, MAppContext };
