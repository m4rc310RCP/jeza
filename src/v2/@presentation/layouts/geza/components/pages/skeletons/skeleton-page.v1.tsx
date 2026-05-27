import type { FC, HtmlHTMLAttributes } from "react";

export const MSkeletonPage: FC<HtmlHTMLAttributes<unknown>> = () => {
  return (
    <div className="h-full w-full overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex h-full flex-col gap-4">
        {/* HERO */}
        <div className="relative h-[34%] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="skeleton skeleton-shimmer absolute inset-0" />

          <div className="absolute left-5 top-5 flex items-center gap-3">
            <div className="skeleton skeleton-shimmer h-14 w-14 rounded-2xl" />

            <div className="space-y-2">
              <div className="skeleton skeleton-shimmer h-4 w-36 rounded-full" />
              <div className="skeleton skeleton-shimmer h-3 w-24 rounded-full" />
            </div>
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
            <div className="space-y-3">
              <div className="skeleton skeleton-shimmer h-5 w-52 rounded-full" />
              <div className="skeleton skeleton-shimmer h-3 w-32 rounded-full" />
            </div>

            <div className="skeleton skeleton-shimmer h-16 w-16 rounded-2xl" />
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid flex-1 grid-cols-12 gap-4">
          {/* LEFT */}
          <div className="col-span-8 flex flex-col gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-5 flex items-center justify-between">
                <div className="skeleton skeleton-shimmer h-5 w-40 rounded-full" />
                <div className="skeleton skeleton-shimmer h-8 w-20 rounded-xl" />
              </div>

              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="skeleton skeleton-shimmer h-12 w-12 rounded-xl" />

                    <div className="flex-1 space-y-2">
                      <div className="skeleton skeleton-shimmer h-4 w-2/3 rounded-full" />
                      <div className="skeleton skeleton-shimmer h-3 w-1/3 rounded-full" />
                    </div>

                    <div className="skeleton skeleton-shimmer h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="skeleton skeleton-shimmer h-10 w-10 rounded-xl" />
                    <div className="skeleton skeleton-shimmer h-4 w-12 rounded-full" />
                  </div>

                  <div className="space-y-2">
                    <div className="skeleton skeleton-shimmer h-6 w-24 rounded-full" />
                    <div className="skeleton skeleton-shimmer h-3 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-4 flex flex-col gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="skeleton skeleton-shimmer h-5 w-28 rounded-full" />
                <div className="skeleton skeleton-shimmer h-8 w-8 rounded-xl" />
              </div>

              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="skeleton skeleton-shimmer h-9 w-9 rounded-xl" />

                    <div className="flex-1 space-y-2">
                      <div className="skeleton skeleton-shimmer h-3 w-full rounded-full" />
                      <div className="skeleton skeleton-shimmer h-3 w-2/3 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-5 flex items-center justify-between">
                <div className="skeleton skeleton-shimmer h-5 w-32 rounded-full" />
                <div className="skeleton skeleton-shimmer h-5 w-14 rounded-full" />
              </div>

              <div className="flex h-[85%] items-end gap-3">
                {[40, 65, 50, 90, 70, 55, 80].map((height, index) => (
                  <div
                    key={index}
                    className="skeleton skeleton-shimmer w-full rounded-t-2xl"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
