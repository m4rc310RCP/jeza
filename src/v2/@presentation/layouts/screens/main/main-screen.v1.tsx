import { MLogoGeza, MSide, MUserMinicard } from "@jeza-v2/presentation/layouts";
import { type FC, type HtmlHTMLAttributes } from "react";

export const MMainScreen: FC<HtmlHTMLAttributes<unknown>> = () => {
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
        <MSide side="LEFT" className=" h-full">
          A
        </MSide>
        <div className="flex-1">B</div>
        <MSide side="RIGHT" className=" h-full">
          C
        </MSide>
      </div>
      <div className=""></div>
    </div>
  );
};
