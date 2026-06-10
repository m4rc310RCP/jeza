import { useMemo, type FC, type HTMLAttributes, type ReactNode } from "react";
import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";
import { MdOutlineDashboard } from "react-icons/md";
import { TfiLayoutSidebarNone } from "react-icons/tfi";
import { BsPiggyBank } from "react-icons/bs";

type TMenuId = "DASHBOARD" | "TEST" | "TRANSACTIONS";

interface IMenu {
  id: TMenuId;
  title: string;
  disabled?: boolean;
  icon?: ReactNode;
}

const menu: IMenu[] = [
  {
    id: "DASHBOARD",
    title: m.menu_dashboard,
  },
  {
    id: "TRANSACTIONS",
    title: m.menu_transactions,
  },
];

interface MPrincipalMenuProps {
  mini: boolean;
}

export const MPrincipalMenu: FC<
  HTMLAttributes<HTMLDivElement> & MPrincipalMenuProps
> = ({ mini, ...rest }) => {
  return (
    <div {...rest}>
      {menu.map((item) => (
        <MMenuItem
          key={item.id}
          id={item.id}
          mini={mini}
          title={item.title}
          disabled={item.disabled}
        />
      ))}
    </div>
  );
};

interface MMenuItemProps {
  id: TMenuId;
  mini: boolean;
  title: string;
  disabled?: boolean;
  // icon?: ReactNode;
}

const MMenuItem: FC<MMenuItemProps> = ({ id, title, mini, disabled }) => {
  const icon: ReactNode = useMemo(() => {
    switch (id) {
      case "DASHBOARD":
        return <MdOutlineDashboard />;
      case "TRANSACTIONS":
        return <BsPiggyBank />;
      default:
        return <TfiLayoutSidebarNone />;
    }
  }, [id]);

  return (
    <button
      disabled={disabled}
      className="
        flex
        items-center
        gap-2
        px-3
        py-2
        w-full
				cursor-pointer
				rounded-md
				hover:bg-zinc-600
				justify-between
      "
    >
      {icon ?? <TfiLayoutSidebarNone />}

      {!mini && <span className="w-full text-left text-xs">{title}</span>}

      <div className="hidden">-</div>
    </button>
  );
};
