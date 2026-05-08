import { createUpdateValue } from "@jeza/core/general.v1";
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useStoreLocal } from "@jeza/core/storage/zustand/zustand-storage.v1";

import { m } from "@jeza/i18n/locale-i18n.v1";
import { apiMP } from "@jeza/core/services/http/geza/geza-map-service.v1";

interface IMainValues {
  changeTitle: (title: string) => void;
  appName: string;
  location: IAwaitValue<ILocation>;
  searchLocal: (local: string) => void;
  listPlaces: IAwaitValue<IApiRoutes["/api/local"]["response"]>;
}
const defaultValue: IMainValues = {} as IMainValues;

const MainContext = createContext<IMainValues>(defaultValue);

const MainProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState<IMainValues>(defaultValue);
  const update = useMemo(() => createUpdateValue(setValue), []);

  const location = useStoreLocal((s) => s.location);
  const store = useStoreLocal.getState();

  useEffect(() => {
    if (!location) {
      update("location", { loading: true });
      store.setLocation({
        latitude: -24.0233293,
        longitude: -52.3634782,
      });

      // navigator.geolocation.getCurrentPosition(pos => {
      // 	store.setLocation({
      // 		// latitude: pos.coords.latitude,
      // 		// longitude: pos.coords.longitude
      // 		latitude: -24.0233293,
      // 		longitude: -52.3634782
      // 	});
      // });
      return;
    }
    update("location", { loading: false, value: location });
  }, [location, store, update]);

  useEffect(() => {
    store.setLocation(null);
    window.document.title = m.app_default_title;
    update("changeTitle", (title: string) => {
      window.document.title = title ?? m.app_default_title;
    });

    update("searchLocal", (local: string) => {
      update("listPlaces", { loading: true });
      apiMP.post("/api/local", { nm_local: local }).then((resp) => {
        update("listPlaces", { loading: false, value: resp });
      });
    });
  }, [update, store]);

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export { MainContext, MainProvider };
