import {
  useEffect,
  useMemo,
  useState,
  type FC,
  type HtmlHTMLAttributes,
} from "react";
import { useMApp } from "@jeza-v2/presentation/jeza/contexts/hooks/app-hook.v1";
import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";
import {
  formatDocument,
  isCPF,
  isValidDocument,
  sanitizeDocument,
} from "@jeza-v2/core/utils/documents.v1";
import { createUpdateValue } from "@jeza-v2/core/utils/general.v1";
import { Building2, Eye, EyeOff, UserRound } from "lucide-react";
import { IoKeyOutline } from "react-icons/io5";
import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";

interface IAuth {
  document: string;
  password: string;
  showPassword: boolean;
  saveDocument: boolean;
}

export const MAuthContainer: FC<HtmlHTMLAttributes<unknown>> = (props) => {
  const { ...rest } = props;
  const { handleLogin, userAuth } = useMApp();
  const { lastDocument, setLastDocument, layoutPropsAuth, setLayoutPropsAuth } =
    useStoreV1();

  const [auth, setAuth] = useState<IAuth>({
    document: lastDocument ?? "",
    password: "",
    showPassword: false,
    saveDocument: layoutPropsAuth?.isSaveLastDocument ?? false,
  } as IAuth);
  const update = useMemo(() => createUpdateValue(setAuth), []);

  //Prepare Document`s
  const cleaned = useMemo(() => sanitizeDocument(auth?.document ?? ""), [auth]);
  const valid = useMemo(() => isValidDocument(cleaned), [cleaned]);
  const formatted = useMemo(() => formatDocument(cleaned), [cleaned]);
  const docIsCpf = useMemo(() => isCPF(cleaned), [cleaned]);
  const password = useMemo(() => auth.password, [auth]);
  const passIsValid = useMemo(() => auth.password !== "", [password]);

  useEffect(() => {
    try {
      if (layoutPropsAuth) {
        setLayoutPropsAuth({
          ...layoutPropsAuth,
          isSaveLastDocument: auth.saveDocument,
        });
      }
    } catch (_) {}
  }, [auth]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin(cleaned, password);
    if (layoutPropsAuth?.isSaveLastDocument) {
      setLastDocument(cleaned);
    } else {
      setLastDocument(null);
    }
  };
  // --~>
  const documentStyles =
    cleaned.length === 0
      ? `
        border-zinc-800
        focus:border-orange-500
        focus:ring-orange-500/20
      `
      : valid
        ? `
          border-emerald-500
          focus:border-emerald-500
          focus:ring-emerald-500/20
        `
        : `
          border-red-500
          focus:border-red-500
          focus:ring-red-500/20
        `;

  const passStyles =
    password?.length === 0
      ? `border-zinc-800 focus:border-orange-500 focus:ring-orange-500/20`
      : passIsValid
        ? `border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20`
        : `border-red-500 focus:border-red-500 focus:ring-red-500/20`;
  // --~>

  return (
    <div
      {...rest}
      className={`m-auto flex flex-col bg-black p-5 rounded-2xl text-zinc-200`}
    >
      <div className="mx-auto p-3">{m.text_appname}</div>
      <form
        action=""
        className="flex flex-col text-xl gap-2"
        onSubmit={handleSubmit}
      >
        <div className="w-[30ch] " />
        <div className="w-full relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            {docIsCpf ? (
              <UserRound className="size-4" />
            ) : (
              <Building2 className="size-4" />
            )}
          </div>
          <input
            type="text"
            onChange={(e) => update("document", e.target.value)}
            value={formatted}
            className={`
							h-full w-full pl-7 py-1.5 bg-zinc-900
							border outline-none rounded
							transition-all
							text-sm tracking-wide
							focus:ring-4
							disabled:opacity-50 disabled:cursor-not-allowed
							${documentStyles ?? ""}`}
            autoComplete="username"
            placeholder="000.000.000-00"
          />
        </div>
        <div className="relative">
          <IoKeyOutline className="absolute left-2 top-1/2 -translate-y-1/2 size-4" />
          <input
            type={auth?.showPassword ? "password" : "text"}
            onChange={(e) => update("password", e.target.value)}
            className={`
							h-full w-full pl-7 py-1.5 bg-zinc-900
							border outline-none rounded
							transition-all
							text-sm tracking-wide
							focus:ring-1
							disabled:opacity-50 disabled:cursor-not-allowed
							${passStyles ?? ""}
						`}
          />
          <button
            type="button"
            onClick={() => update("showPassword", !auth?.showPassword)}
            className="absolute top-1/2 -translate-y-1/2 right-2"
          >
            {auth?.showPassword ? (
              <Eye className="size-4" />
            ) : (
              <EyeOff className="size-4" />
            )}
          </button>
        </div>
        <div className={`w-full `}>
          <label htmlFor="" className="text-xs flex gap-2">
            <input
              type="checkbox"
              className=""
              checked={auth?.saveDocument}
              onChange={(e) => update("saveDocument", e.target.checked)}
              value={"OK"}
            />
            {m.text_save_document}
          </label>
        </div>

        <div className="min-h-10 max-w-[30ch] flex items-center">
          {userAuth?.loading ? (
            <h1 className="text-zinc-400 text-xs mx-auto">Carregando...</h1>
          ) : (
            <h1 className="text-red-400 text-xs  mx-auto text-center">
              {userAuth?.error && !userAuth?.loading && userAuth.error}
            </h1>
          )}
        </div>

        <div className={`w-full`}>
          <button className="w-full bg-amber-700 py-1.5 text-sm rounded">
            {m.text_signin}
          </button>
        </div>
      </form>
    </div>
  );
};
