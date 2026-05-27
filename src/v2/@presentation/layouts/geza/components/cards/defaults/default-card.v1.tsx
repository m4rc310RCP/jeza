import type { FC, HtmlHTMLAttributes } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface MDefaultCardProps {
  loading: boolean;
}

export const MDefaultCard: FC<
  HtmlHTMLAttributes<unknown> & MDefaultCardProps
> = (props) => {
  const { loading, ...rest } = props;

  // if (loading){
  // 	return (
  // 		<div className={`${rest.className ?? ''}`}>
  // 			<MSkeletonPage />
  // 		</div>
  // 	)
  // }
  return (
    <div className="flex overflow-hidden rounded-lg border border-zinc-500">
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
