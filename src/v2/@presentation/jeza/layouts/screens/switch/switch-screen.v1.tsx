import type { FC, HtmlHTMLAttributes } from "react";
import {
  MSplashScreen,
  MSignInScreen,
  MAppScreen,
} from "@jeza-v2/presentation/jeza/layouts";
import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";

export const MSwitchScreen: FC<HtmlHTMLAttributes<unknown>> = () => {
  const appState = useStoreV1((s) => s.appState);
  switch (appState) {
    case "SCREENSHOT":
      return <MSplashScreen />;
    case "SIGNIN":
      return <MSignInScreen />;
    case "ON-LINE":
      return <MAppScreen />;
    default:
      return <div className="" />;
  }
};
