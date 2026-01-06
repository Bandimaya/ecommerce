import React from "react";
import { Skeleton, SkeletonCard, SkeletonText, SkeletonAvatar } from "./skeleton";

export default function ProductGridSkeleton({ columns = 3, count = 6 }: { columns?: number; count?: number }) {
  const items = Array.from({ length: count });
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-${columns} gap-x-8 gap-y-8 w-full max-w-7xl`}>
      {items.map((_, i) => (
        <div key={i} className="relative h-[400px] w-full group cursor-pointer perspective-1000">
          <div className="absolute inset-0 top-12 rounded-[2.5rem] border bg-white shadow-lg overflow-hidden">
            <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
              <div className="mt-24 space-y-4">
                <SkeletonText className="w-1/2" />
                <SkeletonText className="w-3/4" />
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <SkeletonText className="w-1/3" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute z-30 overflow-hidden shadow-xl bg-white">
            <div className="relative w-full h-full bg-slate-100 flex items-center justify-center">
              <Skeleton className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
