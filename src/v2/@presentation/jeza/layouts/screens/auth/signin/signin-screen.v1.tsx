import { useMemo, useState, type FC, type HtmlHTMLAttributes } from "react";
import { useMAuth } from "@jeza-v2/presentation/jeza/contexts";
import { MAwaitContainer, MLogoGeza } from "@jeza-v2/presentation/jeza";
import {
  formatDocument,
  isCPF,
  isValidDocument,
  sanitizeDocument,
} from "@jeza-v2/core/utils/documents.v1";
import { Building2, Eye, EyeOff, UserRound } from "lucide-react";
import { useStoreV1 } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { createUpdateValue } from "@jeza-v2/core/utils/general.v1";
import { IoKeyOutline } from "react-icons/io5";

export const MSignInScreen: FC<HtmlHTMLAttributes<unknown>> = (props) => {
  const { signin, user } = useMAuth();
  const lastNumberDocument = useStoreV1((s) => s.lastDocument);
  // const setLastDocument = useStoreV1((s) => s.setLastDocument);
  const setLayoutPropsAuth = useStoreV1((s) => s.setLayoutPropsAuth);
  const layoutPropsAuth = useStoreV1((s) => s.layoutPropsAuth);

  const [auth, setAuth] = useState<IUserAuth>({
    nr_cpfcnpj: lastNumberDocument,
    in_versenha: false,
    vl_senha: "",
    in_gravar: false,
  } as IUserAuth);
  const update = useMemo(() => createUpdateValue(setAuth), []);
  // ----------------------------------------------------------------------------------
  const cleaned = useMemo(() => {
    return sanitizeDocument(auth?.nr_cpfcnpj ?? lastNumberDocument ?? "");
  }, [auth]);
  const password = useMemo(() => auth.vl_senha, [auth]);
  const isDocValid = useMemo(() => isValidDocument(cleaned), [cleaned]);
  const isDocCPF = useMemo(() => isCPF(cleaned), [cleaned]);
  const docFormatted = useMemo(() => formatDocument(cleaned), [cleaned]);
  // ----------------------------------------------------------------------------------
  const documentStyles =
    cleaned.length === 0
      ? `
        border-zinc-800
        focus:border-orange-500
        focus:ring-orange-500/20
      `
      : isDocValid
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
  // ----------------------------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signin && signin(cleaned, password);
  };

  return (
    <div className="flex m-auto p-7 rounded-lg bg-black ">
      <MAwaitContainer loading={user?.loading}>
        <form
          className="flex flex-col w-[40ch] gap-2 m-auto"
          {...props}
          onSubmit={handleSubmit}
        >
          {/* DOCUMENT */}
          <MLogoGeza className="mb-5" />

          {/* DOCUMENT */}
          <div className="relative">
            <div className="absolute  left-2 top-1/2 -translate-y-1/2">
              {isDocCPF ? (
                <UserRound className="size-4" />
              ) : (
                <Building2 className="size-4" />
              )}
            </div>
            <input
              className={`
								w-full h-full
								pl-7 py-1.5
								bg-zinc-900
								border outline-none rounded
								transition-all
								text-sm tracking-wide
								focus:ring-4
								disabled:opacity-50 disabled:cursor-not-allowed
								${documentStyles ?? ""}
								`}
              name="cpfcnpj"
              value={docFormatted}
              onChange={(e) => update("nr_cpfcnpj", e.target.value)}
              autoComplete="username"
              placeholder="000.000.000-00"
            />
          </div>
          {/* PASSWORD */}
          <div className="relative">
            <IoKeyOutline className="absolute left-2 top-1/2 -translate-y-1/2 size-4" />
            <input
              type={auth?.in_versenha ? "text" : "password"}
              name="password"
              onChange={(e) => update("vl_senha", e.target.value)}
              autoComplete="current-password"
              value={auth?.vl_senha}
              className="
							w-full h-full
							pl-7 pr-8 py-1.5
							bg-zinc-900
							border border-zinc-800
							outline-none rounded
							transition-all
							text-sm tracking-wide
							focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20
							disabled:opacity-50 disabled:cursor-not-allowed
							"
            />
            <button
              type="button"
              onClick={() => update("in_versenha", !auth?.in_versenha)}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              {auth?.in_versenha ? (
                <Eye className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
            </button>
          </div>
          {/* REMEMBER DOC */}
          <div className="flex px-1">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className=""
                checked={layoutPropsAuth?.isSaveLastDocument}
                onChange={(e) =>
                  setLayoutPropsAuth({
                    ...layoutPropsAuth!,
                    isSaveLastDocument: e.target.checked,
                  })
                }
              />
              Lembrar os dados
            </label>
          </div>
          {/* MESSAGE/INFO */}
          <div className="flex w-full h-10 items-center ">
            {user?.loading ? (
              <h1 className="text-zinc-400 text-xs mx-auto">Carregando...</h1>
            ) : (
              <h1 className="text-red-400 text-xs mx-auto">
                {user?.error && !user?.loading && user.error}
              </h1>
            )}
          </div>
          {/* SUBMIT */}
          <button
            type="submit"
            className="
							h-10
							rounded-lg
							bg-orange-500
							hover:bg-orange-400
							disabled:opacity-50
							disabled:cursor-not-allowed
							transition-all
							font-medium
							text-black
						"
          >
            Login
          </button>
        </form>
      </MAwaitContainer>
    </div>
  );
};
