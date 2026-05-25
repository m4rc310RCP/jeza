// import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
// import { useMTab } from "@jeza-v2/presentation/contexts";
// import { X } from "lucide-react";
import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { useMTab } from "@jeza-v2/presentation/contexts";
import { MTabDashboard, MTabDelivery } from "@jeza-v2/presentation/layouts";
import { X } from "lucide-react";
import type { FC, HtmlHTMLAttributes } from "react";
import { GiRadarSweep } from "react-icons/gi";
import { IoSearch } from "react-icons/io5";


// import { GiRadarSweep } from "react-icons/gi";

export const MTabsScreen: FC<HtmlHTMLAttributes<unknown>> = () => {
  const tabs = useLayoutStore((s) => s.tabs);
  const atab = useLayoutStore((s) => s.tab);
  // const activeTab = useLayoutStore((s) => s.activeTab);
  // const setActiveTab = useLayoutStore((s) => s.setActiveTab);
  const setTab = useLayoutStore((s) => s.setTab);

  const { fn_fechartab: closeTab, fn_montaricone: renderIcon } = useMTab();

	if (tabs && tabs.length === 0){
		return <MContainerDefault />;
	}
	
  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden bg-[#1F1F1F] ">
			<div className="h-8 bg-[#252525] flex items-center">
				<div className="flex  h-full items-center">
					<button className="px-4 bg-[#252525] h-full">
						<IoSearch />
					</button>
				</div>
				<div className="flex-1 overflow-x-auto">
					<div className="flex min-w-max h-8">
						{tabs.map((tab) => {
							const active = tab.id === atab?.id;
							return (
								<div
									key={tab.id}
									onClick={() => setTab(tab!)}
									className={`px-3 flex items-center gap-2 ${
										active ? "bg-[#1E1E1E] border-b border-blue-300" : "bg-[#2D2D2D]"
									}`}
								>
									{renderIcon?.(tab)}
									<span className="min-w-[15ch]">{tab.title}</span>
									{!tab.pinned && (
										<button onClick={(e) => closeTab(e, tab.id!)}>
											<X size={13} />
										</button>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>

      {/* TAB BAR */}
      <div className="h-full flex items-center ">
        <div className="flex-1 overflow-x-auto">
          {/* <MTabDashboard /> */}
					{tabs?.map((tab)=>{
						const isActive = tab.id === atab?.id;
						return (
                <div key={tab.id} className={isActive ? "flex-1" : "hidden"}>
                  <TabRenderer tab={tab} isActive={isActive} />
                </div>
              );
					})}

					{/* <div className="">
						<TabRenderer tab={atab!} isActive={tab === atab!} />
					</div> */}

        </div>
      </div>
    </div>
  );
};

const MContainerDefault: FC<HtmlHTMLAttributes<unknown>> = () => {
  return (
    <div className="w-full h-full flex flex-1 items-center justify-center">
      <GiRadarSweep className="size-64 text-zinc-500" />
    </div>
  );
};

const TabRenderer = ({ tab }: { tab: TTab; isActive: boolean }) => {
	switch (tab.view) {
		case "dashboard":
			return <MTabDashboard />;
		case "deliveries":
			return <MTabDelivery />;
		default:
			return <div>Sem conteúdo</div>;
	}
};
