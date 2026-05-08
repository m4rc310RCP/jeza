import { create } from "zustand";
import { persist } from "zustand/middleware";

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
      //-------------
      userApp: null,
      setUserApp(userApp) {
        set({ userApp });
      },
      //-------------
    }),
    {
      name: "jeza-storage",
      partialize: (state) => ({ sides: state.sides }),
    },
  ),
);
