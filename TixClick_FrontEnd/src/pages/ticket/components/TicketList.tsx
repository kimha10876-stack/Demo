import React from "react";
import { Card } from "../../../components/ui/card";
import { eventTypes } from "../../../constants/constants";
import { OrderResponse } from "../../../interface/ticket/Ticket";
import { formatDateVietnamese, formatTimeFe } from "../../../lib/utils";
import EmptyList from "../../../assets/no content backup.png";
import TicketCardSkeleton from "./TicketCardSkeleton";

type Props = {
  clickOpenPopup: () => void;
  ticketList: OrderResponse[];
  onClickSelectTicket: (ticket: OrderResponse) => void;
  loading: boolean;
};

const TicketList: React.FC<Props> = ({
  clickOpenPopup,
  ticketList = [],
  onClickSelectTicket,
  loading,
}) => {
  return (
    <div className="mx-10 my-5">
      {loading ? (
        <div className="flex flex-col mt-8 gap-2">
          {[...Array(3)].map((_, i) => (
            <TicketCardSkeleton key={i} />
          ))}
        </div>
      ) : ticketList.length === 0 ? (
        <div className="flex flex-col justify-center items-center">
          <img src={EmptyList} />
          <p className="text-center text-gray-300 w-fit text-base font-semibold">
            Bạn chưa mua vé nào
          </p>
        </div>
      ) : (
        ticketList.map((ticket) => (
          <Card
            key={ticket.orderId}
            onClick={() => onClickSelectTicket(ticket)}
            className="relative flex items-center px-6 py-3 mb-10 w-auto shadow-box hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            {ticket.totalDiscount != ticket.totalPrice && (
              <div className="absolute top-0 left-0 -translate-x-8 -rotate-45 text-white bg-pse-green-second rounded-md px-2">
                Đã áp mã
              </div>
            )}

            <div className="absolute left-1 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] w-3 h-5 rounded-r-full"></div>
            <div className="flex gap-4 items-center">
              <img
                src={ticket.banner}
                alt=""
                className="w-32 h-16 rounded-md"
              />
              <div>
                <div className="font-semibold text-black text-xl w-80 truncate">
                  {ticket.eventName}
                </div>
                <div className="flex text-sm items-center gap-1">
                  {/* <span className="text-pse-gray font-medium">
                    {ticket.ticketType}
                  </span> */}
                  <p
                    style={{
                      backgroundColor: eventTypes.find(
                        (x) => x.id == ticket.eventCategoryId
                      )?.color,
                    }}
                    className="text-white text-xs text-center font-medium rounded-md w-fit px-2 py-1"
                  >
                    {
                      eventTypes.find((x) => x.id == ticket.eventCategoryId)
                        ?.vietnamName
                    }
                  </p>
                </div>
                <div className="text-xs">Thời gian mua: {ticket.orderDate}</div>
              </div>
            </div>
            <div className="ml-auto w-80">
              <p className="w-full truncate">
                <span className="text-pse-green font-semibold">
                  {ticket.locationName}
                </span>
                {" - "}
                {ticket.location}
              </p>
              <p className="w-full truncate">
                {formatTimeFe(ticket.eventStartTime)} -{" "}
                <span className="font-semibold">
                  {formatDateVietnamese(ticket.eventDate.toString())}
                </span>
              </p>
            </div>
            <button
              onClick={clickOpenPopup}
              className="ml-auto text-pse-green font-bold underline-offset-4 underline"
            >
              Chi tiết
            </button>
            <div className="absolute right-1 top-1/2 translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] w-3 h-5 rounded-l-full"></div>
          </Card>
        ))
      )}
    </div>
  );
};

export default TicketList;
