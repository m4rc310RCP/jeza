import type { FC, HtmlHTMLAttributes } from "react";
import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import {
  MAuthContainer,
  MMainContainer,
  useForceRefreshOnInactivity,
} from "@jeza-v2/presentation/jeza";

export const MSwitchContainer: FC<HtmlHTMLAttributes<unknown>> = () => {
  useForceRefreshOnInactivity({
    maxInactiveMs: 5 * 60 * 1000,
  });

  const appState = useStoreV1((s) => s.appState);
  switch (appState) {
    case "SIGNIN":
      return <MAuthContainer />;
    case "ON-LINE":
      return <MMainContainer />;
    default:
      return <div className="">NONE</div>;
  }
};
