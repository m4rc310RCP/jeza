import { type FC, type HtmlHTMLAttributes } from "react";
import { MLogoGeza } from "@jeza-v2/presentation/layouts";
import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const MSplasScreenStartup: FC<HtmlHTMLAttributes<unknown>> = (props) => {
  const { ...rest } = props;

  const startup = useLayoutStore((s) => s?.screenData?.startup);

  return (
    <div
      {...rest}
      className={` flex flex-col
        m-auto
        p-6
        min-w-96
        gap-2
        rounded-2xl
        bg-black
				items-center
        border border-zinc-800
        shadow-2xl`}
    >
      <MLogoGeza />
      <div className="flex p-10 gap-2">
        <AiOutlineLoading3Quarters className="animate-spin" />
        <h1 className="">{startup?.message}</h1>
      </div>
    </div>
  );
};
