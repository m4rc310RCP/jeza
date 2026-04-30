import { useEffect, useState, type FC, type HtmlHTMLAttributes } from "react";
import { useMain } from "@presentation/contexts/hooks/general.v1";
import { Icon } from "@presentation/components/icons/icon-component.v1";
import { useStoreLocal } from "@core/storage/zustand/zustand-storage.v1";
import { MenuPrincipal } from "@presentation/components";
import { m } from "@presentation/i18n/locale-i18n.v1";
import { test } from "@data/startup.v1.json";

export const MainContainer: FC<HtmlHTMLAttributes<unknown>> = (props) => {
  const { ...rest } = props;
  const { title } = useMain();
  const [dataTest, setDataTest] = useState<string>("");
  const content = useStoreLocal((e) => e.content);

  useEffect(() => {
    window.document.title = title ?? m.app_default_title;
  }, [title]);

  const date = useStoreLocal((e) => e.dateTest);

  return (
    <div {...rest}>
      <MenuPrincipal className="fixed bg-amber-600 flex w-full" />
      <div className="flex flex-col p-5 border border-amber-300">
        <h2 className="">{date?.toISOString()}</h2>
        <button
          onClick={() => useStoreLocal.getState().setDateTest(new Date())}
          className="h-5 bg-amber-700 px-4"
        >
          OK
        </button>
        <button
          onClick={() => setDataTest(JSON.stringify(test))}
          className="h-5 bg-amber-700 px-4"
        >
          Test File
        </button>
        <div className="">{JSON.stringify(content)}</div>
        <div className="bg-gray-400">{dataTest}</div>
      </div>

      <div className="flex my-auto p-0.5 w-[30ch] h-[30ch] rounded-2xl bg-gradient-to-bl from-blue-500 via-purple-500 to-red-500 ">
        <div className="flex  p-4 rounded-2xl aspect-square items-center bg-primary">
          <Icon id="VELOX_LOGO" className="w-[70%] mx-auto" />
        </div>
      </div>
    </div>
  );
};
