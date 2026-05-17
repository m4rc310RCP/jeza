import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";

export interface ISideControl {
  isOpen: boolean;
  width: number;
  max: number;
}

const createSide = (): ISideControl => ({
  isOpen: false,
  width: 240,
  max: 600,
});

interface IStore {
  // ------------------------------------------------------------------------
  sides: {
    l: ISideControl;
    r: ISideControl;
  };
  toggleSide: (side: "l" | "r") => void;
  changeWidth: (side: "l" | "r", width: number) => void;
  // ------------------------------------------------------------------------
  userApp: IUserApp | null;
  setUserApp: (userApp: IUserApp) => void;
  // ------------------------------------------------------------------------
  userAuth: IUserAuth;
  setUserAuth: (userAuth: IUserAuth) => void;
  // ------------------------------------------------------------------------
  dateExpiredToken: Date | null;
  setDateExpiredToken: (dateExpiredToken: Date | null) => void;
  // ------------------------------------------------------------------------
  cpfCnpj: string | null;
  setCpfCnpj: (cpfCnpj: string | null) => void;
  // ------------------------------------------------------------------------
  screen: TScreen | null;
  setScreen: (screen: TScreen | null) => void;
  // ------------------------------------------------------------------------
}

export const useStoreLocal = create<IStore>()(
  persist(
    (set) => ({
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

      userApp: null,

      setUserApp(userApp) {
        set({ userApp });
      },

      userAuth: {
        nr_cpfcnpj: "",
        vl_senha: "",
        ds_email: "",
        nm_cliente: "",
        in_versenha: false,
        in_docvalido: false,
        in_gravar: true,
        in_cpf: true,
        in_bloqueado: true,
      },

      setUserAuth(userAuth) {
        set({ userAuth });
      },
      // -------- //
      dateExpiredToken: null,
      setDateExpiredToken(dateExpiredToken) {
        set({ dateExpiredToken });
      },
      // -------- //
      cpfCnpj: null,
      setCpfCnpj(cpfCnpj) {
        set({ cpfCnpj });
      },
      // -------- //
      screen: "startup",
      setScreen(screen) {
        set({ screen });
      },
      // -------- //
    }),
    {
      name: "jeza-storage",

      partialize: (state) => ({
        sides: state.sides,
        userAuth: state.userAuth,
        cpfCnpj: state.cpfCnpj,
        dateExpiredToken: state.dateExpiredToken,
        screen: state.screen,
      }),
    },
  ),
);
// *********************************************************************************************************
interface ITokenStore {
  ds_token: string | null;
  setToken: (ds_token: string | null) => void;
}

export const useTokenStore = create<ITokenStore>((set) => ({
  ds_token: null,
  setToken(ds_token) {
    set({ ds_token });
  },
}));
// *********************************************************************************************************
/**
 * encode
 */
const encode = (value: unknown) => {
  return btoa(encodeURIComponent(JSON.stringify(value)));
};

/**
 * decode
 */
const decode = <T>(value: string): T => {
  return JSON.parse(decodeURIComponent(atob(value)));
};

interface ILayoutStore {
  screen: TScreen | null;
  setScreen: (screen: ILayoutStore["screen"]) => void;

  screenData: IScreenData | null;
  setScreenData: (screenData: ILayoutStore["screenData"]) => void;

  token: string | null;
  setToken: (token: ILayoutStore["token"]) => void;

  user: IUser | null;
  setUser: (user: ILayoutStore["user"]) => void;

  cpfCnpj: string | null;
  setCpfCnpj: (cpfCnpj: ILayoutStore["cpfCnpj"]) => void;
}

const screenDataDefault: ILayoutStore["screenData"] = {
  app: { title: m.app_default_title },
  startup: {
    loading: true,
    message: m.text_loading,
  },
};

export const useLayoutStore = create<ILayoutStore>()(
  persist(
    (set) => ({
      // ------------------------------------ //
      screen: "startup",
      setScreen(screen) {
        set({ screen });
      },
      // ------------------------------------ //
      screenData: screenDataDefault,
      setScreenData(screenData) {
        set({ screenData });
      },
      // ------------------------------------ //
      token: null,
      setToken(token) {
        set({ token });
      },
      // ------------------------------------ //
      user: null,
      setUser(user) {
        set({ user });
      },
      // ------------------------------------ //
      cpfCnpj: null,
      setCpfCnpj(cpfCnpj) {
        set({ cpfCnpj });
      },
      // ------------------------------------ //
    }),
    {
      name: "__jeza_layout_hash",
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
// *********************************************************************************************************
