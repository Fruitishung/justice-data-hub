
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ReportLoadingSkeleton = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-12 w-1/2" />
      </div>
    </div>
  );
};

export default ReportLoadingSkeleton;
