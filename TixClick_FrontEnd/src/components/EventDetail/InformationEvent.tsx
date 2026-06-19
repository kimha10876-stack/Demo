import React from "react";
import { CiCalendar } from "react-icons/ci";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useLocation } from "react-router";
import { EventDetailResponse } from "../../interface/EventInterface";
import {
  formatDateVietnamese,
  formatMoney,
  formatTimeFe,
} from "../../lib/utils";

export type EventDetailProps = {
  eventDetail: Partial<EventDetailResponse> | undefined;
};

type InforEventType = EventDetailProps & {
  scrollToSelectTicket: () => void;
  isSaleTicket: boolean;
};



const InformationEvent: React.FC<InforEventType> = ({
  eventDetail,
  scrollToSelectTicket,
  isSaleTicket,
}) => {

  const location = useLocation()
  const isManagerView = location.pathname.includes("manager")
  return (
    <div className="relative mx-3 mt-24 mb-8 lg:flex lg:justify-center bg-[#1E1E1E]">
      <div className="relative">
        <div className="absolute left-1 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] w-6 h-10 rounded-r-full"></div>
        <img
          src={eventDetail?.bannerURL}
          loading="lazy"
          className="w-full lg:w-[614px] lg:h-[350px]"
        />
      </div>
      <div className="relative bg-pse-black-light p-4 leading-10 shadow-box min-w-[600px]">
        <p className="font-extrabold text-[18px] leading-6">
          {eventDetail?.eventName}
        </p>
        <p className="flex items-center text-pse-green-second font-bold">
          <span>
            <CiCalendar size={18} color="white" className="mr-1" />
          </span>
          <div>
            {eventDetail?.eventActivityDTOList != undefined &&
              formatTimeFe(eventDetail.eventActivityDTOList[0].startTimeEvent) +
                ` - ` +
                formatTimeFe(eventDetail.eventActivityDTOList[0].endTimeEvent) +
                `, ` +
                formatDateVietnamese(
                  eventDetail.eventActivityDTOList[0].dateEvent.toString()
                )}
          </div>
        </p>
        <p className="relative flex items-center text-[#c4c4cf]">
          <span>
            <FaMapMarkerAlt size={18} className="mr-1" color="white" />
          </span>
          <div className="text-pse-green-second font-semibold">
            {eventDetail?.locationName}
          </div>
          <div className="absolute top-5 left-5 truncate">
            {eventDetail?.address +
              ", " +
              eventDetail?.ward +
              ", " +
              eventDetail?.district +
              ", " +
              eventDetail?.city}
          </div>
        </p>
        <div className="max-[1150px]:hidden absolute bottom-28 w-[95%] h-[1px] bg-white rounded-full">
          <div className="text-[20px] font-extrabold my-2">
            Giá từ{" "}
            <span className="text-pse-green-second">
              {formatMoney(eventDetail?.price)}
            </span>
          </div>

          <button
            disabled={isSaleTicket ? false : true}
            onClick={scrollToSelectTicket}
            className={`${
              isSaleTicket
                ? `bg-pse-green-second hover:bg-pse-green-third`
                : `bg-pse-gray cursor-not-allowed`
            }   text-white w-full rounded-lg font-semibold transition-all duration-500`}
          >
            {isSaleTicket && !isManagerView ? "Chọn lịch diễn" : "Chưa mở bán vé"}
          </button>
        </div>

        <div className="absolute right-1 top-1/2 translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] w-6 h-10 rounded-l-full"></div>
      </div>
    </div>
  );
};

export default InformationEvent;
