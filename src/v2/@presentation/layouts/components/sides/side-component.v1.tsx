import { useStoreLocal } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { ChevronRight } from "lucide-react";
import { useRef, type FC, type HtmlHTMLAttributes } from "react";

interface MSideProps {
  side: "RIGHT" | "LEFT";
}

export const MSide: FC<HtmlHTMLAttributes<unknown> & MSideProps> = ({
  className,
  children,
  side,
  ...rest
}) => {
  const isLeft = side === "LEFT";
  const key = isLeft ? "l" : "r";
  const otherKey = isLeft ? "r" : "l";

  const sides = useStoreLocal((s) => s.sides);
  const toggleSide = useStoreLocal((s) => s.toggleSide);
  const changeWidth = useStoreLocal((s) => s.changeWidth);

  const isOpen = sides[key].isOpen;
  const width = sides[key].width;
  const max = sides[key].max;

  const resizing = useRef(false);

  const MIN_CENTER = 200; // 🔥 área mínima do conteúdo central
  const MIN_WIDTH = 80;

  // ===============================
  // RESIZE
  // ===============================

  const startResize = (e: React.PointerEvent) => {
    resizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const stopResize = (e: React.PointerEvent) => {
    resizing.current = false;
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!resizing.current) return;

    const totalWidth = window.innerWidth;

    const otherWidth = sides[otherKey].isOpen ? sides[otherKey].width : 0;

    const newWidth = isLeft ? e.clientX : totalWidth - e.clientX;

    // 🔥 limite baseado no outro side
    const maxAllowed = totalWidth - otherWidth - MIN_CENTER;

    const final = Math.min(
      Math.max(newWidth, MIN_WIDTH),
      Math.min(max, maxAllowed),
    );

    changeWidth(key, Math.round(final));
  };

  // ===============================
  // UI
  // ===============================

  return (
    <aside
      {...rest}
      className={`relative h-full shrink-0 flex ${className || ""}`}
    >
      {/* LEFT */}
      {isLeft && isOpen && (
        <div className="h-full bg-[#262526]" style={{ width }}>
          {children}
        </div>
      )}

      {/* HANDLE */}
      <div className="relative w-1.5 h-full bg-gray-800 hover:bg-gray-600">
        {/* RESIZE AREA */}
        <div
          onPointerDown={startResize}
          onPointerMove={onMove}
          onPointerUp={stopResize}
          onPointerLeave={stopResize}
          className="absolute inset-0 cursor-col-resize"
        />

        {/* TOGGLE */}
        <button
          onClick={() => toggleSide(key)}
          className={`
            absolute top-1/2 -translate-y-1/2
            ${isLeft ? "left-0" : "right-0"}
            ${isLeft ? "origin-left" : "origin-right"}
            
            w-1 h-12
            group flex items-center justify-center
            
            transition-all duration-200
            hover:w-6

						bg-gray-500
            
						${isLeft ? "hover:rounded-r-md" : "hover:rounded-l-md"}
            
            border shadow-sm z-10
          `}
        >
          <ChevronRight
            size={16}
            className={`
							opacity-0 
							group-hover:opacity-100
							transition-all duration-200
							${isLeft ? (isOpen ? "rotate-180" : "") : isOpen ? "" : "rotate-180"}
						`}
          />
        </button>
      </div>

      {/* RIGHT */}
      {!isLeft && isOpen && (
        <div className="h-full bg-[#262526]" style={{ width }}>
          {children}
        </div>
      )}
    </aside>
  );
};




