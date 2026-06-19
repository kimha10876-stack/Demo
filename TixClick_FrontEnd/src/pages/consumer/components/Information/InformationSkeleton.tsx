import { Skeleton } from "../../../../components/ui/skeleton";

const InformationSkeleton = () => {
  return (
    <div className="w-sm bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col gap-4 animate-pulse">
      {/* Logo & tên công ty */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-md border border-gray-300" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
          <div className="flex items-start gap-1">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded-full ml-auto" />
      </div>

      {/* Mô tả */}
      <Skeleton className="h-4 w-full italic rounded" />

      {/* Thông tin chi tiết */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <Skeleton className="h-4 w-1/3 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-4 w-1/2 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
      </div>

      {/* Bank info */}
      <div className="border border-gray-300 rounded-lg p-3 space-y-2">
        <Skeleton className="h-4 w-1/2 rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>
    </div>
  );
};

export default InformationSkeleton;
