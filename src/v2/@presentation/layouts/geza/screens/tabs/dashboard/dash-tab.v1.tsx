import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";
import {
  MCardDashboardBalance,
  MTabLabel,
} from "@jeza-v2/presentation/layouts";
import type { FC, HtmlHTMLAttributes } from "react";

export const MTabDashboard: FC<HtmlHTMLAttributes<unknown>> = () => {
  // const activeTab = useLayoutStore(s => s.activeTab);
  // const user = useLayoutStore(s => s.user);
  return (
    <div className="flex flex-col flex-1 leading-none">
      <MTabLabel
        title={m.text_jeza_tab_title_dashboard}
        subtitle={m.text_jeza_tab_description_dashboard}
      />
      <div className="flex w-full p-5">
        <MCardDashboardBalance />
      </div>
    </div>
  );
};
