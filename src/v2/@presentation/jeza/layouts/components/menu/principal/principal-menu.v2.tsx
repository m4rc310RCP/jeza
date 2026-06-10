import { type FC, type HTMLAttributes } from "react";
import { useMApp } from "@jeza-v2/presentation/jeza/contexts";

interface MPrincipalMenuProps {
  mini: boolean;
}

export const MPrincipalMenu: FC<
  HTMLAttributes<HTMLDivElement> & MPrincipalMenuProps
> = ({ mini }) => {
  const { menu, getMenuItemIcon, selectItem } = useMApp();

  return (
    <div className="flex flex-col py-2 mr-3 pl-2">
      {menu?.itens?.map((item, i) => (
        <button
          onClick={() => selectItem(item.id)}
          key={i}
          className="flex items-center leading-none py-2 rounded cursor-pointer hover:bg-zinc-600 justify-between"
        >
          <div className={`px-2 py-0.5 ${item?.selected && "text-blue-300"} `}>
            {getMenuItemIcon(item.id)}
          </div>
          <span
            className={`${mini && "transition-all duration-300 hidden"} pr-2 mr-auto text-xs  ${item?.selected && "text-blue-300"}`}
          >
            {item.title}
          </span>
          <div className=""></div>
        </button>
      ))}

      {/* {menu.map((item) => (
        <MMenuItem
          key={item.id}
          id={item.id}
          mini={mini}
          title={item.title}
					disabled={item.disabled}
        />
      ))} */}
    </div>
  );
};

// interface MMenuItemProps {
//   id: TMenuId;
//   mini: boolean;
//   title: string;
// 	disabled?: boolean;
//   // icon?: ReactNode;
// }

// const MMenuItem: FC<MMenuItemProps> = ({
// 	id,
//   title,
//   mini,
// 	disabled
// }) => {

// 	const icon : ReactNode = useMemo(()=>{
// 		switch (id) {
// 			case 'DASHBOARD':
// 				return <MdOutlineDashboard />
// 			case 'TRANSACTIONS':
// 				return <BsPiggyBank />
// 			default:
// 				return <TfiLayoutSidebarNone />
// 		}
// 	}, [id])

//   return (
//     <button
// 			disabled={disabled}
//       className="
//         flex
//         items-center
//         gap-2
//         px-3
//         py-2
//         w-full
// 				cursor-pointer
// 				rounded-md
// 				hover:bg-zinc-600
// 				justify-between
//       "
//     >
//       {icon ?? <TfiLayoutSidebarNone />}

//       {!mini && (
//         <span className="w-full text-left text-xs">{title}</span>
//       )}

// 			<div className="hidden">-</div>
//     </button>
//   );
// };
