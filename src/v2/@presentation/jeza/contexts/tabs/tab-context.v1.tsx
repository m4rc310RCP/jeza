import {
  createContext,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createUpdateValue } from "@jeza-v2/core/utils/general.v1";
import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
// import { GiRadarSweep } from "react-icons/gi";
// import { MMapPart } from "@jeza/containers";
//import { FileCode2, Home } from "lucide-react";
import { IoHomeOutline } from "react-icons/io5";
import { GoFile } from "react-icons/go";
// import { GiFullMotorcycleHelmet } from "react-icons/gi";
import { FaMotorcycle } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiListCheck3 } from "react-icons/ri";
import { GrTest } from "react-icons/gr";

interface IMTabContextValues {
  fn_criartab: (tab: TTab) => void;
  fn_fechartab: (e: React.MouseEvent<HTMLButtonElement>, id: string) => void;
  fn_montaricone: (tab: TTab) => ReactNode;
}

const defaultValue: IMTabContextValues = {} as IMTabContextValues;

const MTabContext = createContext<IMTabContextValues>(defaultValue);

const MTabContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState<IMTabContextValues>(defaultValue);
  const update = useMemo(() => createUpdateValue(setValue), []);

  const tabs = useStoreV1((s) => s.tabs);
  const setTabs = useStoreV1((s) => s.setTabs);
  const setTab = useStoreV1((s) => s.setTab);
  const setActiveTab = useStoreV1((s) => s.setActiveTab);

  // const TabRenderer = ({ tab, isActive }: { tab: TTab; isActive: boolean }) => {
  //   switch (tab.view) {
  //     case "dashboard":
  //       return <GiRadarSweep className="m-auto text-9xl" />;
  //     case "map":
  //       return <MMapPart isActive={isActive} />;
  //     default:
  //       return <div>Sem conteúdo</div>;
  //   }
  // };

  const handleRenderIcon = useMemo(
    () => (tab: TTab) => {
      if (tab.loading)
        return (
          <AiOutlineLoading3Quarters
            size={14}
            className="animate-spin-medium"
          />
        );
      if (tab.icon === "dashboard") return <IoHomeOutline size={14} />;
      if (tab.icon === "deliveries") return <FaMotorcycle size={14} />;
      if (tab.icon === "test") return <GrTest size={14} />;
      if (tab.icon === "finantials_movements")
        return <RiListCheck3 size={14} />;
      return <GoFile size={14} />;
    },
    [],
  );

  const handleCreateTab = useMemo(
    () => (tab: TTab) => {
      // const id = typeof crypto !== "undefined" && "randomUUID" in crypto
      //     ? crypto.randomUUID()
      //     : String(Date.toString());
      // tab.id = id;
      setTabs([...tabs, { ...tab }]);
      setActiveTab(tab.id);
    },
    [setActiveTab, setTabs, tabs],
  );

  const handleCloseTab = useMemo(
    () => (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
      e.stopPropagation();
      const tab = tabs.find((t) => t.id === id);
      if (!tab || tab.pinned) return;

      const next = tabs.filter((t) => t.id !== id);
      setTab(next[0]);
      setTabs(next);
      // if (next[0].id === id) {
      //   setActiveTab(next[0]?.id ?? "");
      // 	setTab(next[0]);
      // }
    },
    [setTabs, setTab, tabs],
  );

  useEffect(() => {
    update("fn_criartab", handleCreateTab);
    update("fn_fechartab", handleCloseTab);
    update("fn_montaricone", handleRenderIcon);

    // handleCreateTab({
    // 	id: "home",
    // 	title: 'Home',
    // 	view: 'dashboard'
    // })
  }, [update, handleCloseTab, handleRenderIcon, handleCreateTab]);

  return <MTabContext.Provider value={value}>{children}</MTabContext.Provider>;
};

export { MTabContextProvider, MTabContext };
