// import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
// import { useMTab } from "@jeza-v2/presentation/contexts";
// import { X } from "lucide-react";
import type { FC, HtmlHTMLAttributes } from "react";
// import { GiRadarSweep } from "react-icons/gi";

export const MTabsScreen: FC<HtmlHTMLAttributes<unknown>> = () => {
  // const tabs = useLayoutStore((s) => s.tabs);
  // const activeTab = useLayoutStore((s) => s.activeTab);
  // const setActiveTab = useLayoutStore((s) => s.setActiveTab);

  // const { fn_fechartab: closeTab, fn_montaricone: renderIcon } = useMTab();

  // return <MContainerDefault />;
  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden ">
      {/* TAB BAR */}
      {/* <div className="h-10 bg-[#252526] border-b flex items-center">
        <div className="flex-1 overflow-x-auto">
          <div className="flex min-w-max h-10">
            {tabs.map((tab) => {
              const active = tab?.id === activeTab;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id!)}
                  className={`px-3 flex items-center gap-2 ${
                    active ? "bg-[#1e1e1e]" : "bg-[#2d2d2d]"
                  }`}
                >
                  {renderIcon?.(tab)}

                  {tab.title}

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
      </div> */}
    </div>
  );
};

// const MContainerDefault: FC<HtmlHTMLAttributes<unknown>> = () => {
//   return (
//     <div className="w-full h-full flex flex-1 items-center justify-center">
//       <GiRadarSweep className="size-64 text-zinc-500" />
//     </div>
//   );
// };
