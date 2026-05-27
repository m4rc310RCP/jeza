import type { FC, HtmlHTMLAttributes } from "react";

interface MTabLabelProps {
  title: string;
  subtitle: string;
}

export const MTabLabel: FC<HtmlHTMLAttributes<unknown> & MTabLabelProps> = (
  props,
) => {
  const { title, subtitle, ...rest } = props;

  return (
    <div {...rest}>
      <div className="flex w-full p-4">
        <div className="flex flex-col leading-none">
          <span className="font-bold text-xl leading-none">{title}</span>
          <span className="text-xs text-zinc-400">{subtitle}</span>
        </div>
      </div>
    </div>
  );
};
