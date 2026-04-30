import { create } from "zustand";
import { persist } from "zustand/middleware";
import { contentPage } from "@core/services/content.v1";
// import { v4 as uuidv4 } from "uuid";

interface IStore {
  mode: "DES";
  dateTest: Date;
  content: IContent;
  setDateTest: (dateTest: Date) => void;
  setContent: (content: IContent) => void;
  // columns: TKanbanServerStore["columns"];
  // clientId?: string;
  // hydrate: (data: TKanbanServerStore) => void;
  // applyEvent: (event: TMainEvent) => void;
}

// const sortByOrder = <T extends { order: number }>(list: T[]) =>
//   [...list].sort((a, b) => a.order - b.order);

export const useStoreLocal = create<IStore>()(
  persist(
    (set) => ({
      mode: "DES",
      dateTest: new Date(),
      content: contentPage(),
      setDateTest(dateTest) {
        set({ dateTest });
      },
      setContent(content) {
        set({ content });
      },
      // mode: "NORMAL",
      // applyEvent(event) {git push
      // 	switch (event.type) {
      // 		case "CHANGE_OPERATION_MODE": {
      // 			set({ mode: event.mode });
      // 			break;
      // 		}
      // 	}
      // },
    }),
    {
      name: "default-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.dateTest) {
          state.dateTest = new Date(state.dateTest as unknown as string);
        }
      },
    },
  ),
);
