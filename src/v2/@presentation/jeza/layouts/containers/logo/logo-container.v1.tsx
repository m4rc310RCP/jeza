import type { FC, HtmlHTMLAttributes } from "react";
import { GiRadarSweep } from "react-icons/gi";
import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";

export const MLogoGeza: FC<
  HtmlHTMLAttributes<unknown> & {
    isMini?: boolean;
  }
> = (props) => {
  const { isMini = false, ...rest } = props;

  if (isMini) {
    return (
      <div className={`flex gap-2 ${rest.className ?? ""}`}>
        <GiRadarSweep className="text-xl" />
        <h1 className="text-lg text-blue-400  leading-none font-bold">
          {m.text_appname}
        </h1>
      </div>
    );
  }

  return (
    <div className={`flex flex-row items-center gap-2 ${rest.className ?? ""}`}>
      <GiRadarSweep className="text-3xl" />
      <div className="flex flex-col">
        <h1 className="text-xl text-blue-400  leading-none font-bold">
          {m.text_appname}
        </h1>
        <h1 className="text-xs text-zinc-500  leading-none">
          {m.text_geza_slogan}
        </h1>
      </div>
    </div>
  );
};
