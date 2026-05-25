import {
  MLogoGeza,
  MSide,
  MUserMinicard,
  MTabsScreen,
} from "@jeza-v2/presentation/layouts";
import { type FC, type HtmlHTMLAttributes } from "react";
import { MTabContextProvider } from "@jeza-v2/presentation/contexts";
import { useMAuth } from "@jeza-v2/presentation/contexts";

export const MMainScreen: FC<HtmlHTMLAttributes<unknown>> = () => {
  const { ds_test } = useMAuth();

  return (
    <div className="flex flex-1 flex-col gap-1=px">
      <div className="bg-black flex p-1 gap-1 items-center">
        <div className="flex">
          <MLogoGeza isMini={true} />
        </div>

        <div className="ml-auto px-3">
          <MUserMinicard />
        </div>
      </div>
      <div className="flex flex-1">
        <MSide side="LEFT" className="h-full bg-[#19364A]">
          {ds_test}
        </MSide>
        <div className="flex-1">
          <MTabContextProvider>
            <MTabsScreen />
          </MTabContextProvider>
        </div>
        <MSide side="RIGHT" className=" h-full bg-[#19364A]">
          C
        </MSide>
      </div>
      <div className=""></div>
    </div>
  );
};
