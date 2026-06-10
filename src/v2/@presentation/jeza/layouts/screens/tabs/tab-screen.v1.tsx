import { X } from "lucide-react";
import { useRef, useState, type FC, type HtmlHTMLAttributes } from "react";
import { GiRadarSweep } from "react-icons/gi";
import { IoClose, IoSearch } from "react-icons/io5";
import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { useMTab, MTabDashboard } from "@jeza-v2/presentation/jeza";

// import { GiRadarSweep } from "react-icons/gi";

export const MTabsScreen: FC<HtmlHTMLAttributes<unknown>> = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const openSearch = () => {
    if (!open) {
      setOpen(true);
    }
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
    if (open) {
      console.log(`Search for ${value}`);
    }
  };

  const tabs = useStoreV1((s) => s.tabs);
  const atab = useStoreV1((s) => s.tab);
  // const activeTab = useLayoutStore((s) => s.activeTab);
  // const setActiveTab = useLayoutStore((s) => s.setActiveTab);
  const setTab = useStoreV1((s) => s.setTab);

  const { fn_fechartab: closeTab, fn_montaricone: renderIcon } = useMTab();

  if (tabs && tabs.length === 0) {
    return <MContainerDefault />;
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden bg-[#1F1F1F] ">
      <div className="h-8 bg-primary flex items-center">
        <div className="flex h-full items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              openSearch();
            }}
            className="relative ml-3 mr-2 flex items-center"
          >
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={(e) => e.target.select()}
              onBlur={() => {
                // Só oculta se estiver vazio
                if (!value.trim()) {
                  setOpen(false);
                }
              }}
              className={`
							transition-all duration-300
							border border-zinc-600
							bg-zinc-800 rounded-l py-0.5 px-2 text-xs outline-none
							${open ? "w-[30ch] opacity-100" : "w-0 opacity-0 px-0 border-transparent"}
						`}
            />
            {/* Botão limpar */}
            {open && value && (
              <button
                type="button"
                onClick={() => {
                  setValue("");
                  inputRef.current?.focus();
                }}
                className="
					absolute right-9
					text-zinc-400 hover:text-zinc-200
					transition-colors
				"
                title="Limpar"
              >
                <IoClose size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={openSearch}
              className="px-2 py-1 mx-1 bg-orange-500 rounded hover:bg-orange-400 transition-colors"
            >
              <IoSearch />
            </button>
          </form>
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
                    active
                      ? "bg-[#1E1E1E] border-b border-blue-300"
                      : "bg-[#2D2D2D]"
                  }`}
                >
                  {renderIcon?.(tab)}
                  <span className="min-w-[15ch]">{tab.title}</span>
                  {!tab.pinned && (
                    <button className="" onClick={(e) => closeTab(e, tab.id!)}>
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
      <div className="flex flex-1  items-center">
        <div className="h-full w-full   overflow-x-auto">
          {/* <MTabDashboard /> */}
          {tabs?.map((tab) => {
            const isActive = tab.id === atab?.id;
            return (
              <div
                key={tab.id}
                className={isActive ? "flex flex-col h-full w-full" : "hidden"}
              >
                {tab?.showHeader && (
                  <>
                    <div className="flex flex-col w-full leading-none p-3">
                      <h1 className="text-xl font-bold  leading-none">
                        {tab?.title}
                      </h1>
                      <h2 className="text-xs opacity-40">{tab?.subtitle}</h2>
                    </div>
                  </>
                )}
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
  if (tab.loading) {
    // return <MSkeletonPage />;
    return <div />;
  }
  switch (tab.view) {
    case "dashboard":
      return <MTabDashboard />;
    case "deliveries":
      return <div className="">DELIVIES</div>;
    // case "finantials_movements":
    //   return <MTabFinantialsList />;
    default:
      return <div>Sem conteúdo</div>;
  }
  return <div className="">no content</div>;
};
