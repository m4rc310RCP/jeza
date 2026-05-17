import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { FaRegUserCircle } from "react-icons/fa";
import { AiFillCloseSquare } from "react-icons/ai";

import type { FC, HtmlHTMLAttributes } from "react";
import { useMAuth } from "@jeza-v2/presentation/contexts";

export const MUserMinicard: FC<HtmlHTMLAttributes<unknown>> = (props) => {
  const user = useLayoutStore((s) => s.user);
  const { fn_logout } = useMAuth();

  return (
    <div className={`flex items-center text-lg gap-2 ${props.className ?? ""}`}>
      <FaRegUserCircle />
      <h1 className="text-xs">{user?.nm_cliente}</h1>
      <button onClick={() => fn_logout()}>
        <AiFillCloseSquare className="text-orange-300" />
      </button>
    </div>
  );
};
