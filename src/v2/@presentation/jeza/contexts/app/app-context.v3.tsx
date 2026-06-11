import {
	useStoreV1,
	type ILayoutStore,
	type TIdMenu
} from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { createUpdateValue } from "@jeza-v2/core/utils/general.v1";
import { fmt, m } from "@jeza-v2/core/i18n/locale-i18n.v1";
import {
	createContext,
	useEffect,
	useMemo,
	useState,
	type FC,
	type PropsWithChildren,
	type ReactNode
} from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { BsGear, BsPiggyBank } from "react-icons/bs";
import { TfiLayoutSidebarNone } from "react-icons/tfi";



export const APP_EVENTS = {
  INACTIVE_RETURN: "app:inactive-return",
} as const;

interface IMAppValues {
  changeAppState: (state: ILayoutStore["appState"]) => void;
  menu: ILayoutStore["menus"];
  selectItem: (id: TIdMenu) => void;
  getMenuItemIcon: (id: TIdMenu) => ReactNode;
}

const defaultValue: IMAppValues = {} as IMAppValues;

const MAppContext = createContext<IMAppValues>(defaultValue);

const MAppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState<IMAppValues>(defaultValue);
  const update = useMemo(() => createUpdateValue(setValue), []);
	// --------------------------------------------------------------------------
	const authStatus = useStoreV1((s) => s.authStatus);
	const setAppState = useStoreV1((s) => s.setAppState);
	const setAppTitle = useStoreV1((s) => s.setAppTitle);
	const menus = useStoreV1((s) => s.menus);
	// --------------------------------------------------------------------------
	useEffect(() => {
		update("getMenuItemIcon", (id) => {
			switch (id) {
				case "DASHBOARD":
					return <MdOutlineDashboard />;
				case "TRANSACTIONS":
					return <BsPiggyBank />;
				case "PREFERENCES":
					return <BsGear />;
				default:
					return <TfiLayoutSidebarNone />;
			}
		});
	}, [update]);
	// --------------------------------------------------------------------------
	useEffect(()=>{
		update('menu', menus);
		console.log(menus)
	}, [menus, update])
	// --------------------------------------------------------------------------
	useEffect(()=>{
		console.log(authStatus);
		if (!authStatus) return;
				switch (authStatus) {
					case "AUTHORIZED":
						setAppTitle(fmt("title_app_online", m.text_geza_slogan));
						setAppState("ON-LINE");
						break;
					case "UNAUTHORIZED":
						setAppTitle(m.title_app_signin);
						setAppState("SIGNIN");
						break;
					case "UNREGISTERED":
						setAppState("SCREENSHOT");
						break;
				}
	}, [authStatus, setAppState, setAppTitle]);
	// --------------------------------------------------------------------------
	useEffect(()=>{}, [update]);
	// --------------------------------------------------------------------------
  return <MAppContext.Provider value={value}>{children}</MAppContext.Provider>;
};

export { MAppContext, MAppProvider };
