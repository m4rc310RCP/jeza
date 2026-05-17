import { useMAuth } from "@jeza-v2/presentation/contexts";

import {
  useMemo,
  useRef,
  useState,
  type FC,
  type HTMLAttributes,
} from "react";

import {
  Building2,
  Eye,
  EyeOff,
  UserRound,
} from "lucide-react";

import { IoKeyOutline } from "react-icons/io5";

import {
  formatDocument,
  isCPF,
  isValidDocument,
  sanitizeDocument,
} from "@jeza-v2/core/utils/documents.v1";

import { MLogoGeza } from "@jeza-v2/presentation/layouts";

import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";

export const MContainerSignin: FC<
  HTMLAttributes<HTMLDivElement>
> = () => {
  return (
    <div
      className="
        flex flex-col
        m-auto
        p-6
        min-w-96
        gap-2
        rounded-2xl
        bg-black
        border border-zinc-800
        shadow-2xl
      "
    >
      <MDivSignIn />
    </div>
  );
};

export const MDivSignIn: FC<
  HTMLAttributes<HTMLFormElement>
> = (props) => {
  const {
    fn_login: handleSignIn,
    oc_autenticado: mauth,
    nr_cpfcnpj,
  } = useMAuth();

  const cpfCnpj = useLayoutStore(
    (s) => s.cpfCnpj,
  );

  const passwordRef =
    useRef<HTMLInputElement>(null);

  // ========================================================
  // STATE
  // ========================================================

  const [auth, setAuth] = useState<IUserAuth>({
    nr_cpfcnpj: nr_cpfcnpj
      ? formatDocument(
          sanitizeDocument(nr_cpfcnpj),
        )
      : cpfCnpj
        ? formatDocument(
            sanitizeDocument(cpfCnpj),
          )
        : "",

    vl_senha: "",

    in_gravar: false,

    in_versenha: false,
  } as IUserAuth);

  // ========================================================
  // DERIVED STATE
  // ========================================================

  const cleaned = useMemo(() => {
    return sanitizeDocument(auth.nr_cpfcnpj);
  }, [auth.nr_cpfcnpj]);

  const isDocumentValidate = useMemo(() => {
    return isValidDocument(cleaned);
  }, [cleaned]);

  const isDocCpf = useMemo(() => {
    return isCPF(cleaned);
  }, [cleaned]);

  // ========================================================
  // INPUT HANDLERS
  // ========================================================

  const handleDocumentChange = (
    value: string,
  ) => {
    let cleaned = sanitizeDocument(value);

    cleaned = cleaned.slice(0, 14);

    const formatted =
      formatDocument(cleaned);

    const isValid =
      isValidDocument(cleaned);

    setAuth((prev) => ({
      ...prev,
      nr_cpfcnpj: formatted,
    }));

    // foco automático senha
    if (isValid) {
      requestAnimationFrame(() => {
        passwordRef.current?.focus();
      });
    }
  };

  const handlePasswordChange = (
    value: string,
  ) => {
    const pwd = value.slice(0, 12);

    setAuth((prev) => ({
      ...prev,
      vl_senha: pwd,
    }));
  };

  // ========================================================
  // STYLES
  // ========================================================

  const documentStyles =
    cleaned.length === 0
      ? `
        border-zinc-800
        focus:border-orange-500
        focus:ring-orange-500/20
      `
      : isDocumentValidate
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

  // ========================================================
  // SUBMIT
  // ========================================================

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    handleSignIn({
      ...auth,
      nr_cpfcnpj: cleaned,
    });
  };

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <form
      className="flex flex-col gap-2"
      {...props}
      onSubmit={handleSubmit}
    >
      <MLogoGeza className="my-6" />

      {/* DOCUMENTO */}
      <div className="relative">
        <div
          className="
            absolute
            left-2
            top-1/2
            -translate-y-1/2
          "
        >
          {isDocCpf ? (
            <UserRound className="size-4" />
          ) : (
            <Building2 className="size-4" />
          )}
        </div>

        <input
          name="cpfcnpj"
          autoComplete="username"
          disabled={mauth?.loading}
          value={auth.nr_cpfcnpj}
          placeholder="000.000.000-00"
          onChange={(e) =>
            handleDocumentChange(
              e.target.value,
            )
          }
          className={`
            w-full
            h-full

            pl-7
            py-1.5

            bg-zinc-900

            border
            outline-none
            rounded

            transition-all

            text-sm
            tracking-wide

            focus:ring-4

            disabled:opacity-50
            disabled:cursor-not-allowed

            ${documentStyles}
          `}
        />
      </div>

      {/* SENHA */}
      <div className="relative">
        <IoKeyOutline
          className="
            absolute
            left-2
            top-1/2
            -translate-y-1/2
            size-4
          "
        />

        <input
          ref={passwordRef}
          type={
            auth.in_versenha
              ? "text"
              : "password"
          }
          name="password"
          autoComplete="current-password"
          disabled={
            mauth?.loading ||
            !isDocumentValidate
          }
          value={auth.vl_senha}
          onChange={(e) =>
            handlePasswordChange(
              e.target.value,
            )
          }
          className="
            w-full
            h-full

            pl-7
            pr-8
            py-1.5

            bg-zinc-900

            border
            border-zinc-800

            outline-none
            rounded

            transition-all

            text-sm
            tracking-wide

            focus:border-orange-500
            focus:ring-4
            focus:ring-orange-500/20

            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        />

        <button
          type="button"
          disabled={
            mauth?.loading ||
            !isDocumentValidate
          }
          onClick={() => {
            setAuth((prev) => ({
              ...prev,
              in_versenha:
                !prev.in_versenha,
            }));
          }}
          className="
            absolute
            right-2
            top-1/2
            -translate-y-1/2
          "
        >
          {auth.in_versenha ? (
            <Eye className="size-4" />
          ) : (
            <EyeOff className="size-4" />
          )}
        </button>
      </div>

      {/* CHECKBOX */}
      <label
        className="
          flex
          items-center
          gap-2
          text-sm
        "
      >
        <input
          type="checkbox"
          checked={auth.in_gravar}
          disabled={
            mauth?.loading ||
            !isDocumentValidate ||
            !auth.vl_senha
          }
          onChange={(e) => {
            setAuth((prev) => ({
              ...prev,
              in_gravar:
                e.target.checked,
            }));
          }}
        />

        Lembrar os dados
      </label>

      {/* STATUS */}
      <div
        className="
          w-full
          h-10
          flex
          items-center
        "
      >
        {mauth?.loading && (
          <p
            className="
              text-sm
              text-zinc-400
              mx-auto
            "
          >
            Aguarde...
          </p>
        )}

        {!mauth?.loading &&
          mauth?.error && (
            <p
              className="
                text-xs
                text-red-400
                mx-auto
              "
            >
              {mauth?.error}
            </p>
          )}
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={
          mauth?.loading ||
          !isDocumentValidate ||
          !auth.vl_senha
        }
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
  );
};