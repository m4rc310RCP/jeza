import {
  createContext,
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { mqttClient } from "@jeza-v2/core/services/mqtt/mqtt-service.v1";
import { createUpdateValue } from "@jeza-v2/core/utils/general.v1";

interface IMMqttValues {
  client: typeof mqttClient;
}
const defaultValue: IMMqttValues = {} as IMMqttValues;

const MMqttContext = createContext<IMMqttValues>(defaultValue);

const MMqttProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState<IMMqttValues>(defaultValue);
  const update = useMemo(() => createUpdateValue(setValue), []);

  useEffect(() => {
    update("client", mqttClient);
  }, [update]);
  return (
    <MMqttContext.Provider value={value}>{children}</MMqttContext.Provider>
  );
};

export { MMqttProvider, MMqttContext };
