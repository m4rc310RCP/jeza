// import type { FC, HTMLAttributes } from "react";

// import { Building2, Eye, EyeOff, UserRound, ArrowRight } from "lucide-react";

// import { IoKeyOutline } from "react-icons/io5";

// import { MLogoGeza } from "@jeza-v2/presentation/layouts";

// import {
//   formatDocument,
//   isCPF,
//   isValidDocument,
//   sanitizeDocument,
// } from "@jeza-v2/core/utils/documents.v1";

// import { useStoreLocal } from "@jeza-v2/core/data/zustand/zustand-storage.v1";

// export const MContainerSignin: FC<HTMLAttributes<HTMLDivElement>> = () => {
//   const userAuth = useStoreLocal((s) => s.userAuth);

//   const setUserAuth = useStoreLocal((s) => s.setUserAuth);

//   const canLogin = userAuth.in_docvalido && userAuth.vl_senha.length >= 4;

//   return (
//     <div
//       className="
//         flex flex-col
//         m-auto
//         p-6
//         min-w-96
//         rounded-2xl
//         bg-black
//         border border-zinc-800
//         shadow-2xl
//       "
//     >
//       <MLogoGeza />

//       <div className="flex flex-col mt-10">
//         {/* DOCUMENT */}
//         <label
//           className="
//             text-sm text-zinc-400
//             mb-2 block
//           "
//         >
//           CPF/CNPJ
//         </label>

//         <div className="relative">
//           {isCPF(userAuth.nr_cpfcnpj) ? (
//             <UserRound
//               className="
//                 absolute
//                 size-4
//                 left-3
//                 top-1/2
//                 -translate-y-1/2
//                 text-zinc-500
//               "
//             />
//           ) : (
//             <Building2
//               className="
//                 absolute
//                 size-4
//                 left-3
//                 top-1/2
//                 -translate-y-1/2
//                 text-zinc-500
//               "
//             />
//           )}

//           <input
//             value={userAuth.nr_cpfcnpj}
//             onChange={(e) => {
//               let cleaned = sanitizeDocument(e.target.value);

//               cleaned = cleaned.slice(0, 14);

//               const formatted = formatDocument(cleaned);

//               const isValid = isValidDocument(cleaned);

//               setUserAuth({
//                 ...userAuth,
//                 nr_cpfcnpj: formatted,
//                 in_docvalido: isValid,
//               });
//             }}
//             autoComplete="off"
//             spellCheck={false}
//             placeholder="000.000.000-00"
//             className={`
//               w-full h-11
//               rounded
//               bg-zinc-900
//               border
//               outline-none
//               transition-all
//               text-sm
//               tracking-wide
//               uppercase
//               pl-10 pr-4

//               focus:ring-4
//               focus:ring-orange-500/20

//               ${
//                 userAuth.nr_cpfcnpj.length === 0
//                   ? `
//                     border-zinc-800
//                     focus:border-orange-500
//                   `
//                   : userAuth.in_docvalido
//                     ? `
//                     border-emerald-500
//                     focus:border-emerald-500
//                   `
//                     : `
//                     border-red-500
//                     focus:border-red-500
//                   `
//               }
//             `}
//           />
//         </div>

//         {/* PASSWORD */}
//         <label
//           className="
//             text-sm text-zinc-400
//             mb-2 mt-5
//             block
//           "
//         >
//           Informar senha
//         </label>

//         <div className="relative">
//           <IoKeyOutline
//             className="
//               absolute
//               size-4
//               left-3
//               top-1/2
//               -translate-y-1/2
//               text-zinc-500
//             "
//           />

//           <input
//             value={userAuth.vl_senha}
//             onChange={(e) => {
//               const pwd = e.target.value.slice(0, 32);

//               setUserAuth({
//                 ...userAuth,
//                 vl_senha: pwd,
//               });
//             }}
//             type={userAuth.in_versenha ? "text" : "password"}
//             autoComplete="current-password"
//             spellCheck={false}
//             disabled={!userAuth.in_docvalido}
//             placeholder="Senha"
//             className="
//               w-full h-11
//               rounded
//               bg-zinc-900
//               border border-zinc-800
//               outline-none
//               transition-all
//               text-sm
//               tracking-wide
//               pl-10 pr-10

//               focus:ring-4
//               focus:ring-orange-500/20
//               focus:border-orange-500

//               disabled:opacity-50
//               disabled:cursor-not-allowed
//             "
//           />

//           <button
//             type="button"
//             onClick={() => {
//               setUserAuth({
//                 ...userAuth,
//                 in_versenha: !userAuth.in_versenha,
//               });
//             }}
//             className="
//               absolute
//               right-3
//               top-1/2
//               -translate-y-1/2
//               text-zinc-500
//               hover:text-white
//               transition-colors
//             "
//           >
//             {userAuth.in_versenha ? (
//               <Eye className="size-4" />
//             ) : (
//               <EyeOff className="size-4" />
//             )}
//           </button>
//         </div>

//         {/* OPTIONS */}
//         <div
//           className="
//             mt-4
//             flex items-center
//             justify-between
//           "
//         >
//           <label
//             className="
//               flex items-center gap-2
//               text-xs text-zinc-400
//               select-none
//               cursor-pointer
//             "
//           >
//             <input
//               checked={!!userAuth.in_gravar}
//               onChange={(e) => {
//                 setUserAuth({
//                   ...userAuth,
//                   in_gravar: e.target.checked,
//                 });
//               }}
//               type="checkbox"
//               className="
//                 rounded
//                 border-zinc-700
//                 bg-zinc-900
//               "
//             />
//             Lembrar meus dados
//           </label>

//           <button
//             type="button"
//             className="
//               text-xs
//               text-orange-400
//               hover:text-orange-300
//               transition-colors
//             "
//           >
//             Esqueci minha senha
//           </button>
//         </div>

//         {/* LOGIN BUTTON */}
//         <button
//           type="button"
//           disabled={!canLogin}
//           className="
//             mt-6
//             w-full h-12
//             rounded-xl

//             bg-orange-500
//             hover:bg-orange-400

//             disabled:bg-zinc-800
//             disabled:text-zinc-500
//             disabled:cursor-not-allowed

//             transition-all duration-200

//             font-semibold
//             text-sm

//             flex items-center
//             justify-center
//             gap-2

//             shadow-lg
//             shadow-orange-500/20
//           "
//         >
//           Entrar
//           <ArrowRight className="size-4" />
//         </button>

//         {/* SIGNUP */}
//         <div
//           className="
//             mt-6 pt-6
//             border-t border-zinc-800
//             text-center
//           "
//         >
//           <p className="text-sm text-zinc-500">Ainda não possui conta?</p>

//           <button
//             type="button"
//             className="
//               mt-3
//               w-full h-11
//               rounded-xl

//               border border-zinc-700
//               bg-zinc-900/50

//               hover:bg-zinc-900
//               hover:border-zinc-600

//               transition-all

//               text-sm
//               font-medium
//             "
//           >
//             Criar conta
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
