import type { FC, HtmlHTMLAttributes } from "react";

interface MPopupMenuProps {
  openPopupMenu?: boolean;
}

export const MPopupMenu: FC<HtmlHTMLAttributes<unknown> & MPopupMenuProps> = (
  props,
) => {
  const { openPopupMenu = false, ...rest } = props;

  return (
    <div {...rest} className="relative inline-block">
      <div
        className={`
					absolute right-0 top-full mt-1
					min-w-40 bg-zinc-900
					shadow-lg
          overflow-hidden
					p-4
					leading-none
          z-50    
					transition-all duration-150
					${
            openPopupMenu
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }
				`}
      >
        {rest.children}
      </div>
    </div>
  );
};
