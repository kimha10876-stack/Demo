import { Calendar, DollarSign, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { Event } from "../../../../interface/manager/EventType";
import { Button } from "../../../../components/ui/button";



interface EventDetailsProps {
  event: Event;
  onUpdate: () => void;
}

export function EventDetails({ event, onUpdate }: EventDetailsProps) {
  const [status, setStatus] = useState<Event["status"]>(event.status);

  const handleApprove = () => {
    setStatus("approved");
    onUpdate();
  };

  const handleReject = () => {
    setStatus("rejected");
    onUpdate();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">{event.name}</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center text-gray-400">
          <Calendar className="w-5 h-5 mr-2" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center text-gray-400">
          <MapPin className="w-5 h-5 mr-2" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center text-gray-400">
          <Users className="w-5 h-5 mr-2" />
          <span>{event.attendees} người tham dự</span>
        </div>
        <div className="flex items-center text-gray-400">
          <DollarSign className="w-5 h-5 mr-2" />
          <span>{event.priceRange}</span>
        </div>
      </div>
      <p className="text-gray-400 mb-4">
        Mô tả sự kiện sẽ được hiển thị ở đây. Đây là một ví dụ về mô tả sự kiện, bao gồm thông tin chi tiết về nội dung,
        chương trình và các điểm nổi bật của sự kiện.
      </p>
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-2">Trạng thái hiện tại:</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === "pending"
              ? "bg-yellow-400 text-yellow-900"
              : status === "approved"
              ? "bg-green-400 text-green-900"
              : "bg-red-400 text-red-900"
          }`}
        >
          {status === "pending" ? "Chờ duyệt" : status === "approved" ? "Đã duyệt" : "Từ chối"}
        </span>
      </div>
      <div className="flex gap-4">
        <Button
          onClick={handleApprove}
          disabled={status !== "pending"}
          className="bg-[#00B14F] hover:bg-[#00B14F]/90 text-white"
        >
          Duyệt
        </Button>
        <Button onClick={handleReject} variant="destructive" disabled={status !== "pending"}>
          Từ chối
        </Button>
      </div>
    </div>
  );
}