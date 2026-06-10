import type { FC, HtmlHTMLAttributes } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface MAwaitContainerProps {
  loading: boolean;
}

export const MAwaitContainer: FC<
  HtmlHTMLAttributes<unknown> & MAwaitContainerProps
> = (props) => {
  const { loading, ...rest } = props;

  return (
    <div className="flex overflow-hidden">
      <div className="relative w-full">
        {loading && (
          <div className="absolute inset-0 z-10 flex  backdrop-blur-xs">
            <div className="m-auto">
              <AiOutlineLoading3Quarters className="size-5 animate-spin-medium" />
            </div>
          </div>
        )}
        <div {...rest} className={`overflow-hidden ${rest.className ?? ""}`} />
      </div>
    </div>
  );
};
