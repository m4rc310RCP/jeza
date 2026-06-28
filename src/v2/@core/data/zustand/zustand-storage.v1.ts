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
  userBalance: IUserBalance | null;
  setUserBalance: (userBalance: ILayoutStore["userBalance"]) => void;
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
  weatherCurrent: TWeather | null;
  setWeatherCurrent: (weatherCurrent: ILayoutStore["weatherCurrent"]) => void;
  dateUpdateWeather: Date | null;
  setDateUpdateWeather: (
    dateUpdateWeather: ILayoutStore["dateUpdateWeather"],
  ) => void;
  // ---	---------------------
}

export const useStoreV1 = create<ILayoutStore>()(
  persist(
    (set) => ({
      token: "",
      setToken(token) {
        //console.trace("[SET TOKEN]", token);
        set({ token });
      },
      appState: "SCREENSHOT",
      setAppState(appState) {
        //console.trace("[SET APP STATE]", appState);
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
        //console.trace("[SET USER]", user);
        set({ user });
      },
      userBalance: null,
      setUserBalance(userBalance) {
        set({ userBalance });
      },
      lastDocument: null,
      setLastDocument(lastDocument) {
        set({ lastDocument });
      },
      layoutPropsAuth: {
        isSaveLastDocument: false,
        isMenuPrincipalMini: false,
        showDashboardValue: true,
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
      weatherCurrent: null,
      setWeatherCurrent(weatherCurrent) {
        set({ weatherCurrent });
      },
      dateUpdateWeather: null,
      setDateUpdateWeather(dateUpdateWeather) {
        set({ dateUpdateWeather });
      },
    }),
    {
      name: "_jeza_v1_hash_",
      onRehydrateStorage: () => {
        //console.log("[REHYDRATE] start");

        return (state) => {
          //console.log("[REHYDRATE] finish", state);
        };
      },
      storage: createJSONStorage(() => ({
        getItem(name) {
          const value = localStorage.getItem(name);
          if (!value) return null;
          return decode(value);
        },
        setItem(name, value) {
          //console.log("[STORAGE SAVE]", value);
          localStorage.setItem(name, encode(value));
        },

        removeItem(name) {
          localStorage.removeItem(name);
        },
      })),
    },
  ),
);
