import { createContext, type FC, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { createUpdateValue } from "@jeza-v2/core/utils/general.v1";
import { IoHomeOutline } from "react-icons/io5";
import { GoFile } from "react-icons/go";
import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { MTabBase, MTabDashboard } from "@jeza-v2/presentation/jeza";

const defaultValue: ITabControl = {} as ITabControl;

const MTabContext = createContext<ITabControl>(defaultValue);

const MTabProvider: FC<PropsWithChildren> = ({ children }) => {
	const [value, setValue] = useState<ITabControl>(defaultValue);
	const update = useMemo(()=>createUpdateValue(setValue), []);
	// --~>
	const tabs = useStoreV1(s=>s.tabs);
	const setTab = useStoreV1(s=>s.setTab);
	const setTabs = useStoreV1(s=>s.setTabs);
	const setActiveTab = useStoreV1(s=>s.setActiveTab);
	// --~>
	const handleMakeIcon = useMemo(() => (id: TTabView) => {
		switch (id) {
			case 'dashboard':
				return <IoHomeOutline size={14} />;
			default:
				return <GoFile size={14} />;
		}
	}, []);

	const handleRendererTab = useMemo(() => (tab: TTab) =>(
		<MTabBase tab={tab}>
			{tab.view === 'dashboard' && <MTabDashboard />}
		</MTabBase>
	), []);

	const handleCreateTab = useMemo(() => (tab: TTab)=>{
		setTabs([...tabs, { ...tab }]);
		setActiveTab(tab.id);
	}, [tabs, setTabs, setActiveTab]);

	const handleCloseTab = useMemo(() => (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
		e.stopPropagation();
		const tab = tabs.find((t) => t.id === id);
		if (!tab || tab.pinned) return;
		const next = tabs.filter((t) => t.id !== id);
		setTab(next[0]);
		setTabs(next);
	}, [setTabs, setTab, tabs]);
	// --~>

	useEffect(()=>{
		update('makeIcon', handleMakeIcon);
		update('createTab', handleCreateTab);
		update('closeTab', handleCloseTab);
		update('rendererTab', handleRendererTab);
	}, [update, handleCloseTab, handleMakeIcon, handleCreateTab]);

	return <MTabContext.Provider value={value}>{children}</MTabContext.Provider>;
};



export { MTabProvider, MTabContext };