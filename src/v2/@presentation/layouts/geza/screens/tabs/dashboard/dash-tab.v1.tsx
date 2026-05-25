import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";
import { MCardDashboardBalance } from "@jeza-v2/presentation/layouts";
import type { FC, HtmlHTMLAttributes } from "react";

export const MTabDashboard: FC<HtmlHTMLAttributes<unknown>> = () => {
	// const activeTab = useLayoutStore(s => s.activeTab);
	// const user = useLayoutStore(s => s.user);
	return (
		<div className="flex flex-col flex-1 leading-none">
			<div className="flex w-full p-4">
				<div className="flex flex-col leading-none">
					<span className="font-bold text-xl leading-none">{m.text_jeza_tab_title_dashboard}</span>
					<span className="text-xs text-zinc-400">{m.text_jeza_tab_description_dashboard}</span>
				</div>
			</div>
			<div className="flex w-full p-5">
				<MCardDashboardBalance />
			</div>
		</div>
	);
};
