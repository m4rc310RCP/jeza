import { ChevronRight } from "lucide-react";
import type { FC, HtmlHTMLAttributes } from "react";

interface MToggleSideProps {
  side: "LEFT" | "RIGHT";
  open: boolean;
}

export const MToggleSide: FC<
  HtmlHTMLAttributes<HTMLButtonElement> & MToggleSideProps
> = ({ side, open, className, ...rest }) => {
  const isLeft = side === "LEFT";

  return (
    <button
      type="button"
      {...rest}
      className={`
        top-1/2 -translate-y-1/2

        ${isLeft ? "absolute -right-4" : "fixed"}

        w-5 h-20
        flex items-center justify-center

        bg-[#2a2f36]
        border border-black/40
        ${isLeft ? "rounded-r-lg" : "rounded-l-lg"}

        shadow-xl
        hover:w-8
        transition-all duration-150

        z-[9999]

        ${className ?? ""}
      `}
    >
      <ChevronRight
        size={18}
        className={`
          transition-transform
          ${
            isLeft
              ? open
                ? "rotate-180"
                : ""
              : open
              ? ""
              : "rotate-180"
          }
        `}
      />
    </button>
  );
};