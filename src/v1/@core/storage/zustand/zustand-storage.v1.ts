import { create } from "zustand";
import { persist } from "zustand/middleware";
// import { v4 as uuidv4 } from "uuid";

interface IStore {
  asideProps: ILayoutProps["asideProps"];
  setAsideProps: (asideProps: ILayoutProps["asideProps"]) => void;
	tabs: TTab[] ;
	setTabs: (tabs: TTab[])=> void;
	activeTab: string;
	setActiveTab: (activeTab: string) => void;
	//-------------- //
	location: ILocation | null;
	setLocation: (location: ILocation | null) => void;
	//-------------- //
}

export const useStoreLocal = create<IStore>()(
  persist(
    (set) => ({
      asideProps: {
        leftWith: 200,
        maxLeftWith: 500,
        rigthWith: 500,
        maxRigthWith: 800,
				asideLOpen: true,
				asideROpen: true,
      },
      setAsideProps(asideProps) {
        set({ asideProps });
      },
			//-------------------
			tabs: [],
			setTabs(tabs) {
				set({tabs});
			},
			activeTab: '1',
			setActiveTab(activeTab) {
				set({activeTab});
			},
			//-------------------
			location: null,
			setLocation(location) {
				set({ location });
			},
			//-------------------
    }),
    {
      name: "default-storage",
    },
  ),
);
