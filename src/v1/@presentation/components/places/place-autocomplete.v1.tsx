import { type FC, type HtmlHTMLAttributes } from "react";

// type Suggestion = {
//   id_local: string;
//   nm_local: string;
// };

export const MPlaceAutocomplete: FC<HtmlHTMLAttributes<unknown>> = () => {
  // const [query, setQuery] = useState("");
  // const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  // const [selected, setSelected] = useState<Suggestion | null>(null);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // const { searchLocal, listPlaces } = useMain();

  // useEffect(() => {
  //   setError(null);
  //   setSuggestions([]);

  //   if (listPlaces?.loading) {
  //     setLoading(true);
  //     return;
  //   }

  //   setLoading(false);

  //   if (listPlaces?.error) {
  //     setError(listPlaces.error);
  //     return;
  //   }

  //   setSuggestions(listPlaces?.value || []);
  // }, [listPlaces]);

  // const handleSearch = () => {
  //   if (!query.trim()) return;
  //   searchLocal(query);
  // };

  // const handleSelect = (item: Suggestion) => {
  //   setSelected(item);
  //   setQuery(item.nm_local);
  //   setSuggestions([]);
  // };

  // const handleClear = () => {
  //   setSelected(null);
  //   setQuery("");
  //   setSuggestions([]);
  // };

  return (
    <div className="w-96">
      <form action="" className="">
        <input type="text" className="p-1" />
        <button className="">Pesquisar</button>
      </form>
    </div>
  );

  // return (
  //   <div style={{ width: 420, position: "relative", fontFamily: "sans-serif" }}>

  //     {/* ================== INPUT OU CARD ================== */}
  //     {!selected ? (
  //       <div
  //         style={{
  //           display: "flex",
  //           alignItems: "center",
  //           gap: 8,
  //           background: "#fff",
  //           border: "1px solid #ddd",
  //           borderRadius: 10,
  //           padding: 6,
  //           boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  //         }}
  //       >
  //         <input
  //           type="text"
  //           value={query}
  //           placeholder="Buscar endereço..."
  //           onChange={(e) => setQuery(e.target.value)}
  //           onKeyDown={(e) => e.key === "Enter" && handleSearch()}
  //           style={{
  //             flex: 1,
  //             border: "none",
  //             outline: "none",
  //             padding: "8px 10px",
  //             fontSize: 14,
  //             borderRadius: 8,
  //           }}
  //         />

  //         <button
  //           onClick={handleSearch}
  //           disabled={loading}
  //           style={{
  //             padding: "8px 12px",
  //             borderRadius: 8,
  //             border: "none",
  //             background: "#111",
  //             color: "#fff",
  //             cursor: "pointer",
  //             fontSize: 13,
  //           }}
  //         >
  //           {loading ? "..." : "Buscar"}
  //         </button>
  //       </div>
  //     ) : (
  //       <div
  //         style={{
  //           display: "flex",
  //           justifyContent: "space-between",
  //           alignItems: "center",
  //           padding: 12,
  //           borderRadius: 12,
  //           background: "#f9f9f9",
  //           border: "1px solid #e5e5e5",
  //           boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  //         }}
  //       >
  //         <div>
  //           <div style={{ fontSize: 13, color: "#666" }}>
  //             Endereço selecionado
  //           </div>
  //           <div style={{ fontSize: 15, fontWeight: 500 }}>
  //             {selected.nm_local}
  //           </div>
  //         </div>

  //         <button
  //           onClick={handleClear}
  //           style={{
  //             border: "none",
  //             background: "transparent",
  //             cursor: "pointer",
  //             fontSize: 16,
  //             color: "#999",
  //           }}
  //         >
  //           ✕
  //         </button>
  //       </div>
  //     )}

  //     {/* ================== DROPDOWN ================== */}
  //     {!selected && suggestions.length > 0 && (
  //       <ul
  //         style={{
  //           position: "absolute",
  //           top: 52,
  //           left: 0,
  //           width: "100%",
  //           background: "#fff",
  //           borderRadius: 10,
  //           border: "1px solid #e5e5e5",
  //           listStyle: "none",
  //           padding: 4,
  //           margin: 0,
  //           maxHeight: 240,
  //           overflowY: "auto",
  //           zIndex: 9999,
  //           boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  //         }}
  //       >
  //         {suggestions.map((item) => (
  //           <li
  //             key={item.id_local}
  //             onClick={() => handleSelect(item)}
  //             style={{
  //               padding: "10px 12px",
  //               borderRadius: 8,
  //               cursor: "pointer",
  //               fontSize: 14,
  //             }}
  //             onMouseEnter={(e) =>
  //               (e.currentTarget.style.background = "#f5f5f5")
  //             }
  //             onMouseLeave={(e) =>
  //               (e.currentTarget.style.background = "transparent")
  //             }
  //           >
  //             {item.nm_local}
  //           </li>
  //         ))}
  //       </ul>
  //     )}

  //     {/* ================== ESTADOS ================== */}
  //     {!selected && loading && (
  //       <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
  //         Buscando locais...
  //       </div>
  //     )}

  //     {!selected && !loading && suggestions.length === 0 && query && (
  //       <div style={{ marginTop: 8, fontSize: 13, color: "#999" }}>
  //         Nenhum resultado encontrado
  //       </div>
  //     )}

  //     {error && (
  //       <div style={{ marginTop: 8, color: "red", fontSize: 13 }}>
  //         {error}
  //       </div>
  //     )}
  //   </div>
  // );
};
