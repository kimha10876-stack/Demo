import { TiDeleteOutline } from "react-icons/ti";
import { useState } from "react";
import DateTimePicker from "./DateTimePicker";

const EventActivityList = () => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  // const [endTime, setEndTime] = useState<Date | null>(null);
  console.log(startTime);
  return (
    <div className="bg-pse-black-light my-4 p-4 text-[16px] rounded-lg shadow-box">
      <div className="flex justify-between items-center">
        <p>Ngày sự kiện</p>
        <TiDeleteOutline color="white" size={26} />
      </div>
      <div className="flex flex-col lg:flex-row">
        <DateTimePicker label="Thời gian bắt đầu" onChange={setStartTime} />
        {/* <DateTimePicker label="Thời gian kết thúc" onChange={setEndTime} /> */}
      </div>
    </div>
  );
};

export default EventActivityList;
