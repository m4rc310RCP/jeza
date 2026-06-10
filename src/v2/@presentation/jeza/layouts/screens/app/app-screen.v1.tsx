import {
  useMemo,
  useRef,
  type FC,
  type HTMLAttributes,
  type HtmlHTMLAttributes,
} from "react";
import {
  useMAuth,
  MTabContextProvider,
} from "@jeza-v2/presentation/jeza/contexts";
import {
  MLogoGeza,
  MPrincipalMenu,
  MTabsScreen,
} from "@jeza-v2/presentation/jeza/layouts";
import { maskDocument } from "@jeza-v2/core/utils/documents.v1";
import { UserCircle2Icon } from "lucide-react";
import { LuDoorClosed } from "react-icons/lu";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";

export const MAppScreen: FC<HtmlHTMLAttributes<unknown>> = (props) => {
  const { ...rest } = props;
  // const [mini, setMini] = useState<boolean>(false);
  const layoutPropsAuth = useStoreV1((s) => s.layoutPropsAuth);
  const setLayoutPropsAuth = useStoreV1((s) => s.setLayoutPropsAuth);
  const { signout } = useMAuth();

  const mini: boolean = useMemo(() => {
    return layoutPropsAuth?.isMenuPrincipalMini ?? false;
  }, [layoutPropsAuth]);

  return (
    <div {...rest} className="w-full">
      <MTopApp />
      <div className="flex w-full h-full">
        <MPrincipalMenu
          className="p-2 transition-all duration-300"
          mini={mini}
        />
        <MDiv
          setMini={() => {
            setLayoutPropsAuth({
              ...layoutPropsAuth!,
              isMenuPrincipalMini: !mini,
            });
          }}
          mini={mini}
        />
        <MTabContextProvider>
          <MTabsScreen />
        </MTabContextProvider>
      </div>
    </div>
  );
};

// --------------------------------
interface MDivProps extends HTMLAttributes<HTMLDivElement> {
  mini: boolean;
  setMini: (mini: boolean) => void;
}

export const MDiv: FC<MDivProps> = ({ mini, setMini, ...props }) => {
  return (
    <div
      {...props}
      onClick={() => setMini(!mini)}
      className="relative flex h-full w-px bg-zinc-900"
    >
      <button
        className="
          absolute
          top-2
          left-1/2
					mt-2
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-zinc-900
          text-zinc-400
          hover:text-white
          transition-colors
        "
      >
        {mini ? <FaChevronCircleRight /> : <FaChevronCircleLeft />}
      </button>
    </div>
  );
};
// --------------------------------
const MTopApp: FC<HtmlHTMLAttributes<unknown>> = () => {
  const { user, signout } = useMAuth();
  // const [openMenu, setOpenMenu] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleClick = (e: MouseEvent) => {
  //     if (!ref.current?.contains(e.target as Node)) {
  //       setOpenMenu(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClick);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClick);
  //   };
  // }, []);

  const maskDoc = useMemo(
    () => maskDocument(user?.value?.nr_cpfcnpj ?? ""),
    [user],
  );

  return (
    <div className="flex p-1 bg-black w-full items-center justify-between">
      <div className="flex gap-3 items-end">
        <MLogoGeza isMini={true} />
        <span className="text-xs opacity-40">{m.text_geza_slogan}</span>
      </div>
      <div ref={ref} className="flex">
        <div className="relative inline-block group rounded-full bg-zinc-500 mr-1">
          <div className="flex items-center mx-1 my-1  group cursor-pointer">
            <UserCircle2Icon className="size-4 text-amber-200" />
            <h1 className="leading-none text-xs mx-2">{maskDoc}</h1>
          </div>
          <div
            className="
						absolute top-full right-1 mt-1  bg-zinc-900 border border-zinc-500 rounded
						opacity-0 invisible
						p-2 
						transition-all duration-200
						group-hover:opacity-100
						group-hover:visible"
          >
            <div className="flex flex-col w-64 gap-2 ">
              <div className="flex items-center leading-none gap-2">
                <UserCircle2Icon className="size-6 text-amber-200" />
                <div className="leading-none">
                  <h1 className="text-sm leading-none font-bold">
                    {user?.value?.nm_cliente}
                  </h1>
                  <h2 className="leading-none text-xs">
                    {user?.value?.ds_email}
                  </h2>
                </div>
              </div>
              <hr />
              <div className="flex">
                <button
                  onClick={() => signout()}
                  className="flex items-center w-full px-3 py-0.5 gap-3 rounded hover:bg-zinc-700 cursor-pointer"
                >
                  <LuDoorClosed className="size-4" />
                  <span className="">Sair</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <MPopupMenu openPopupMenu={openMenu}>
          <div className="">-------</div>
        </MPopupMenu> */}
      </div>
    </div>
  );
};
