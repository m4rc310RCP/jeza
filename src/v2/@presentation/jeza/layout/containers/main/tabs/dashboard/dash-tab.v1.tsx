import { useMApp } from "@jeza-v2/presentation/jeza/contexts";
import { m, fmt } from "@jeza-v2/core/i18n/locale-i18n.v1";
import { useMemo, type FC, type HtmlHTMLAttributes } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoWalletOutline } from "react-icons/io5";
import { VscEye } from "react-icons/vsc";
import { HiOutlineEye } from "react-icons/hi";
import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";

interface MTabDashboardProps {}

export const MTabDashboard: FC<
  HtmlHTMLAttributes<unknown> & MTabDashboardProps
> = (props) => {
  const { ...rest } = props;

  const { userBalance } = useMApp();

  const setLayoutPropsAuth = useStoreV1((s) => s.setLayoutPropsAuth);
  const layoutPropsAuth = useStoreV1((s) => s.layoutPropsAuth);

  const user = useMemo(() => userBalance?.value, [userBalance]);
  const balance = useMemo(() => {
    return Number(user?.vl_saldo || 0).toLocaleString("pt-BR");
  }, [user]);
  const countMovement = useMemo(
    () => fmt("text_wallet_count_movement", user?.qt_entregas),
    [user],
  );
  const _showDashboardValue = useMemo(
    () => layoutPropsAuth?.showDashboardValue,
    [layoutPropsAuth],
  );

  return (
    <div {...rest} className={`flex-1`}>
      <MCard loading={userBalance?.loading}>
        <div className="bg-amber-50 h-full">
          <div className="flex gap-2">
            <IoWalletOutline className="size-7 text-amber-300" />
            <div className="flex flex-col leading-none mr-4">
              <h1 className="text-sm leading-none font-bold">
                {m.menu_dashboard_subtitle}
              </h1>
              <h2 className="text-xs leading-none opacity-55">
                {m.text_wallet_amount}
              </h2>
            </div>
            <button
              onClick={() => {
                setLayoutPropsAuth({
                  ...layoutPropsAuth!,
                  showDashboardValue: !_showDashboardValue,
                });
              }}
              className="ml-auto"
            >
              {_showDashboardValue ? (
                <VscEye className="size-5" />
              ) : (
                <HiOutlineEye className="size-5" />
              )}
            </button>
          </div>

          <div className="" />

          <div className="flex mt-2 justify-between">
            <div className="flex leading-none gap-1">
              <h1 className="leading-none text-sm opacity-60">R$</h1>
              <h1 className="text-2xl leading-none font-bold">
                {_showDashboardValue ? balance : "•••••"}
              </h1>
            </div>
            <div className="text-xs mt-auto">{countMovement}</div>
          </div>
        </div>
      </MCard>
    </div>
  );
};

const MCard: FC<HtmlHTMLAttributes<unknown> & { loading: boolean }> = (
  props,
) => {
  const { loading, ...rest } = props;
  return (
    <div
      className={`border w-full h-full border-zinc-500 p-3 rounded-sm bg-zinc-700`}
    >
      <div className="relative w-full h-full">
        {loading && (
          <div className="absolute inset-0 z-10 flex  backdrop-blur-xs ">
            <AiOutlineLoading3Quarters className="m-auto size-4  animate-spin-medium" />
          </div>
        )}
        <div {...rest} className={`overflow-hidden ${rest.className ?? ""}`} />
      </div>
    </div>
  );
};
