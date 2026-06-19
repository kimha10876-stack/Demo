import { useParams } from "react-router";
import useEventActivitybyEventId from "../../../../../hooks/useEventActivitybyEventId";
import { BuyersFiler } from "./BuyerFilter";
import { useState } from "react";
import { EventActivityResponse } from "../../../../../interface/event/EventActivity";
import BuyerList from "./BuyerList";
import useConsumerWithOrder from "../../../../../hooks/useConsumerWithOrder";
import { Consumer } from "../../../../../interface/company/Consumer";
import ExportBuyers from "./ExportBuyers";
import eventApi from "../../../../../services/eventApi";
import { toast } from "sonner";
import { TOAST_MESSAGE } from "../../../../../constants/constants";
import { CircleCheck, CircleX } from "lucide-react";

const Buyers = () => {
  const { eventId } = useParams();
  const { activity } = useEventActivitybyEventId(Number(eventId));
  const [selectedActivity, setSelectedActivity] = useState<
    EventActivityResponse | undefined
  >(undefined);
  const { consumers } = useConsumerWithOrder(selectedActivity?.eventActivityId);
  const [selectedConsumer, setSelectedConsumer] = useState<Consumer>();

  console.log(consumers);

  const onChanngeActivity = (activityId: string) => {
    const selectActivity = activity?.find(
      (x) => x.eventActivityId.toString() === activityId
    );
    setSelectedActivity(selectActivity);
  };

  const onChangeConsumer = (consumer: Consumer) => {
    setSelectedConsumer(consumer);
  };

  const exportExcelFile = async () => {
    if (!selectedActivity) {
      toast.warning(TOAST_MESSAGE.emptyActivity);
      return;
    }

    try {
      const res = await eventApi.exportConsumers(
        selectedActivity?.eventActivityId
      );

      // Tạo URL từ blob
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      // Tạo thẻ <a> ẩn và click để tải
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Danh_sach_khach_hang.xlsx"); // đặt tên file
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Giải phóng URL sau khi xài
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Tải file thất bại", err);
    }
  };

  return (
    <div className="p-6 text-black">
      <div className="flex items-center justify-between">
        <BuyersFiler
          activity={activity}
          selectedActivity={selectedActivity}
          onChangeActivity={onChanngeActivity}
        />
        <div className="flex gap-4">
          <span className="flex flex-col items-center">
            <CircleCheck className="stroke-green-700" />
            <p className="text-green-700 font-bold">Đã checkin</p>
          </span>
          <span className="flex flex-col items-center">
            <CircleX className="stroke-red-700" />
            <p className="text-red-700 font-bold">Chưa checkin</p>
          </span>
        </div>
        <ExportBuyers exportExcelFile={exportExcelFile} />
      </div>
      <BuyerList
        selectedConsumer={selectedConsumer}
        onChangeConsumer={onChangeConsumer}
        consumers={consumers}
        selectedActivity={selectedActivity}
      />
    </div>
  );
};

export default Buyers;
