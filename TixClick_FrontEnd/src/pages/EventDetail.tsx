import { useParams } from "react-router";
import HostEvent from "../components/EventDetail/HostEvent";
import InformationEvent from "../components/EventDetail/InformationEvent";
import InformationTicket from "../components/EventDetail/InformationTicket";
import IntroduceEvent from "../components/EventDetail/IntroduceEvent";
import { useEffect, useRef, useState } from "react";
import eventApi from "../services/eventApi";
import { EventDetailResponse } from "../interface/EventInterface";
import LoadingFullScreen from "../components/Loading/LoadingFullScreen";

const EventDetail = () => {
  const { id } = useParams();
  const selectTicketRef = useRef<HTMLDivElement | null>(null);
  const [eventDetail, setEventDetail] = useState<
    EventDetailResponse | undefined
  >();
  const [loading, setLoading] = useState<boolean>(false);
  const today = new Date();
  const dateTicketSaleString =
    eventDetail?.eventActivityDTOList[0]?.startTicketSale;

  const isTicketSale: boolean =
    dateTicketSaleString !== undefined
      ? new Date(dateTicketSaleString) <= today
      : false;

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        const response = await eventApi.getEventDetail(Number(id));
        // console.log(response);
        if (response.data.result) {
          setEventDetail(response.data.result);
        } else {
          setEventDetail(undefined);
        }
        const countResponse = await eventApi.countView(Number(id));
        console.log(countResponse.data.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const scrollToSelectTicket = () => {
    if (selectTicketRef.current) {
      selectTicketRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <>
      {loading ? (
        <LoadingFullScreen />
      ) : (
        <div>
          <InformationEvent
            eventDetail={eventDetail}
            scrollToSelectTicket={scrollToSelectTicket}
            isSaleTicket={isTicketSale}
          />
          <IntroduceEvent eventDetail={eventDetail} />
          <div ref={selectTicketRef}>
            <InformationTicket eventDetail={eventDetail} />
          </div>
          <HostEvent eventDetail={eventDetail} />
        </div>
      )}
    </>
  );
};

export default EventDetail;
