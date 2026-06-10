import {
  useStoreV1,
  type ILayoutStore,
  type TIdMenu,
} from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { createUpdateValue } from "@jeza-v2/core/utils/general.v1";
import {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { m, fmt } from "@jeza-v2/core/i18n/locale-i18n.v1";
import { MdOutlineDashboard } from "react-icons/md";
import { TfiLayoutSidebarNone } from "react-icons/tfi";
import { BsPiggyBank } from "react-icons/bs";
import { BsGear } from "react-icons/bs";

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

  const authStatus = useStoreV1((s) => s.authStatus);
  const setAppState = useStoreV1((s) => s.setAppState);
  const setAppTitle = useStoreV1((s) => s.setAppTitle);
  const setMenu = useStoreV1((s) => s.setMenu);
  const menus = useStoreV1((s) => s.menus);
  const setSelectedMenuItem = useStoreV1((s) => s.setSelectedMenuItem);
  const selectedMenuItem = useStoreV1((s) => s.selectedMenuItem);

  const refstartup = useRef<boolean>(false);

  const tabs = useStoreV1((s) => s.tabs);
  const setTabs = useStoreV1((s) => s.setTabs);

  // ------------------------------------------------------
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
  // ------------------------------------------------------
  useEffect(() => {
    if (!authStatus) return;

    switch (authStatus) {
      case "AUTHORIZED":
        setAppState("ON-LINE");
        setAppTitle(fmt("title_app_online", m.text_geza_slogan));
        break;

      case "UNAUTHORIZED":
        setAppState("SIGNIN");
        setAppTitle(m.title_app_signin);
        break;

      case "UNREGISTERED":
        setAppState("SCREENSHOT");
        break;
    }
  }, [authStatus, setAppState]);
  // ------------------------------------------------------
  useEffect(() => {
    update("selectItem", (id) => {
      setMenu({
        ...menus,
        itens:
          menus?.itens.map((i) => ({
            ...i,
            selected: i.id === id,
          })) ?? [],
      });
    });
  }, [update]);

  useEffect(() => {
    if (menus && menus.itens) {
      const selected = menus.itens.find((e) => e.selected);
      setSelectedMenuItem(selected ?? null);
    }
  }, [menus]);

  // ------------------------------------------------------
  useEffect(() => {
    if (!menus) {
      setMenu({
        itens: [
          {
            id: "DASHBOARD",
            title: m.menu_dashboard,
            selected: true,
            disabled: false,
          },
          {
            id: "TRANSACTIONS",
            title: m.menu_transactions,
            selected: false,
            disabled: false,
          },
          {
            id: "PREFERENCES",
            title: m.menu_settings,
            selected: false,
            disabled: false,
          },
        ],
      });
    }
  }, [setMenu]);

  useEffect(() => {
    // setTabs([]);
    if (tabs.length === 0) {
      setTabs([
        {
          id: "dash",
          title: m.menu_dashboard,
          subtitle: m.menu_dashboard_subtitle,
          view: "dashboard",
          showHeader: true,
          loading: false,
          pinned: true,
          icon: "dashboard",
        },
        {
          id: "test",
          title: "Teste",
          subtitle: "text subtitle",
          view: "deliveries",
          showHeader: false,
        },
      ]);
    }
  }, [tabs]);

  useEffect(() => {
    // setMenu(null);
    update("menu", menus);
  }, [menus]);

  useEffect(() => {
    // setTabs([]);
    if (refstartup.current) return;
    console.log(selectedMenuItem);
  }, [selectedMenuItem]);

  // ------------------------------------------------------
  useEffect(() => {
    setAppTitle(`${m.text_appname} - ${m.text_geza_slogan}`);
  }, [setAppTitle]);

  // ------------------------------------------------------
  useEffect(() => {
    refstartup.current = true;

    const INACTIVITY_TIME = 5 * 60 * 1000; // 5 minutos

    let lastActivity = Date.now();

    const updateActivity = () => {
      lastActivity = Date.now();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) return;

      const inactiveTime = Date.now() - lastActivity;

      if (inactiveTime >= INACTIVITY_TIME) {
        window.dispatchEvent(
          new CustomEvent(APP_EVENTS.INACTIVE_RETURN, {
            detail: {
              inactiveTime,
            },
          }),
        );
      }

      updateActivity();
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ] as const;

    events.forEach((event) => window.addEventListener(event, updateActivity));

    document.addEventListener("visibilitychange", handleVisibilityChange);

    refstartup.current = false;

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, updateActivity),
      );

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // ------------------------------------------------------

  return <MAppContext.Provider value={value}>{children}</MAppContext.Provider>;
};

export { MAppContext, MAppProvider };
