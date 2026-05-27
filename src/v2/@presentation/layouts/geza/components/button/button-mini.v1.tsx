import type { FC, HtmlHTMLAttributes } from "react";

interface IMButtonMiniParams {
  tooltip?: string;
}

export const MButtonMini: FC<
  HtmlHTMLAttributes<unknown> & IMButtonMiniParams
> = (props) => {
  const { tooltip, ...rest } = props;

  return (
    <div className="group relative">
      <button {...rest} className={`${rest.className ?? ""}`} />
      {tooltip && (
        <span
          className="
					pointer-events-none
					absolute
					-top-10
					left-1/2
					-translate-x-1/2
					rounded
					bg-zinc-900
					px-2
					py-1
					text-xs
					text-white
					opacity-0
					transition-opacity
					group-hover:opacity-100
				"
        >
          {tooltip}
        </span>
      )}
    </div>
  );
};
