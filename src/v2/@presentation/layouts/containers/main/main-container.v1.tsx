import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { useEffect, type FC, type HtmlHTMLAttributes } from "react";

export const MMainContainer: FC<HtmlHTMLAttributes<unknown>> = (props) => {
  const { ...rest } = props;

  const app = useLayoutStore((s) => s?.screenData?.app);
  useEffect(() => {
    if (!app) return;
    document.title = app.title;
  }, [app]);

  return (
    <div
      {...rest}
      className="
				flex
				min-w-screen min-h-screen overflow-hidden
				text-white leading-none 
				select-none text-sm
				bg-[#1F1F1F]"
    />
  );
};
