import type { FC, HtmlHTMLAttributes } from "react";

export const MMainContainer: FC<HtmlHTMLAttributes<unknown>> = (props) => {
  const { ...rest } = props;

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
