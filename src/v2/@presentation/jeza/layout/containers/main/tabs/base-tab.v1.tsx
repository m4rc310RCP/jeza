import type { FC, HtmlHTMLAttributes } from "react";

interface MTabBaseProps {
  tab: TTab;
}

export const MTabBase: FC<HtmlHTMLAttributes<unknown> & MTabBaseProps> = (
  props,
) => {
  const { tab, ...rest } = props;


  return (
    <div {...rest} className="flex flex-col flex-1 ">
      {tab?.showHeader && (
        <>
          <div className="flex flex-col p-3 leading-none">
            <h1 className="text-xl font-bold leading-none ">{tab?.title}</h1>
            <h2 className="text-xs leading-none opacity-60">{tab?.subtitle}</h2>
          </div>
        </>
      )}
      <div className="flex flex-1 p-2">{rest.children}</div>
    </div>
  );
};
