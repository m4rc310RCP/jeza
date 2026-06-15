import type { FC, HtmlHTMLAttributes } from "react";
import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";

export const MBottonSide: FC<HtmlHTMLAttributes<unknown>> = (props) => {
  const { ...rest } = props;

  return (
    <div {...rest} className="flex p-1 border-t w-full">
      <h1 className="pl-2 opacity-50 text-xs text-white">{m.text_copyright}</h1>
    </div>
  );
};
