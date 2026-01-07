"use client";

import React from "react";
import { Skeleton, SkeletonAvatar, SkeletonText, SkeletonLine } from "./skeleton";

export default function SettingsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-white border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-3">
              <SkeletonAvatar />
              <SkeletonText className="w-24 mt-2" />
            </div>

            <div className="md:col-span-2 space-y-3">
              <SkeletonLine className="w-full h-12" />
              <SkeletonLine className="w-full h-12" />
              <div className="flex items-center gap-3 mt-3">
                <Skeleton className="w-32 h-10 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <SkeletonText className="w-24" />
            <div className="md:col-span-2 flex gap-3 items-center">
              <Skeleton className="w-48 h-10 rounded-lg" />
              <Skeleton className="w-24 h-10 rounded-lg" />
              <SkeletonText className="w-32 text-right" />
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-white border rounded-lg p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 items-center">
              <SkeletonText className="w-24" />
              <div className="col-span-2 flex gap-2">
                <Skeleton className="w-8 h-8 rounded" />
                <Skeleton className="w-8 h-8 rounded" />
                <Skeleton className="w-8 h-8 rounded" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-center">
              <SkeletonText className="w-24" />
              <div className="col-span-2 flex items-center gap-3">
                <Skeleton className="w-full h-3 rounded" />
                <SkeletonText className="w-16 text-right" />
              </div>
            </div>

            <div className="flex gap-3">
              <Skeleton className="w-24 h-10 rounded-xl" />
              <Skeleton className="w-24 h-10 rounded-xl" />
              <Skeleton className="w-24 h-10 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
