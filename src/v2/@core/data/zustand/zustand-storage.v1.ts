import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// encode/decode ---------------------
const encode = (value: unknown) => {
  return btoa(encodeURIComponent(JSON.stringify(value)));
};

const decode = <T>(value: string): T => {
  return JSON.parse(decodeURIComponent(atob(value)));
};
// --------------------- encode/decode
// ---------------------

const createSide = (): ISideControl => ({
  isOpen: false,
  width: 240,
  max: 600,
});

export type TIdMenu = "DASHBOARD" | "TRANSACTIONS" | "PREFERENCES";

interface IMenuItem {
  id: TIdMenu;
  title: string;
  selected: boolean;
  disabled?: boolean;
}

interface IMenu {
  itens: IMenuItem[];
}

export interface ILayoutStore {
  // ------------------------
  sides: {
    l: ISideControl;
    r: ISideControl;
  };
  toggleSide: (side: "l" | "r") => void;
  changeWidth: (side: "l" | "r", width: number) => void;
  // ------------------------
  token: string | null;
  setToken: (token: ILayoutStore["token"]) => void;
  // ------------------------
  appState: IAppState;
  setAppState: (appState: ILayoutStore["appState"]) => void;
  // ------------------------
  authStatus:
    | "REGISTERED"
    | "UNREGISTERED"
    | "AUTHORIZED"
    | "UNAUTHORIZED"
    | "TOKEN_EXPIRED"
    | "PROCESSING_REFRESH_TOKEN";
  setAuthStatus: (authStatus: ILayoutStore["authStatus"]) => void;
  // ------------------------
  registerId: string | null;
  setRegisterId: (registered: ILayoutStore["registerId"]) => void;
  // ------------------------
  setAppTitle: (title: string) => void;
  // ------------------------
  dateTokenExp: Date | null;
  setDateTokenExp: (dateTokenExp: ILayoutStore["dateTokenExp"]) => void;
  // ---	---------------------
  user: IUserAuth | null;
  setUser: (user: ILayoutStore["user"]) => void;
  // ---	---------------------
  lastDocument: string | null;
  setLastDocument: (lastDocument: ILayoutStore["lastDocument"]) => void;
  // ---	---------------------
  layoutPropsAuth: ILayoutProps["authProps"] | null;
  setLayoutPropsAuth: (
    layoutPropsAuth: ILayoutStore["layoutPropsAuth"],
  ) => void;
  // ---	---------------------
  menus: IMenu | null;
  setMenu: (menus: ILayoutStore["menus"]) => void;
  selectedMenuItem: IMenuItem | null;
  setSelectedMenuItem: (item: ILayoutStore["selectedMenuItem"]) => void;
  // ---	---------------------
  tabs: TTab[];
  setTabs: (tabs: ILayoutStore["tabs"]) => void;
  activeTab: string | null;
  setActiveTab: (activeTab: ILayoutStore["activeTab"]) => void;
  tab: TTab | null;
  setTab: (tab: ILayoutStore["tab"]) => void;
  // ---	---------------------
}

export const useStoreV1 = create<ILayoutStore>()(
  persist(
    (set) => ({
      token: null,
      setToken(token) {
        set({ token });
      },
      appState: "SCREENSHOT",
      setAppState(appState) {
        set({ appState });
      },
      registerId: null,
      setRegisterId(registerId) {
        set({ registerId });
      },
      setAppTitle(title) {
        document.title = title;
      },
      authStatus: "UNREGISTERED",
      setAuthStatus(authStatus) {
        set({ authStatus });
      },
      dateTokenExp: null,
      setDateTokenExp(dateTokenExp) {
        set({ dateTokenExp });
      },
      user: null,
      setUser(user) {
        set({ user });
      },
      lastDocument: null,
      setLastDocument(lastDocument) {
        set({ lastDocument });
      },
      layoutPropsAuth: {
        isSaveLastDocument: false,
        isMenuPrincipalMini: false,
      },
      setLayoutPropsAuth(layoutPropsAuth) {
        set({ layoutPropsAuth });
      },
      menus: null,
      setMenu(menus) {
        set({ menus });
      },
      tabs: [],
      setTabs(tabs) {
        set({ tabs });
      },
      activeTab: null,
      setActiveTab(activeTab) {
        set({ activeTab });
      },
      tab: null,
      setTab(tab) {
        set({ tab });
      },
      selectedMenuItem: null,
      setSelectedMenuItem(selectedMenuItem) {
        set({ selectedMenuItem });
      },
      sides: {
        l: createSide(),
        r: createSide(),
      },
      toggleSide: (side) =>
        set((state) => ({
          sides: {
            ...state.sides,
            [side]: {
              ...state.sides[side],
              isOpen: !state.sides[side].isOpen,
            },
          },
        })),
      changeWidth: (side, width) =>
        set((state) => ({
          sides: {
            ...state.sides,
            [side]: {
              ...state.sides[side],
              width,
            },
          },
        })),
    }),
    {
      name: "_jeza_v1_hash_",
      storage: createJSONStorage(() => ({
        getItem(name) {
          const value = localStorage.getItem(name);
          if (!value) return null;
          return decode(value);
        },
        setItem(name, value) {
          localStorage.setItem(name, encode(value));
        },

        removeItem(name) {
          localStorage.removeItem(name);
        },
      })),
    },
  ),
);
