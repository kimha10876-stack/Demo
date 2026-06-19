import {
  Calendar,
  ChartPie,
  Clock,
  DollarSign,
  MapPin,
  PenIcon,
  Search,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import NoEvent from "../../../assets/NoEvent.png";
import { EventFilter } from "../../organizer/components/EventFilter";
import { useLanguage } from "../../organizer/components/LanguageContext";
import {
  EventDetailResponse,
  EventStatus,
} from "../../../interface/EventInterface";
import {
  formatDateVietnamese,
  formatMoney,
  formatTimeFe,
} from "../../../lib/utils";
import clsx from "clsx";
import { Button } from "../../../components/ui/button";
import { NavLink, useNavigate } from "react-router";
import { FaTasks } from "react-icons/fa";
import { MdExpandMore } from "react-icons/md";
import { motion } from "framer-motion";
import LoadingFullScreen from "../../../components/Loading/LoadingFullScreen";
import useCompany from "../../../hooks/useCompany";
import useEventByCompany from "../../../hooks/useEventByCompany";
import Pagination from "../../../components/Pagination/Pagination";

export default function Consumer() {
  const { company } = useCompany();
  const {
    events,
    loading,
    pagination: { currentPage, totalPages, totalElements, pageSize },
    setPage,
  } = useEventByCompany(company?.companyId);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedEvent, setSelectedEvent] =
    useState<EventDetailResponse | null>();
  const [activeShowTicket, setActiveShowTicket] = useState<number | null>(null);

  const onChangeActiveTicket = (id: number) => {
    setActiveShowTicket(activeShowTicket === id ? null : id);
  };

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter: any) => {
    setActiveFilter(filter);
  };

  const handleEventClick = (event: EventDetailResponse) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const updateEvent = (eventId: number) => {
    navigate(`/create-event?id=${eventId}&step=1`);
  };

  const goTask = (eventId: number) => {
    navigate(`/company/events/${eventId}/tasks`);
  };

  const filteredEvents = events?.filter((event) => {
    const matchSearch = event.eventName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchFilter = activeFilter === "ALL" || event.status === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      {" "}
      {loading && events == undefined ? (
        <LoadingFullScreen />
      ) : (
        <div className="bg-[#1e1e1e] min-h-screen">
          <main className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">{t.title}</h1>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  placeholder={t.search}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-black"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              <EventFilter onFilterChange={handleFilterChange} />
            </div>

            {!loading && filteredEvents && filteredEvents?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents?.map((event) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    key={event.eventId}
                    className="bg-[#2a2a2a] rounded-lg overflow-hidden hover:border hover:border-pse-green transition-colors cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="relative">
                      <img
                        src={event.bannerURL || "/placeholder.svg"}
                        alt={event.description}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span
                          className={clsx(
                            `px-3 py-1 rounded-full text-xs font-medium `,
                            {
                              "bg-pse-error":
                                (event.status as EventStatus) ===
                                EventStatus.REJECTED,
                              "bg-yellow-700":
                                (event.status as EventStatus) ===
                                EventStatus.PENDING,
                              "bg-indigo-600":
                                (event.status as EventStatus) ===
                                EventStatus.CONFIRMED,
                              "bg-pse-green":
                                (event.status as EventStatus) ===
                                EventStatus.SCHEDULED,
                              "bg-pse-gray": event.status === EventStatus.DRAFT,
                              "bg-pse-success":
                                event.status === EventStatus.COMPLETED,
                              "bg-cyan-500":
                                event.status === EventStatus.CANCELLED,
                              "bg-red-500": event.status === EventStatus.ENDED,
                            }
                          )}
                        >
                          {clsx({
                            Nháp:
                              (event.status as EventStatus) ===
                              EventStatus.DRAFT,
                            "Đang chờ duyệt":
                              (event.status as EventStatus) ===
                              EventStatus.PENDING,
                            "Chờ hợp đồng":
                              (event.status as EventStatus) ===
                              EventStatus.CONFIRMED,
                            "Đang diễn ra":
                              (event.status as EventStatus) ===
                              EventStatus.SCHEDULED,
                            "Đã thanh toán":
                              (event.status as EventStatus) ===
                              EventStatus.COMPLETED,
                            "Từ chối":
                              (event.status as EventStatus) ===
                              EventStatus.REJECTED,
                            "Bị hủy":
                              (event.status as EventStatus) ===
                              EventStatus.CANCELLED,
                            "Đã qua":
                              (event.status as EventStatus) ===
                              EventStatus.ENDED,
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white w-full truncate">
                        {event.eventName}
                      </h3>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-white">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {event.eventActivityDTOList.length != 0
                              ? formatDateVietnamese(
                                  event.eventActivityDTOList[0].dateEvent.toString()
                                )
                              : "Chưa có"}
                          </span>
                        </div>

                        <div className="flex items-center text-white">
                          <MapPin className="w-4 h-4 mr-2" />
                          <div className="text-sm line-clamp-1">
                            {event.locationName}
                          </div>
                        </div>
                        <div className="flex w-full top-4 text-gray-400">
                          {event.address +
                            ", " +
                            event.ward +
                            ", " +
                            event.district +
                            ", " +
                            event.city}
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <Button
                            disabled={
                              (event.status as EventStatus) ===
                              EventStatus.DRAFT
                                ? false
                                : true
                            }
                            onClick={() => updateEvent(event.eventId)}
                            className="bg-transparent border-white border"
                          >
                            <PenIcon />
                            Chỉnh sửa
                          </Button>
                          <Button
                            disabled={
                              (event.status as EventStatus) ===
                              EventStatus.SCHEDULED
                                ? false
                                : true
                            }
                            variant={"secondary"}
                            onClick={() => goTask(event.eventId)}
                            // className="bg-transparent border-white border"
                          >
                            <FaTasks />
                            Phân công
                          </Button>
                          <NavLink
                            to={`events/${event.eventId}/summary-revenue`}
                          >
                            <Button className="bg-blue-700 hover:bg-opacity-80">
                              <ChartPie />
                              Tổng quan
                            </Button>
                          </NavLink>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Vé đã bán</p>
                          <p className="text-white font-medium">
                            {event.countTicketSold != null
                              ? event.countTicketSold
                              : "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Doanh thu</p>
                          <p className="text-[#00B14F] font-medium">
                            {event.totalRevenue != null
                              ? formatMoney(event.totalRevenue)
                              : formatMoney(0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            {!loading && events?.length == 0 && (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)]">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <img
                    src={NoEvent || "/placeholder.svg"}
                    alt="No events"
                    className="w-16 h-16 opacity-50"
                  />
                </div>
                <p className="text-white/60">Không tìm thấy sự kiện nào</p>
              </div>
            )}
          </main>

          {selectedEvent && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-[#2a2a2a] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="relative">
                  <img
                    src={selectedEvent.bannerURL || "/placeholder.svg"}
                    alt={selectedEvent.description}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={closeEventDetails}
                    className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 right-4">
                    <span
                      className={clsx(
                        `px-3 py-1 rounded-full text-xs font-medium `,
                        {
                          "bg-pse-error":
                            (selectedEvent.status as EventStatus) ===
                            EventStatus.REJECTED,
                          "bg-yellow-600":
                            (selectedEvent.status as EventStatus) ===
                            EventStatus.PENDING,
                          "bg-indigo-600":
                            (selectedEvent.status as EventStatus) ===
                            EventStatus.CONFIRMED,
                          "bg-pse-green":
                            (selectedEvent.status as EventStatus) ===
                            EventStatus.SCHEDULED,
                          "bg-pse-gray":
                            selectedEvent.status === EventStatus.DRAFT,
                          "bg-pse-success":
                            selectedEvent.status === EventStatus.COMPLETED,
                        }
                      )}
                    >
                      {clsx({
                        Nháp:
                          (selectedEvent.status as EventStatus) ===
                          EventStatus.DRAFT,
                        "Đang chờ duyệt":
                          (selectedEvent.status as EventStatus) ===
                          EventStatus.PENDING,
                        "Chờ hợp đồng":
                          (selectedEvent.status as EventStatus) ===
                          EventStatus.CONFIRMED,
                        "Đang diễn ra":
                          (selectedEvent.status as EventStatus) ===
                          EventStatus.SCHEDULED,
                        "Đã diễn ra":
                          (selectedEvent.status as EventStatus) ===
                          EventStatus.COMPLETED,
                        "Bị hủy":
                          (selectedEvent.status as EventStatus) ===
                          EventStatus.REJECTED,
                      })}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {selectedEvent.eventName}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-pse-green mr-3 mt-0.5" />
                        <div>
                          <p className="text-white font-medium">Ngày</p>
                          <p className="text-gray-400">
                            {selectedEvent.eventActivityDTOList.length != 0
                              ? formatDateVietnamese(
                                  selectedEvent.eventActivityDTOList[0].dateEvent.toString()
                                )
                              : "Chưa có"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-pse-green mr-3 mt-0.5" />
                        <div>
                          <p className="text-white font-medium">Thời gian</p>
                          <p className="text-gray-400">
                            {selectedEvent.eventActivityDTOList.length != 0
                              ? formatTimeFe(
                                  selectedEvent.eventActivityDTOList[0].startTimeEvent.toString()
                                )
                              : "Chưa có"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-pse-green mr-3 mt-0.5" />
                        <div>
                          <p className="text-white font-medium">Địa điểm</p>
                          <p className="text-gray-400">
                            {selectedEvent.locationName}
                            {selectedEvent.address}
                            {selectedEvent.ward}
                            {selectedEvent.district}
                            {selectedEvent.city}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Users className="w-5 h-5 text-pse-green mr-3 mt-0.5" />
                        <div>
                          <p className="text-white font-medium">
                            Số luợt quan tâm
                          </p>
                          <p className="text-gray-400">
                            {selectedEvent.countView} người
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Ticket className="w-5 h-5 text-pse-green mr-3 mt-0.5" />
                        <div>
                          <p className="text-white font-medium">Vé đã bán</p>
                          <p className="text-gray-400">
                            {selectedEvent.countTicketSold != null
                              ? selectedEvent.countTicketSold
                              : "Chưa có"}{" "}
                            vé
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <DollarSign className="w-5 h-5 text-pse-green mr-3 mt-0.5" />
                        <div>
                          <p className="text-white font-medium">Doanh thu</p>
                          <p className="text-gray-400">
                            {selectedEvent.totalRevenue != null
                              ? selectedEvent.totalRevenue
                              : formatMoney(0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Mô tả
                    </h3>
                    {selectedEvent.description ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedEvent.description as any,
                        }}
                      />
                    ) : (
                      <p>No description available.</p>
                    )}
                  </div>

                  <div className="w-full bg-white/80 rounded-lg">
                    <div className="bg-pse-black-light space-y-4 rounded-md w-full mx-auto">
                      <div className="p-3 border-b text-[18px] text-pse-green-second border-white font-extrabold">
                        Thông tin vé
                      </div>
                      {selectedEvent.eventActivityDTOList?.map((activity) => (
                        <div
                          key={activity.eventActivityId}
                          className="border-b border-white"
                        >
                          <div
                            onClick={() =>
                              onChangeActiveTicket(activity.eventActivityId)
                            }
                            className="px-3 pb-3 font-semibold flex items-center cursor-pointer"
                          >
                            <span>
                              <MdExpandMore
                                size={22}
                                // className={`mr-2 transition-all duration-500 ${
                                //   activeShowTicket === ticket.id && "rotate-180"
                                // }`}
                              />
                            </span>
                            <p className="flex flex-col">
                              {formatTimeFe(activity.startTimeEvent)} -{" "}
                              {formatTimeFe(activity.endTimeEvent)},{" "}
                              <span>
                                {" "}
                                {formatDateVietnamese(
                                  activity.dateEvent.toString()
                                )}
                              </span>
                            </p>
                            <NavLink
                              className={"ml-auto"}
                              to={{
                                pathname: selectedEvent.haveSeatMap
                                  ? `/event-detail/${selectedEvent.eventId}/booking-ticket`
                                  : `/event-detail/${selectedEvent.eventId}/booking-ticket-no-seatmap`,
                                search: `?eventId=${activity.eventId}&eventActivityId=${activity.eventActivityId}`,
                              }}
                            >
                              <button className="ml-auto bg-pse-green-second text-white font-semibold hover:bg-pse-green-third px-4 py-2 rounded-md transition-all duration-300">
                                Mua vé ngay
                              </button>
                            </NavLink>
                          </div>
                          {activeShowTicket === activity.eventActivityId && (
                            <div className="bg-black border-t border-white transition-all duration-500">
                              <ul className="">
                                {activity.tickets?.map((ticket) => (
                                  <li
                                    key={ticket.ticketId}
                                    className="odd:bg-pse-black-light/50 even:bg-pse-black-light/20 py-4 pl-11 pr-4 flex justify-between"
                                  >
                                    <span className="font-semibold">
                                      {ticket.ticketName}
                                    </span>
                                    <span className="text-pse-green-second font-semibold ">
                                      {formatMoney(ticket.price)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
      <section className="mx-6 pb-6">
        <Pagination
          currentPage={currentPage + 1}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage - 1)}
        />
      </section>
    </>
  );
}
