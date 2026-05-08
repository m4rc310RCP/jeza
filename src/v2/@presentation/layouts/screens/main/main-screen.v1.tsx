import { type FC, type HtmlHTMLAttributes } from "react";
import { MSide } from "@jeza-v2/presentation/layouts";
import { GiRadarSweep } from "react-icons/gi";
import { useMMain } from "@jeza-v2/presentation/contexts";

export const MMainScreen: FC<HtmlHTMLAttributes<unknown>> = () => {
  const { nm_aplicativo, fn_login, fn_refreshToken } = useMMain();

  return (
    <div className="flex flex-1 flex-col gap-1=px">
      <div className="bg-amber-800 flex p-1 gap-1 items-center">
        <GiRadarSweep className="text-xl" />
        {nm_aplicativo}
        <button
          onClick={() => fn_login("03057532900", "Escol@1979")}
          className="bg-amber-600 py-0.5 px-3 rounded border border-amber-700"
        >
          Teste Login
        </button>

        <button
          onClick={() => fn_refreshToken()}
          className="bg-amber-600 py-0.5 px-3 rounded border border-amber-700"
        >
          Refresh
        </button>
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
