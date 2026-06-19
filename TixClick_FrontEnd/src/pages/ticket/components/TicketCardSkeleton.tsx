import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

export default function TicketCardSkeleton() {
  return (
    <Card className="relative flex items-center justify-between px-6 py-2 mb-8 w-auto shadow-box">
      {/* Vạch trái */}
      <div className="absolute left-1 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] w-3 h-5 rounded-r-full" />

      {/* Thông tin hình ảnh + tên vé */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-32 h-16 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-80" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Địa điểm + thời gian */}
      <div className="flex flex-col justify-center w-80 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>

      {/* Nút chi tiết */}
      <div className="flex items-center">
        <Skeleton className="h-5 w-16" />
      </div>

      {/* Vạch phải */}
      <div className="absolute right-1 top-1/2 translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] w-3 h-5 rounded-l-full" />
    </Card>
  );
}
