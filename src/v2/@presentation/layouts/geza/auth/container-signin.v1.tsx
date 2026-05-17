// import type { FC, HTMLAttributes } from "react";
// import {
//   ArrowRight,
//   Eye,
//   EyeOff,
//   Lock,
//   Mail,
//   User,
//   Package,
//   Truck,
//   MapPinned,
// } from "lucide-react";
// import { useState } from "react";

// interface MContainerSigninProps {}

// export const MContainerSignin: FC<
//   HTMLAttributes<HTMLDivElement> & MContainerSigninProps
// > = ({ className = "", ...rest }) => {
//   const [mode, setMode] = useState<"signin" | "signup">("signin");
//   const [showPassword, setShowPassword] = useState(false);

//   const isSignin = mode === "signin";

//   return (
//     <div
//       className={`min-h-screen bg-[#09090B] text-white flex ${className}`}
//       {...rest}
//     >
//       {/* LEFT SIDE */}
//       <div className="w-full lg:w-[42%] border-r border-zinc-800 flex flex-col relative overflow-hidden">
//         {/* Background */}
//         <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 opacity-90" />

//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_25%)]" />

//         {/* Content */}
//         <div className="relative z-10 flex flex-col h-full p-8 lg:p-14">
//           {/* Logo */}
//           <div className="flex items-center gap-4">
//             <div
//               className="
//                 size-14 rounded-3xl
//                 bg-white/10 backdrop-blur-xl
//                 border border-white/20
//                 flex items-center justify-center
//                 shadow-2xl
//               "
//             >
//               <Package className="size-7" />
//             </div>

//             <div>
//               <h1 className="text-3xl font-black tracking-tight">©JeZa</h1>

//               <p className="text-white/70 text-sm">Entregas inteligentes</p>
//             </div>
//           </div>

//           {/* Hero */}
//           <div className="flex-1 flex flex-col justify-center">
//             <span
//               className="
//                 inline-flex w-fit items-center gap-2
//                 rounded-full border border-white/20
//                 bg-white/10 backdrop-blur-xl
//                 px-4 py-2 text-sm mb-6
//               "
//             >
//               <Truck className="size-4" />
//               Plataforma de gerenciamento de entregas
//             </span>

//             <h2 className="text-5xl lg:text-6xl font-black leading-tight max-w-xl">
//               Contrate entregadores em poucos cliques.
//             </h2>

//             <p className="mt-6 text-lg text-white/75 leading-relaxed max-w-xl">
//               Informe origem e destino, encontre entregadores disponíveis e
//               acompanhe toda a logística em tempo real.
//             </p>

//             {/* Features */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 max-w-2xl">
//               <div
//                 className="
//                   rounded-3xl border border-white/15
//                   bg-white/10 backdrop-blur-xl
//                   p-5
//                 "
//               >
//                 <MapPinned className="size-6 mb-4" />

//                 <h3 className="font-bold text-lg">Endereço de origem</h3>

//                 <p className="text-white/70 text-sm mt-1">
//                   Escolha o local de coleta da encomenda.
//                 </p>
//               </div>

//               <div
//                 className="
//                   rounded-3xl border border-white/15
//                   bg-white/10 backdrop-blur-xl
//                   p-5
//                 "
//               >
//                 <Truck className="size-6 mb-4" />

//                 <h3 className="font-bold text-lg">Entrega inteligente</h3>

//                 <p className="text-white/70 text-sm mt-1">
//                   O sistema gerencia rotas e entregadores.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Switch */}
//           <div className="mt-10">
//             <div
//               className="
//                 flex rounded-2xl
//                 bg-white/10 backdrop-blur-xl
//                 border border-white/15
//                 p-1
//               "
//             >
//               <button
//                 onClick={() => setMode("signin")}
//                 className={`
//                   flex-1 h-14 rounded-xl font-semibold transition-all
//                   ${
//                     isSignin
//                       ? "bg-white text-black shadow-lg"
//                       : "text-white/70 hover:text-white"
//                   }
//                 `}
//               >
//                 Entrar
//               </button>

//               <button
//                 onClick={() => setMode("signup")}
//                 className={`
//                   flex-1 h-14 rounded-xl font-semibold transition-all
//                   ${
//                     !isSignin
//                       ? "bg-white text-black shadow-lg"
//                       : "text-white/70 hover:text-white"
//                   }
//                 `}
//               >
//                 Criar conta
//               </button>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="mt-8 text-sm text-white/50">
//             © 2026 ©JeZa — Todos os direitos reservados.
//           </div>
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="hidden lg:flex flex-1 items-center justify-center p-10">
//         <div className="w-full max-w-md">
//           {/* Header */}
//           <div className="mb-10">
//             <h2 className="text-5xl font-black tracking-tight">
//               {isSignin ? "Bem-vindo" : "Criar conta"}
//             </h2>

