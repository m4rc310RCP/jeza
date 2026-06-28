import { useRef, useState, type FC, type HtmlHTMLAttributes } from "react";
import { MSide, useMTab } from "@jeza-v2/presentation/jeza";
import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { IoSearch } from "react-icons/io5";
import { X } from "lucide-react";

export const MMainSide: FC<HtmlHTMLAttributes<unknown>> = (props) => {
  const { ...rest } = props;
  const [openSearch, setOpenSearch] = useState(false);
  const [valueToSearch, setValueToSearch] = useState<string>("");

  const inputSearchRef = useRef<HTMLInputElement>(null);

  const { makeIcon, closeTab, rendererTab } = useMTab();

  const tabs = useStoreV1((s) => s.tabs);
  const selectedTab = useStoreV1((s) => s.tab);
  const setTab = useStoreV1((s) => s.setTab);

  const handleOpenSearch = () => {
    if (!openSearch) {
      setOpenSearch(true);
    }
    requestAnimationFrame(() => {
      inputSearchRef.current?.focus();
      inputSearchRef.current?.select();
    });
    if (openSearch) {
      console.log(`Search for ${valueToSearch}`);
    }
  };

  return (
    <div {...rest} className="w-full h-full flex text-white">
      <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden bg-[#1F1F1F]">
        <div className="h-8 bg-[#252525] flex items-center">
          {/* --~> SEARCH */}
          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              handleOpenSearch();
            }}
            className="relative ml-3 mr-2 flex items-center"
          >
            <input
              ref={inputSearchRef}
              type="text"
              value={valueToSearch}
              onChange={(e) => setValueToSearch(e.target.value)}
              onFocus={(e) => e.target.select()}
              onBlur={() => {
                // Só oculta se estiver vazio
                if (!valueToSearch.trim()) {
                  setOpenSearch(false);
                }
              }}
              className={`
									transition-all duration-300
									border border-zinc-600
									bg-zinc-800 rounded-l py-0.5 text-xs outline-none
									${openSearch ? "w-[40ch] opacity-100 px-2 mr-1" : "w-0 opacity-0 px-0 border-transparent"}
								`}
            />

            <button
              type="button"
              onClick={handleOpenSearch}
              className="px-2 py-1 mx-1 bg-orange-500 rounded hover:bg-orange-400 transition-colors"
            >
              <IoSearch />
            </button>
          </form>

          {/* SEARCH <~-- */}
          <div className="flex-1 overflow-x-auto ">
            <div className="flex min-w-max h-8">
              {tabs.map((tab) => {
                const active = tab.id === selectedTab?.id;
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
                    {makeIcon?.(tab.view)}
                    <span className="min-w-[15ch] text-sm">{tab.title}</span>
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
        <div className="flex flex-1  items-center">
          <div className="h-full w-full overflow-x-auto">
            {tabs?.map((tab) => {
              const isActive = tab.id === selectedTab?.id;
              return (
                <div
                  key={tab.id}
                  className={`
											${isActive ? "flex h-full w-full" : "hidden"}
										`}
                >
                  {rendererTab?.(tab)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <MSide side="RIGHT">M</MSide>
    </div>
  );
};
