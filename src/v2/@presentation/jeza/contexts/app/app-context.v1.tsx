import {
  useStoreV1,
  type ILayoutStore,
  type TIdMenu,
} from "@jeza-v2/core/data/zustand/zustand-storage.v1";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  type FC,
  type PropsWithChildren,
  type ReactNode,
} from "react";

import { m, fmt } from "@jeza-v2/core/i18n/locale-i18n.v1";

import { MdOutlineDashboard } from "react-icons/md";
import { TfiLayoutSidebarNone } from "react-icons/tfi";
import { BsPiggyBank, BsGear } from "react-icons/bs";

export const APP_EVENTS = {
  INACTIVE_RETURN: "app:inactive-return",
} as const;

interface IMAppValues {
  menu: ILayoutStore["menus"];
  selectItem: (id: TIdMenu) => void;
  changeAppState: (state: ILayoutStore["appState"]) => void;
  getMenuItemIcon: (id: TIdMenu) => ReactNode;
}

const defaultValue = {} as IMAppValues;

export const MAppContext = createContext<IMAppValues>(defaultValue);

export const MAppProvider: FC<PropsWithChildren> = ({ children }) => {
  const authStatus = useStoreV1((s) => s.authStatus);

  const setAppState = useStoreV1((s) => s.setAppState);
  const setAppTitle = useStoreV1((s) => s.setAppTitle);

  const menus = useStoreV1((s) => s.menus);
  const setMenu = useStoreV1((s) => s.setMenu);

  const tabs = useStoreV1((s) => s.tabs);
  const setTabs = useStoreV1((s) => s.setTabs);

  // --------------------------------------------------
  // Menu
  // --------------------------------------------------

  useEffect(() => {
    if (menus) return;

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
  }, [menus, setMenu]);

  const selectItem = useCallback(
    (id: TIdMenu) => {
      if (!menus) return;

      setMenu({
        ...menus,
        itens: menus.itens.map((item) => ({
          ...item,
          selected: item.id === id,
        })),
      });
    },
    [menus, setMenu],
  );

  // --------------------------------------------------
  // Tabs
  // --------------------------------------------------

  useEffect(() => {
    if (tabs.length > 0) return;

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
  }, [tabs, setTabs]);

  // --------------------------------------------------
  // Auth State
  // --------------------------------------------------

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
  }, [authStatus, setAppState, setAppTitle]);

  // --------------------------------------------------
  // Title
  // --------------------------------------------------

  useEffect(() => {
    setAppTitle(`${m.text_appname} - ${m.text_geza_slogan}`);
  }, [setAppTitle]);

  // --------------------------------------------------
  // Inactivity
  // --------------------------------------------------

  useEffect(() => {
    const INACTIVITY_TIME = 5 * 60 * 1000;

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
            detail: { inactiveTime },
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

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, updateActivity),
      );

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const getMenuItemIcon = useCallback((id: TIdMenu): ReactNode => {
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
  }, []);

  const value = useMemo<IMAppValues>(
    () => ({
      menu: menus,
      selectItem,
      changeAppState: setAppState,
      getMenuItemIcon,
    }),
    [menus, selectItem, setAppState, getMenuItemIcon],
  );

  return <MAppContext.Provider value={value}>{children}</MAppContext.Provider>;
};
