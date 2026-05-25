import { useState, type FC, type HtmlHTMLAttributes } from "react";

import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";
import { useMApp } from "@jeza-v2/presentation/contexts";
import { MdDeliveryDining } from "react-icons/md";
import { PiEyeSlashThin, PiEyeThin } from "react-icons/pi";

export const MCardDashboardBalance: FC<
	HtmlHTMLAttributes<HTMLDivElement>
> = () => {
	const balance = useLayoutStore(s => s.balance);
	const preferences = useLayoutStore(s => s.layoutPreferences);
	// const setPreferences = useLayoutStore(s => s.setLayoutPreferences);

	const [visible, setVisible] = useState(preferences.tabs.dashboard.showBalance);
	// useEffect(()=>{
	// 	preferences.tabs.dashboard.showBalance = visible;
	// 	setPreferences(preferences);
	// }, [visible]);
	

	const { openDeliveries } = useMApp();

	const saldo = Number(balance?.vl_saldo || 0).toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

	return (
		<section className="min-w-[50ch] rounded-lg border border-zinc-700 bg-zinc-900 p-5 shadow-lg">
			<header className="mb-4 flex items-center justify-between">
				<div className="flex w-full justify-between align-top ">
					<div className="">
						<h2 className="text-sm font-medium text-zinc-400">
							{m.text_jeza_tab_dashboard_balance_title}
						</h2>

						<p className="text-xs text-zinc-500">
							Carteira de entregas
						</p>
					</div>
					<button
						type="button"
						onClick={() => setVisible(v => !v)}
						className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
						aria-label={
							visible ? "Ocultar saldo" : "Mostrar saldo"
						}
					>
						{visible ? (
							<PiEyeThin size={22} />
						) : (
							<PiEyeSlashThin size={22} />
						)}
					</button>
				</div>
			</header>

			<div className="flex items-end justify-between gap-4">
				<strong className="text-3xl w-[10ch] font-semibold tracking-tight text-zinc-50">
					{visible ? saldo : "R$ •••••"}
				</strong>

				<button
					onClick={()=>openDeliveries()}
					className="flex rounded text-lg gap-3 bg-amber-600 px-3 items-center cursor-pointer">
						<MdDeliveryDining />
						<strong className="text-sm text-zinc-100">
							{String(balance?.qt_entregas || 0).padStart(3, "0")}
						</strong>
				</button>
			</div>
		</section>
	);
};