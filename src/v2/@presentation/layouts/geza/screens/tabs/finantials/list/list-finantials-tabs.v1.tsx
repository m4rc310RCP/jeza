import { type FC, type HtmlHTMLAttributes } from "react";
import { MTabLabel } from "@jeza-v2/presentation/layouts";
import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";

export const MTabFinantialsList: FC<
  HtmlHTMLAttributes<unknown>
> = (props) => {
  const { ...rest } = props;
  return (
    <div {...rest}>
      <div className="flex flex-1 flex-col">
        <MTabLabel
          title={m.text_jeza_tab_balance_movto_list_title}
          subtitle={m.text_jeza_tab_balance_movto_list_subtitle}
        />
        <div className="p-5">----</div>
      </div>
    </div>
  );
};
