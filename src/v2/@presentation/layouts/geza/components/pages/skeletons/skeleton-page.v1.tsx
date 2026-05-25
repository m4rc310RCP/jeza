import type { FC, HtmlHTMLAttributes } from "react";

export const MSkeletonPage: FC<HtmlHTMLAttributes<unknown>> = () => {
	return (
    <div className="h-screen space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="skeleton skeleton-shimmer h-40 w-full rounded-xl" />
      <div className="space-y-2">
        <div className="skeleton skeleton-shimmer h-5 w-1/2" />
        <div className="skeleton skeleton-shimmer h-4 w-full" />
        <div className="skeleton skeleton-shimmer h-4 w-4/5" />
      </div>
    </div>
	);
};
