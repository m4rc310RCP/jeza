import {
  type FC,
  type HtmlHTMLAttributes,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ChevronRight,
  X,
  Plus,
  FileCode2,
  Home,
  Search,
  MoreHorizontal,
} from "lucide-react";

// import { useLocalStore } from "@core/database/local/zustand-storage.v1";
// import { MMapContainer } from "@kioski/containers";
import { useStoreLocal } from "@jeza/core/storage/zustand/zustand-storage.v1";


type TTab = {
  id: string;
  title: string;
  icon?: "home" | "code";
  pinned?: boolean;
};

export const MMainScreen: FC<
  HtmlHTMLAttributes<HTMLDivElement>
> = ({ ...rest }) => {
  const prefs = useStoreLocal((s) => s.asideProps);
  const setSidePrefs = useStoreLocal((s) => s.setAsideProps);

  const resizingLeft = useRef(false);
  const resizingRight = useRef(false);

  /* ------------------------------------------------------------------ */
  /* TABS */
  const [tabs, setTabs] = useState<TTab[]>([
    { id: "1", title: "Dashboard", icon: "home", pinned: true },
    { id: "2", title: "Webhook.tsx", icon: "code" },
    { id: "3", title: "PIX.tsx", icon: "code" },
  ]);

  const [activeId, setActiveId] = useState("1");

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeId),
    [tabs, activeId]
  );

  const createTab = () => {
    const id =
      typeof crypto !== "undefined" &&
      "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now());

    setTabs((old) => [
      ...old,
      {
        id,
        title: `Nova Aba ${old.length + 1}`,
        icon: "code",
      },
    ]);

    setActiveId(id);
  };

  const closeTab = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation();

    const tab = tabs.find((t) => t.id === id);
    if (!tab || tab.pinned) return;

    const next = tabs.filter((t) => t.id !== id);

    setTabs(next);

    if (activeId === id) {
      setActiveId(next[0]?.id ?? "");
    }
  };

  const renderIcon = (tab: TTab) => {
    if (tab.icon === "home") return <Home size={14} />;
    return <FileCode2 size={14} />;
  };

  /* ------------------------------------------------------------------ */
  /* RESIZE HELPERS */
  const stopResize = () => {
    resizingLeft.current = false;
    resizingRight.current = false;

    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  };

  const startResize = () => {
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  /* ------------------------------------------------------------------ */
  // const leftWidth = prefs?.sidePartLeft?.isOpen
  //   ? prefs?.sidePartLeft?.width ?? 220
  //   : 5;

  // const rightWidth = prefs?.sidePartRight?.isOpen
  //   ? prefs?.sidePartRight?.width ?? 320
  //   : 5;

  const leftWidth = prefs?.asideLOpen
    ? prefs?.leftWith ?? 220
    : 5;

  const rightWidth = prefs?.asideROpen
    ? prefs?.rigthWith ?? 320
    : 5;

  /* ------------------------------------------------------------------ */

  return (
    <div
      {...rest}
      className="h-screen w-screen bg-[#1e1e1e] flex flex-col text-white"
    >
      <div className="relative flex flex-1 overflow-hidden">
        {/* LEFT */}
        <aside
          className="relative bg-[#252526] border-r border-black/30 shrink-0"
          style={{ width: leftWidth }}
        >
          {/* Toggle */}
          <button
            type="button"
            className="absolute -right-[18px] top-1/2 -translate-y-1/2 h-16 w-[18px] bg-[#2a2f36] border border-black/30 rounded-r-md flex items-center justify-center z-20"
            onClick={() =>
              setSidePrefs({
                ...prefs,
								asideLOpen: !prefs.asideLOpen,
              })
            }
          >
            <ChevronRight
              size={14}
              className={
                prefs?.asideLOpen
                  ? "rotate-180"
                  : ""
              }
            />
          </button>

          {/* Resize */}
          {prefs?.asideLOpen && (
            <div
              className="absolute right-0 top-0 h-full w-[6px] cursor-col-resize bg-[#132838] hover:bg-[#1f4a66]"
              onPointerDown={(e) => {
                resizingLeft.current = true;
                startResize();
                e.currentTarget.setPointerCapture(
                  e.pointerId
                );
              }}
              onPointerMove={(e) => {
                if (!resizingLeft.current) return;

                const width = e.clientX;

                const min = 5;
                const max =
                  prefs?.maxLeftWith ?? 500;

                const finalWidth = Math.min(
                  Math.max(width, min),
                  max
                );

                setSidePrefs({
                  ...prefs,
									leftWith: finalWidth
                  // sidePartLeft: {
                  //   ...prefs.sidePartLeft,
                  //   width: finalWidth,
                  // },
                });
              }}
              onPointerUp={(e) => {
                stopResize();
                e.currentTarget.releasePointerCapture(
                  e.pointerId
                );
              }}
              onPointerCancel={stopResize}
              onLostPointerCapture={stopResize}
            />
          )}
        </aside>

        {/* MAIN */}
        <main className="flex flex-col flex-1 min-w-0 overflow-hidden bg-[#1f1f1f]">
          {/* Tabs */}
          <div className="h-10 shrink-0 bg-[#252526] border-b border-black/30 flex items-center">
            {/* Search */}
            <div className="px-2 h-full flex items-center border-r border-black/30">
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/5">
                <Search size={15} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden">
              <div className="flex min-w-max h-10">
                {tabs.map((tab) => {
                  const active = tab.id === activeId;

                  return (
                    <button
                      key={tab.id}
                      onClick={() =>
                        setActiveId(tab.id)
                      }
                      className={`
                        group relative h-full min-w-[170px] max-w-[260px]
                        px-3 border-r border-black/30 flex items-center gap-2 text-sm
                        ${
                          active
                            ? "bg-[#1e1e1e] text-white"
                            : "bg-[#2d2d2d] text-gray-300 hover:bg-[#333]"
                        }
                      `}
                    >
                      {renderIcon(tab)}

                      <span className="truncate flex-1 text-left">
                        {tab.title}
                      </span>

                      {!tab.pinned && (
                        <button
                          type="button"
                          onClick={(e) =>
                            closeTab(e, tab.id)
                          }
                          className="w-5 h-5 shrink-0 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-white/10"
                        >
                          <X size={13} />
                        </button>
                      )}

                      {active && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="px-1 h-full flex items-center gap-1 border-l border-black/30">
              <button
                onClick={createTab}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/5"
              >
                <Plus size={15} />
              </button>

              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/5">
                <MoreHorizontal size={15} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-auto p-5">
            <h1 className="text-lg font-semibold mb-2">
              {activeTab?.title}
            </h1>

            <p className="text-sm text-gray-400 mb-5">
              Main completo com resize sólido.
            </p>

            {/* <MMapContainer className="h-[600px]" /> */}
          </div>
        </main>

        {/* RIGHT OVERLAY */}
        <aside
          className="absolute right-0 top-0 h-full z-30 bg-[#252526] border-l border-black/30"
          style={{ width: rightWidth }}
        >
          {/* Toggle */}
          <button
            type="button"
            className="absolute -left-[18px] top-1/2 -translate-y-1/2 h-16 w-[18px] bg-[#2a2f36] border border-black/30 border-r-0 rounded-l-md flex items-center justify-center z-40"
            onClick={() =>
              setSidePrefs({
                ...prefs,
								asideROpen: !prefs.asideROpen
              })
            }
          >
            <ChevronRight
              size={14}
              className={
                !prefs?.asideROpen
                  ? "rotate-180"
                  : ""
              }
            />
          </button>

          {/* Resize */}
          {prefs?.asideROpen && (
            <div
              className="absolute left-0 top-0 h-full w-[6px] cursor-col-resize bg-[#132838] hover:bg-[#1f4a66]"
              onPointerDown={(e) => {
                resizingRight.current = true;
                startResize();

                e.currentTarget.setPointerCapture(
                  e.pointerId
                );
              }}
              onPointerMove={(e) => {
                if (!resizingRight.current) return;

                const width =
                  window.innerWidth - e.clientX;

                const min = 5;
                const max =
                  prefs?.maxRigthWith ??
                  700;

                const finalWidth = Math.min(
                  Math.max(width, min),
                  max
                );

                setSidePrefs({
                  ...prefs,
									rigthWith: finalWidth
                });
              }}
              onPointerUp={(e) => {
                stopResize();

                e.currentTarget.releasePointerCapture(
                  e.pointerId
                );
              }}
              onPointerCancel={stopResize}
              onLostPointerCapture={stopResize}
            />
          )}

          {/* Content */}
          {prefs?.asideROpen && (
            <div className="h-full bg-[#193549] p-4">
              Painel direito overlay
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};