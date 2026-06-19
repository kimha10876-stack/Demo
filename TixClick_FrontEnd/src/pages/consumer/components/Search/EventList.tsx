import React from "react";
import { EventDetailResponse } from "../../../../interface/EventInterface";
import { formatDateVietnamese, formatMoney } from "../../../../lib/utils";
import { CiCalendar } from "react-icons/ci";
import EmptyList from "../../../../components/EmptyList/EmptyList";
import { NavLink } from "react-router";

type Props = {
  eventList: EventDetailResponse[];
};

const EventList: React.FC<Props> = ({ eventList }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 ">
      {eventList.length == 0 && (
        <div className="col-span-2 md:col-span-4">
          <EmptyList label="Không có sự kiện phù hợp" />
        </div>
      )}
      {eventList.map((event) => (
        <div key={event.bannerURL} className="flex-col space-y-1">
          <NavLink to={`/event-detail/${event.eventId}`}>
            <div className="lg:relative group overflow-hidden cursor-pointer">
              <img
                className="rounded-lg w-full h-[150px] lg:h-[200px] lg:group-hover:opacity-50 transition-all duration-300"
                src={event.bannerURL}
              />

              <div className="lg:absolute hidden inset-0 lg:flex items-center justify-center opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-[14px] font-semibold px-4 py-2 rounded-sm bg-pse-green-third">
                  Mua vé
                </span>
              </div>
            </div>
          </NavLink>
          <div className="font-bold">{event.eventName}</div>
          <div className="text-pse-green font-semibold">
            Từ {formatMoney(event.price)}
          </div>
          <div className="flex items-center gap-1">
            <CiCalendar size={20} />
            <p>
              {formatDateVietnamese(
                event.eventActivityDTOList[0].dateEvent.toString()
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
