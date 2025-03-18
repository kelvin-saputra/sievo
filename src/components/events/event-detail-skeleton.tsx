"use client";

import { Skeleton } from "@/components/ui/skeleton";

const EventDetailSkeleton = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Skeleton className="h-8 w-1/3 mb-4 rounded-lg bg-gray-300" />
      <div className="flex items-center justify-between border-b -mt-2 mb-4 pb-2">
        <div className="w-1/4">
          <Skeleton className="h-6 w-full bg-gray-300" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 rounded-md bg-gray-300" />
          <Skeleton className="h-10 w-32 rounded-md bg-gray-300" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-6 w-full rounded-md bg-gray-300" />
            <Skeleton className="h-6 w-full rounded-md bg-gray-300" />
          </div>
          <Skeleton className="h-6 w-full rounded-md bg-gray-300" />
          <Skeleton className="h-6 w-full rounded-md bg-gray-300" />
          <Skeleton className="h-6 w-full rounded-md bg-gray-300" />
          <Skeleton className="h-6 w-full rounded-md bg-gray-300" />
          <Skeleton className="h-6 w-full rounded-md bg-gray-300" />
        </div>

        {/* Right Column */}
        <div className="flex flex-col h-full bg-blue-50 p-4 rounded-lg border-2">
          <Skeleton className="h-6 w-1/2 rounded-md bg-gray-300 mb-4" />
          <div className="mt-4 flex-1 flex flex-col justify-evenly">
            <Skeleton className="h-12 w-full rounded-md bg-gray-300 mb-4" />
            <Skeleton className="h-12 w-full rounded-md bg-gray-300 mb-4" />
            <Skeleton className="h-12 w-full rounded-md bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailSkeleton;
