import React, { useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { EventDetailProps } from "./InformationEvent";
import {
  formatDateVietnamese,
  formatMoney,
  formatTimeFe,
} from "../../lib/utils";
import { NavLink, useLocation } from "react-router";
import clsx from "clsx";

const InformationTicket: React.FC<EventDetailProps> = ({ eventDetail }) => {
  const [activeShowTicket, setActiveShowTicket] = useState<number | null>(null);
  const location = useLocation()
  const isManagerView = location.pathname.includes("manager")

  const onChangeActiveTicket = (id: number) => {
    setActiveShowTicket(activeShowTicket === id ? null : id);
  };

  return (
    <div className="p-3 bg-white/80 ">
      <div className="bg-pse-black-light space-y-4 rounded-md w-full max-w-[700px] mx-auto">
        <div className="p-3 border-b text-[18px] text-pse-green-second border-white font-extrabold">
          Thông tin vé
        </div>
        {eventDetail?.eventActivityDTOList?.map((activity) => {
          const now = new Date();
          const startSale = new Date(activity.startTicketSale);
          const endSale = new Date(activity.endTicketSale);

          const isBeforeSale = now < startSale;
          const isAfterSale = now > endSale;
          const isSoldOut = activity.soldOut;

          return (
            <div
              key={activity.eventActivityId}
              className="border-b border-white"
            >
              <div
                onClick={() => onChangeActiveTicket(activity.eventActivityId)}
                className="px-3 pb-3 font-semibold flex items-center cursor-pointer"
              >
                <span>
                  <MdExpandMore
                    size={22}
                    className={`mr-2 transition-transform duration-300 ${
                      activeShowTicket === activity.eventActivityId
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </span>
                <p className="flex flex-col">
                  {formatTimeFe(activity.startTimeEvent)} -{" "}
                  {formatTimeFe(activity.endTimeEvent)},{" "}
                  <span>
                    {formatDateVietnamese(activity.dateEvent.toString())}
                  </span>
                </p>

                {/* Nút trạng thái */}
                {isSoldOut || isBeforeSale || isAfterSale && !isManagerView ? (
                  <p
                    className={clsx(
                      "ml-auto flex w-fit h-fit px-2 py-1 rounded-md",
                      {
                        "bg-red-200 text-pse-error/80": isSoldOut,
                        "bg-gray-200 text-gray-600": isBeforeSale,
                        "bg-yellow-100 text-yellow-700": isAfterSale,
                      }
                    )}
                  >
                    {isSoldOut
                      ? "Hết vé"
                      : isBeforeSale
                      ? "Chưa mở bán vé"
                      : "Đóng bán vé"}
                  </p>
                ) : (
                  <NavLink
                    className="ml-auto"
                    to={{
                      pathname: eventDetail.haveSeatMap
                        ? "booking-ticket"
                        : "booking-ticket-no-seatmap",
                      search: `?eventId=${activity.eventId}&eventActivityId=${activity.eventActivityId}`,
                    }}
                  >
                    <button className="ml-auto bg-pse-green-second text-white font-semibold hover:bg-pse-green-third px-4 py-2 rounded-md transition-all duration-300">
                      Mua vé ngay
                    </button>
                  </NavLink>
                )}
              </div>

              {/* Chi tiết vé */}
              {activeShowTicket === activity.eventActivityId && (
                <div className="bg-black border-t border-white transition-all duration-500">
                  <ul>
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
          );
        })}
      </div>
    </div>
  );
};

export default InformationTicket;
