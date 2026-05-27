import type { FC, HtmlHTMLAttributes } from "react";
import {
  MSplasScreenStartup,
  MContainerSignin,
  MMainScreen,
} from "@jeza-v2/presentation/layouts";
import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
export const MSwithScreen: FC<HtmlHTMLAttributes<unknown>> = () => {
  const screen = useLayoutStore((s) => s.screen);
  // const { st_screen } = useMAuth();
  return (
    <div className="flex flex-1  ">
      {screen === "startup" && <MSplasScreenStartup />}
      {screen === "home" && <MMainScreen />}
      {screen === "signin" && <MContainerSignin />}
    </div>
  );
};
