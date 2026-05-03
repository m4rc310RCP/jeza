import { type FC, type HtmlHTMLAttributes, useMemo, useRef } from "react";

import { X, Plus, FileCode2, Home, Search } from "lucide-react";

import { MToggleSide } from "@jeza/components";
import { MMapPart, MPartNone } from "@jeza/containers";

import { GiRadarSweep } from "react-icons/gi";
import { useStoreLocal } from "@jeza/core/storage/zustand/zustand-storage.v1";

export const MMainScreen: FC<HtmlHTMLAttributes<HTMLDivElement>> = ({
  ...rest
}) => {
  const prefs = useStoreLocal((s) => s.asideProps);
  const setSidePrefs = useStoreLocal((s) => s.setAsideProps);

  const tabs = useStoreLocal((s) => s.tabs) as TTab[];
  const activeTab = useStoreLocal((s) => s.activeTab);

  const store = useStoreLocal.getState();

  const resizingLeft = useRef(false);
  const resizingRight = useRef(false);

  const currentTab = useMemo(
    () => tabs.find((t) => t.id === activeTab),
    [tabs, activeTab],
  );

  /* ---------------------------------------- */
  const createTab = () => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now());

    store.setTabs([
      ...tabs,
      {
        id,
        title: `Nova Aba ${tabs.length + 1}`,
        icon: "code",
        view: "map",
      },
    ]);

    store.setActiveTab(id);
  };

  const closeTab = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();

    const tab = tabs.find((t) => t.id === id);
    if (!tab || tab.pinned) return;

    const next = tabs.filter((t) => t.id !== id);

    store.setTabs(next);

    if (activeTab === id) {
      store.setActiveTab(next[0]?.id ?? "");
    }
  };

  /* ---------------------------------------- */
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

  /* ---------------------------------------- */
  const leftWidth = prefs?.asideLOpen ? (prefs?.leftWith ?? 220) : 5;

  const rightWidth = prefs?.asideROpen ? (prefs?.rigthWith ?? 320) : 5;

  /* ====================================================== */

  return (
    <div
      {...rest}
      className="h-screen w-screen bg-[#1e1e1e] flex flex-col text-white"
    >
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* LEFT */}
        <aside
          className="relative h-full shrink-0 bg-[#252526] border-r border-black/30"
          style={{ width: leftWidth }}
        >
          <MToggleSide
            open={prefs.asideLOpen}
            side="LEFT"
            onClick={() =>
              setSidePrefs({
                ...prefs,
                asideLOpen: !prefs.asideLOpen,
              })
            }
          />

          {prefs?.asideLOpen && (
            <div
              className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize bg-main"
              onPointerDown={(e) => {
                resizingLeft.current = true;
                startResize();
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (!resizingLeft.current) return;

                const width = e.clientX;

                const final = Math.min(
                  Math.max(width, 5),
                  prefs?.maxLeftWith ?? 500,
                );

                setSidePrefs({
                  ...prefs,
                  leftWith: final,
                });
              }}
              onPointerUp={(e) => {
                stopResize();
                e.currentTarget.releasePointerCapture(e.pointerId);
              }}
            />
          )}
        </aside>

        {/* MAIN */}
        <main className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden bg-[#1f1f1f]">
          {/* TOP BAR */}
          <div className="h-10 bg-[#252526] border-b flex items-center">
            <div className="px-2 border-r">
              <Search size={15} />
            </div>

            <div className="flex-1 overflow-x-auto">
              <div className="flex min-w-max h-10">
                {tabs.map((tab) => {
                  const active = tab.id === activeTab;

                  return (
                    <div
                      key={tab.id}
                      onClick={() => store.setActiveTab(tab.id)}
                      className={`px-3 flex items-center gap-2 ${
                        active ? "bg-[#1e1e1e]" : "bg-[#2d2d2d]"
                      }`}
                    >
                      {renderIcon(tab)}
                      {tab.title}

                      {!tab.pinned && (
                        <button onClick={(e) => closeTab(e, tab.id)}>
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={createTab}>
              <Plus size={15} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;

              return (
                <div key={tab.id} className={isActive ? "flex-1" : "hidden"}>
                  <TabRenderer tab={tab} isActive={isActive} />
                </div>
              );
            })}

            {tabs.length === 0 && <MPartNone />}
          </div>
        </main>

        {/* RIGHT (OVERLAY FINAL) */}
        <>
          <MToggleSide
            open={prefs.asideROpen}
            side="RIGHT"
            onClick={() =>
              setSidePrefs({
                ...prefs,
                asideROpen: !prefs.asideROpen,
              })
            }
            style={{
              right: prefs.asideROpen ? rightWidth : 0,
            }}
          />

          <aside
            className="fixed right-0 top-0 h-full z-[500] bg-[#252526] border-l border-black/30 transition-transform duration-200"
            style={{
              width: rightWidth,
              transform: prefs?.asideROpen
                ? "translateX(0)"
                : `translateX(${rightWidth}px)`,
            }}
          >
            {prefs?.asideROpen && (
              <>
                <div
                  className="absolute left-0 top-0 h-full w-1.5 cursor-col-resize bg-main"
                  onPointerDown={(e) => {
                    resizingRight.current = true;
                    startResize();
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => {
                    if (!resizingRight.current) return;

                    const width = window.innerWidth - e.clientX;

                    const final = Math.min(
                      Math.max(width, 5),
                      prefs?.maxRigthWith ?? 700,
                    );

                    setSidePrefs({
                      ...prefs,
                      rigthWith: final,
                    });
                  }}
                  onPointerUp={(e) => {
                    stopResize();
                    e.currentTarget.releasePointerCapture(e.pointerId);
                  }}
                  onLostPointerCapture={stopResize}
                  onPointerCancel={stopResize}
                />

                <div className="h-full bg-[#193549] p-4">
                  Painel direito overlay
                </div>
              </>
            )}
          </aside>
        </>
      </div>

      <div className="border-t h-7" />
    </div>
  );
};

/* ====================================================== */

const TabRenderer = ({ tab, isActive }: { tab: TTab; isActive: boolean }) => {
  switch (tab.view) {
    case "dashboard":
      return <GiRadarSweep className="m-auto text-9xl" />;
    case "map":
      return <MMapPart isActive={isActive} />;
    default:
      return <div>Sem conteúdo</div>;
  }
};

const renderIcon = (tab: TTab) => {
  if (tab.icon === "home") return <Home size={14} />;
  return <FileCode2 size={14} />;
};
