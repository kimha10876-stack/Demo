import { ClipboardList, DollarSign, Eye, MapPin, Ticket } from "lucide-react";
import SummaryCard from "./SummaryCard";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { EventDetailResponse } from "../../../../../interface/EventInterface";
import eventApi from "../../../../../services/eventApi";
import { Card } from "../../../../../components/ui/card";
import LoadingFullScreen from "../../../../../components/Loading/LoadingFullScreen";

type SummaryType = "INFORMATION" | "REVENUE";

export interface Summary {
  id: number;
  name: string;
  value: number | undefined;
  growth: number;
  icon: JSX.Element;
  type?: SummaryType;
}

interface SummaryValue {
  totalRevenue: number;
  countOrder: number;
  countViewer: number;
  countTicket: number;
}

const SummaryRevenue = () => {
  const { eventId } = useParams();
  const [summary, setSummary] = useState<SummaryValue>();
  const [eventDetail, setEventDetail] = useState<
    EventDetailResponse | undefined
  >();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSummary = async () => {
    const response = await eventApi.getSummary(Number(eventId));
    console.log(response);
    if (response.data.code == 200) {
      setSummary(response.data.result);
    }
  };

  const fetchData = async () => {
    if (eventId) {
      setLoading(true);
      const response = await eventApi.getEventDetail(Number(eventId));
      if (response.data.result) {
        setEventDetail(response.data.result);
      } else {
        setEventDetail(undefined);
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSummary();
    fetchData();
  }, [eventId]);

  if (!eventDetail) return <LoadingFullScreen />;

  return (
    <div className="p-6 min-h-screen bg-background text-foreground">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          id={1}
          name="Tổng doanh thu"
          growth={20}
          value={summary?.totalRevenue}
          type="REVENUE"
          icon={<DollarSign size={18} className="text-pse-gray" />}
        />
        <SummaryCard
          id={2}
          name="Tổng đơn hàng"
          growth={20}
          value={summary?.countOrder}
          type="INFORMATION"
          icon={<ClipboardList size={18} className="text-pse-gray" />}
        />
        <SummaryCard
          id={3}
          name="Lượt xem"
          growth={20}
          value={summary?.countViewer}
          type="INFORMATION"
          icon={<Eye size={18} className="text-pse-gray" />}
        />
        <SummaryCard
          id={4}
          name="Vé đã bán"
          growth={20}
          value={summary?.countTicket}
          type="INFORMATION"
          icon={<Ticket size={18} className="text-pse-gray" />}
        />
      </div>
      <Card className="my-6 bg-background h-auto text-foreground shadow-md rounded-2xl border">
        <div className="w-full flex">
          <img src={eventDetail.bannerURL} className="w-[640px] rounded-2xl" />
          <div className="w-full m-6 flex flex-col gap-2">
            <div className="font-bold text-2xl">{eventDetail.eventName}</div>
            <div className="flex gap-1 items-center font-semibold text-lg">
              <MapPin size={18} />
              <span> {eventDetail.locationName}</span>
            </div>
            <div className="flex w-full top-4 text-gray-400">
              {eventDetail.address +
                ", " +
                eventDetail.ward +
                ", " +
                eventDetail.district +
                ", " +
                eventDetail.city}
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-background h-auto text-foreground shadow-md rounded-2xl border">
        <div
          className="p-6 min-w-md"
          dangerouslySetInnerHTML={{ __html: eventDetail?.description as any }}
        />
      </Card>
    </div>
  );
};

export default SummaryRevenue;
