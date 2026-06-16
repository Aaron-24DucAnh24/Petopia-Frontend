import React from 'react';

export default function BlogDetailSkeleton() {
  return (
    <div className="container max-w-3xl mx-auto p-5 mb-16 animate-pulse">
      <div className="h-4 w-40 bg-gray-200 rounded-full mb-5" />

      <div className="w-full pt-[42%] relative rounded-2xl bg-gray-200" />

      <div className="h-9 bg-gray-200 rounded-full w-3/4 mt-6" />
      <div className="h-9 bg-gray-200 rounded-full w-1/2 mt-3" />

      <div className="flex items-center justify-between gap-3 mt-4 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-gray-200" />
          <div className="h-3 w-40 bg-gray-200 rounded-full" />
        </div>
        <div className="h-3 w-16 bg-gray-200 rounded-full" />
      </div>

      <div className="flex flex-col gap-2.5 mt-8">
        <div className="h-2.5 bg-gray-200 rounded-full" />
        <div className="h-2.5 bg-gray-200 rounded-full" />
        <div className="h-2.5 bg-gray-200 rounded-full w-5/6" />
        <div className="h-2.5 bg-gray-200 rounded-full w-2/3" />
      </div>
    </div>
  );
}