//             <p className="text-zinc-400 mt-3 text-lg">
//               {isSignin
//                 ? "Entre para continuar utilizando a plataforma."
//                 : "Cadastre-se para começar a solicitar entregas."}
//             </p>
//           </div>

//           {/* FORM */}
//           <form className="space-y-5">
//             {/* Signup Name */}
//             {!isSignin && (
//               <div>
//                 <label className="text-sm text-zinc-400 mb-2 block">
//                   Nome completo
//                 </label>

//                 <div className="relative">
//                   <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-500" />

//                   <input
//                     type="text"
//                     placeholder="Seu nome"
//                     className="
//                       w-full h-14 rounded-2xl
//                       bg-zinc-900 border border-zinc-800
//                       pl-12 pr-4
//                       outline-none
//                       transition-all
//                       focus:border-orange-500
//                       focus:ring-4
//                       focus:ring-orange-500/20
//                     "
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Email */}
//             <div>
//               <label className="text-sm text-zinc-400 mb-2 block">E-mail</label>

//               <div className="relative">
//                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-500" />

//                 <input
//                   type="email"
//                   placeholder="voce@email.com"
//                   className="
//                     w-full h-14 rounded-2xl
//                     bg-zinc-900 border border-zinc-800
//                     pl-12 pr-4
//                     outline-none
//                     transition-all
//                     focus:border-orange-500
//                     focus:ring-4
//                     focus:ring-orange-500/20
//                   "
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="text-sm text-zinc-400 mb-2 block">Senha</label>

//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-500" />

//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   className="
//                     w-full h-14 rounded-2xl
//                     bg-zinc-900 border border-zinc-800
//                     pl-12 pr-14
//                     outline-none
//                     transition-all
//                     focus:border-orange-500
//                     focus:ring-4
//                     focus:ring-orange-500/20
//                   "
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="
//                     absolute right-4 top-1/2 -translate-y-1/2
//                     text-zinc-500 hover:text-white
//                     transition-colors
//                   "
//                 >
//                   {showPassword ? (
//                     <EyeOff className="size-5" />
//                   ) : (
//                     <Eye className="size-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Confirm Password */}
//             {!isSignin && (
//               <div>
//                 <label className="text-sm text-zinc-400 mb-2 block">
//                   Confirmar senha
//                 </label>

//                 <div className="relative">
//                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-500" />

//                   <input
//                     type="password"
//                     placeholder="••••••••"
//                     className="
//                       w-full h-14 rounded-2xl
//                       bg-zinc-900 border border-zinc-800
//                       pl-12 pr-4
//                       outline-none
//                       transition-all
//                       focus:border-orange-500
//                       focus:ring-4
//                       focus:ring-orange-500/20
//                     "
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Options */}
//             {isSignin && (
//               <div className="flex items-center justify-between text-sm">
//                 <label className="flex items-center gap-2 text-zinc-400">
//                   <input
//                     type="checkbox"
//                     className="rounded border-zinc-700 bg-zinc-900"
//                   />
//                   Lembrar de mim
//                 </label>

//                 <button
//                   type="button"
//                   className="text-orange-400 hover:text-orange-300"
//                 >
//                   Esqueci minha senha
//                 </button>
//               </div>
//             )}

//             {/* Submit */}
//             <button
//               type="submit"
//               className="
//                 w-full h-14 rounded-2xl
//                 bg-orange-500 hover:bg-orange-400
//                 transition-all duration-200
//                 font-semibold text-lg
//                 flex items-center justify-center gap-2
//                 shadow-lg shadow-orange-500/20
//               "
//             >
//               {isSignin ? "Entrar" : "Criar conta"}

//               <ArrowRight className="size-5" />
//             </button>
//           </form>

//           {/* Bottom */}
//           <p className="text-center text-zinc-500 text-sm mt-8">
//             {isSignin ? "Ainda não possui conta?" : "Já possui conta?"}{" "}
//             <button
//               onClick={() => setMode(isSignin ? "signup" : "signin")}
//               className="text-orange-400 hover:text-orange-300"
//             >
//               {isSignin ? "Criar conta" : "Entrar"}
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };
