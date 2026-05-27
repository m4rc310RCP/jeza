import { useState, type FC, type HtmlHTMLAttributes } from "react";

import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";
import { useMApp } from "@jeza-v2/presentation/contexts";
import { MButtonMini, MDefaultCard } from "@jeza-v2/presentation/layouts";
import { MdDeliveryDining } from "react-icons/md";
import { PiEyeSlashThin, PiEyeThin } from "react-icons/pi";
import { GiWallet } from "react-icons/gi";
import { LucideClipboardList } from "lucide-react";
import { CgAdd } from "react-icons/cg";

export const MCardDashboardBalance: FC<
  HtmlHTMLAttributes<HTMLDivElement>
> = () => {
  const { balanceUser, openDeliveries } = useMApp();
  const preferences = useLayoutStore((s) => s.layoutPreferences);

  const [visible, setVisible] = useState(
    preferences.tabs.dashboard.showBalance,
  );

  const getCurrency = (value?: number) => {
    return Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <MDefaultCard
      className="flex min-w-[30ch] p-5 bg-zinc-800"
      loading={!balanceUser || balanceUser.loading}
    >
      <section className="flex flex-col ">
        <header className="">
          <div className="flex leading-none items-center gap-2 ">
            <GiWallet className="size-6 text-amber-400" />
            <div className="flex flex-col">
              <h2 className="text-sm font-medium text-zinc-400 leading-none ">
                {m.text_jeza_tab_dashboard_balance_title}
              </h2>
              <p className="text-xs text-zinc-500 leading-none ">
                {m.text_jeza_tab_dashboard_balance_subtitle}
              </p>
            </div>
            <button
              onClick={() => setVisible((ant) => !ant)}
              className="text-xl hover:bg-zinc-700 ml-5 p-1 rounded cursor-pointer "
            >
              {visible ? <PiEyeThin /> : <PiEyeSlashThin />}
            </button>
          </div>
        </header>
        <div className="flex items-end justify-between gap-4">
          <strong className="text-3xl w-[10ch] font-semibold tracking-tight text-zinc-50">
            {visible ? getCurrency(balanceUser?.value?.vl_saldo) : "R$ •••••"}
          </strong>

          <div className="flex items-center gap-1.5">
            <MButtonMini
              title={m.text_jeza_tab_dashboard_balance_add}
              className="cursor-pointer shadow opacity-80 hover:opacity-100"
            >
              <CgAdd className="size-4" />
            </MButtonMini>
            <MButtonMini
              onClick={() => openDeliveries()}
              className="cursor-pointer shadow opacity-80 hover:opacity-100"
            >
              <LucideClipboardList className="size-4" />
            </MButtonMini>
          </div>
        </div>
      </section>
    </MDefaultCard>
  );

  // if (!balanceUser || balanceUser.loading){
  // 	return (
  // 		<div className="min-w-[50ch]">LOADING...</div>
  // 	)
  // }

  // return (
  // 	<div className="">BALANCE</div>
  // )
};

export const MCardDashboardBalance_: FC<
  HtmlHTMLAttributes<HTMLDivElement>
> = () => {
  const balance = useLayoutStore((s) => s.balance);
  const preferences = useLayoutStore((s) => s.layoutPreferences);
  // const setPreferences = useLayoutStore(s => s.setLayoutPreferences);

  const [visible, setVisible] = useState(
    preferences.tabs.dashboard.showBalance,
  );
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
              {m.text_jeza_tab_dashboard_balance_subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
            aria-label={visible ? "Ocultar saldo" : "Mostrar saldo"}
          >
            {visible ? <PiEyeThin size={22} /> : <PiEyeSlashThin size={22} />}
          </button>
        </div>
      </header>

      <div className="flex items-end justify-between gap-4">
        <strong className="text-3xl w-[10ch] font-semibold tracking-tight text-zinc-50">
          {visible ? saldo : "R$ •••••"}
        </strong>

        <button
          onClick={() => openDeliveries()}
          className="flex rounded text-lg gap-3 bg-amber-600 px-3 items-center cursor-pointer"
        >
          <MdDeliveryDining />
          <strong className="text-sm text-zinc-100">
            {String(balance?.qt_entregas || 0).padStart(3, "0")}
          </strong>
        </button>
      </div>
    </section>
  );
};
