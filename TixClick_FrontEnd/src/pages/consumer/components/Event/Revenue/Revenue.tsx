import { useEffect, useState } from "react";
import { RevenueLineChart } from "./RevenueLineChart";
import TicketsBarChart from "./TicketsBarChart";
import TicketsPieChart from "./TicketsPieChart";
import TicketsRevenuePieChart from "./TicketsRevenuePieChart";
import { RevenueReponse } from "../../../../../interface/revenue/Revenue";
import { useParams } from "react-router";
import eventApi from "../../../../../services/eventApi";
import EmptyList from "../../../../../components/EmptyList/EmptyList";

const Revenue = () => {
  const { eventId } = useParams();
  const [revenue, setRevenue] = useState<RevenueReponse>();

  const fetchRevenue = async () => {
    const response = await eventApi.getRevenue(Number(eventId));
    if (response.data.result) {
      setRevenue(response.data.result[0]);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, [eventId]);

  if (!revenue)
    return (
      <div className="text-black flex items-center justify-center h-[calc(100vh-70px)]">
        <EmptyList label="Chưa có doanh thu cho sự kiện này" />
      </div>
    );

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <div className="font-bold text-3xl mb-8">Doanh thu</div>
      <div className="grid lg:grid-cols-2 gap-8">
        <TicketsBarChart data={revenue?.eventActivityDashbroadResponseList} />
        <TicketsPieChart data={revenue?.eventActivityDashbroadResponseList} />
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <RevenueLineChart
          data={revenue?.eventActivityRevenueReportResponseList}
        />
        <TicketsRevenuePieChart
          data={revenue?.ticketReVenueDashBoardResponseList}
        />
      </div>
    </div>
  );
};

export default Revenue;
