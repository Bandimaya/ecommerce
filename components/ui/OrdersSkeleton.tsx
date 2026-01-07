"use client";

import React from "react";
import { Skeleton, SkeletonText } from "./skeleton";

export default function OrdersSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <SkeletonText className="w-32" />
              <SkeletonText className="w-40 mt-2" />
            </div>
            <div className="text-right">
              <SkeletonText className="w-20" />
              <SkeletonText className="w-16 mt-2" />
            </div>
          </div>

          <div className="divide-y">
            <div className="flex gap-4 py-3 items-center">
              <Skeleton className="w-16 h-16 rounded-md" />

              <div className="flex-1">
                <SkeletonText className="w-3/4" />
                <SkeletonText className="w-1/3 mt-2" />
              </div>

              <SkeletonText className="w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
