import { maskDocument } from "@jeza-v2/core/utils/documents.v1";
import { useMApp } from "@jeza-v2/presentation/jeza";
import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";
import { useMemo, useRef, type FC, type HtmlHTMLAttributes } from "react";
import { UserCircle2Icon } from "lucide-react";
import { LuDoorClosed } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";
import { GiRadarSweep } from "react-icons/gi";

export const MTopSide: FC<HtmlHTMLAttributes<unknown>> = (props) => {
  const { ...rest } = props;
  const { userAuth, handleLogout } = useMApp();
  const refMenu = useRef<HTMLDivElement>(null);

  const maskDoc = useMemo(
    () => maskDocument(userAuth?.value?.nr_cpfcnpj ?? ""),
    [userAuth],
  );

  return (
    <div
      {...rest}
      className={`w-full text-sm bg-black px-2 py-1.5 text-white text-center leading-none flex justify-between`}
    >
      <div className="flex leading-none items-end gap-2">
        <GiRadarSweep className="size-4" />
        <h1 className="text-sm leading-none text-logo">{m.text_appname}</h1>
        <h1 className="leading-none text-xs bg-linear-to-r from-green-600 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
          {m.text_geza_slogan}
        </h1>
      </div>
      <div className="flex">
        {/* Menu Signout */}
        <div ref={refMenu} className="flex">
          <div className="relative inline-block group mr-1 items-center my-auto">
            <div className="flex gap-2">
              <h1 className="text-xs text-tv-yellow">{maskDoc}</h1>
              <FaRegEdit className="size-4" />
            </div>

            <div
              className="
							z-50
							absolute top-full right-1 mt-1  bg-zinc-900 
							border border-zinc-500 rounded 
							opacity-0 invisible
							transition-all duration-200
							group-hover:opacity-100 group-hover:visible
						"
            >
              <div className="flex flex-col w-64 gap-2 leading-none ">
                <div className="flex gap-2 p-2">
                  <UserCircle2Icon className="size-6 text-amber-200" />
                  <div className="flex flex-col ">
                    <h1 className="leading-none">
                      {userAuth?.value?.nm_cliente}
                    </h1>
                    <h2 className="text-xs text-blue-400 leading-none mr-auto">
                      {userAuth?.value?.ds_email}
                    </h2>
                  </div>
                </div>
                <div className="h-px w-full bg-zinc-600" />
                <div className="flex p-2">
                  <button
                    onClick={() => handleLogout()}
                    className="flex items-center w-full px-1 py-1.5 gap-3 rounded hover:bg-zinc-700 cursor-pointer"
                  >
                    <LuDoorClosed className="size-4" />
                    <span className="">{m.text_close}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
