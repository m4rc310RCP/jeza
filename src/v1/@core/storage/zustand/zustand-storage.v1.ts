import { create } from "zustand";
import { persist } from "zustand/middleware";
// import { v4 as uuidv4 } from "uuid";

interface IStore {
  asideProps: ILayoutProps["asideProps"];
  setAsideProps: (asideProps: ILayoutProps["asideProps"]) => void;
}

export const useStoreLocal = create<IStore>()(
  persist(
    (set) => ({
      asideProps: {
        leftWith: 200,
        maxLeftWith: 500,
        rigthWith: 500,
        maxRigthWith: 800,
      },
      setAsideProps(asideProps) {
        set({ asideProps });
      },
    }),
    {
      name: "default-storage",
    },
  ),
);
