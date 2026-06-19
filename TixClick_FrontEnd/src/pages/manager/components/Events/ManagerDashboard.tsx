import { useState } from "react";
import { Sidebar } from "../../../../components/ui/sidebar";
import { EventDetails } from "./EventDetails";
import { EventList } from "./EventList";


export default function ManagerDashboard() {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Quản lý sự kiện</h1>
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-1">
              <EventList onSelectEvent={(event: any) => setSelectedEvent(event)} />
            </div>
            <div className="col-span-2">
              {selectedEvent ? (
                <EventDetails
                  event={selectedEvent}
                  onUpdate={() => {
                    setSelectedEvent(null);
                  }}
                />
              ) : (
                <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
                  Chọn một sự kiện để xem chi tiết
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}