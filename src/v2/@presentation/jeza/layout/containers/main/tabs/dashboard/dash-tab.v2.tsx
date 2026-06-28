import { useMemo, type FC, type HtmlHTMLAttributes } from "react";
import { useMApp } from "@jeza-v2/presentation/jeza/contexts";
import { MCardWeather } from "@jeza-v2/presentation/jeza";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoWalletOutline } from "react-icons/io5";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { MdDeliveryDining } from "react-icons/md";
import { m, fmt } from "@jeza-v2/core/i18n/locale-i18n.v1";
import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";

export const MTabDashboard: FC<HtmlHTMLAttributes<unknown>> = (props) => {
  const { ...rest } = props;

  const { userBalance, currentWeather } = useMApp();
  const layoutPropsAuth = useStoreV1((s) => s.layoutPropsAuth);
  const setLayoutPropsAuth = useStoreV1((s) => s.setLayoutPropsAuth);

  const user = useMemo(() => userBalance?.value, [userBalance]);

  const balanceValue = useMemo(() => {
    return Number(user?.vl_saldo || 0).toLocaleString("pt-BR");
  }, [user]);

  const _sdv = useMemo(
    () => layoutPropsAuth?.showDashboardValue,
    [layoutPropsAuth],
  );

  const showBalanceValue = () => {
    if (layoutPropsAuth) {
      setLayoutPropsAuth({
        ...layoutPropsAuth,
        showDashboardValue: !_sdv,
      });
    }
  };

  return (
    <div {...rest} className="flex-1 h-full ">
      <div className="flex-1 h-full gap-2">
        {/* CARD's */}
        <div className="">
          <div className="grid grid-cols-5 gap-2 w-full h-full">
            <MCard loading={userBalance?.loading}>
              <div className="flex flex-col w-full h-full p-2">
                <div className="flex items-center gap-2">
                  <IoWalletOutline className="size-7 text-amber-300" />
                  <div className="flex flex-col leading-none mr-auto">
                    <h1 className="leading-none text-lg font-bold">
                      {m.text_wallet_amount}
                    </h1>
                    <h1 className="leading-none text-xs opacity-50">
                      {m.text_user_amount}
                    </h1>
                  </div>
                  <button
                    onClick={() => showBalanceValue()}
                    className="cursor-pointer"
                  >
                    {_sdv ? <VscEye /> : <VscEyeClosed />}
                  </button>
                </div>
                <div className="flex-1 min-h-10" />
                <div className="flex justify-between">
                  <div className="flex leading-none gap-1">
                    <h1 className="text-xs leading-none opacity-55">R$</h1>
                    <h1 className="text-2xl font-bold leading-none">
                      {_sdv ? balanceValue : "•••••"}
                    </h1>
                  </div>
                  <h1 className="text-xs mt-auto">
                    {fmt("text_wallet_count_movement", user?.qt_entregas)}
                  </h1>
                </div>
              </div>
            </MCard>

            <MCard loading={currentWeather?.loading}>
              <MCardWeather weather={currentWeather?.value!} />
            </MCard>

            <MCard loading={false}>
              <div className="flex w-full gap-2 p-2">
                <MdDeliveryDining className="size-8 text-tv-green" />
                <div className="flex flex-col w-full gap-1">
                  <h1 className="leading-none">{m.text_deliveries}</h1>
                  <div className="relative">
                    <div className="absolute inset-0 z-10 w-full h-1.5 rounded-full bg-zinc-100 opacity-35" />
                    <div className="absolute inset-0 z-10 w-[30%] h-1.5 rounded-full bg-yellow-400" />
                  </div>
                </div>
              </div>
            </MCard>
						{/* ------ */}
          </div>
        </div>

        <div className="flex h-auto"></div>
      </div>
    </div>
  );
};

const MCard: FC<HtmlHTMLAttributes<unknown> & { loading: boolean }> = (
  props,
) => {
  const { loading, ...rest } = props;
  return (
    <div
      className={`border overflow-hidden w-full h-full border-zinc-500 rounded-sm bg-zinc-700`}
    >
      <div className="relative w-full h-full">
        {loading && (
          <div className="absolute inset-0 z-10 flex  backdrop-blur-xs ">
            <AiOutlineLoading3Quarters className="m-auto size-4  animate-spin-medium" />
          </div>
        )}
        <div {...rest} className={`overflow-hidden flex h-full w-full`} />
      </div>
    </div>
  );
};
