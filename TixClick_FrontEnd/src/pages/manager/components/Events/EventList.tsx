import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { EventType } from "../../../../interface/manager/EventType";
import { Button } from "../../../../components/ui/button";



const mockEvents: EventType[] = [
  { id: 1, name: "Lễ hội âm nhạc mùa hè", status: "pending", date: "2023-07-15" },
  { id: 2, name: "Hội nghị công nghệ 2023", status: "pending", date: "2023-08-22" },
  { id: 3, name: "Triển lãm Ẩm thực & Rượu vang", status: "approved", date: "2023-09-10" },
  { id: 4, name: "Khai trương Phòng trưng bày nghệ thuật", status: "rejected", date: "2023-07-30" },
];

interface EventListProps {
  onSelectEvent: (event: EventType) => void;
}

export function EventList({ onSelectEvent }: EventListProps) {
  const [events, setEvents] = useState<EventType[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setEvents(mockEvents);
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      (filter === "all" || event.status === filter) &&
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm sự kiện..."
            className="w-full px-4 py-2 pl-10 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B14F]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4 text-black ">
        <Button onClick={() => setFilter("all")} variant={filter === "all" ? "default" : "outline"} size="sm">
          Tất cả
        </Button>
        <Button onClick={() => setFilter("pending")} variant={filter === "pending" ? "default" : "outline"} size="sm">
          Chờ duyệt
        </Button>
        <Button onClick={() => setFilter("approved")} variant={filter === "approved" ? "default" : "outline"} size="sm">
          Đã duyệt
        </Button>
        <Button onClick={() => setFilter("rejected")} variant={filter === "rejected" ? "default" : "outline"} size="sm">
          Từ chối
        </Button>
      </div>
      <ul className="space-y-2">
        {filteredEvents.map((event) => (
          <li
            key={event.id}
            className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition duration-200"
            onClick={() => onSelectEvent(event)}
          >
            <h3 className="text-white font-semibold">{event.name}</h3>
            <p className="text-sm text-gray-400">Ngày: {event.date}</p>
            <p className="text-sm text-gray-400">
              Trạng thái:
              <span
                className={`ml-1 ${
                  event.status === "pending"
                    ? "text-yellow-400"
                    : event.status === "approved"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {event.status === "pending" ? "Chờ duyệt" : event.status === "approved" ? "Đã duyệt" : "Từ chối"}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
