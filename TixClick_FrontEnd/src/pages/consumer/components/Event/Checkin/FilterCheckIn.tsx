import { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { EventActivityResponse } from "../../../../../interface/event/EventActivity";

type Props = {
  eventActivity: EventActivityResponse[];
  selectedEventActId: string;
  setSelectedEventActId: Dispatch<SetStateAction<string>>;
};

const FilterCheckIn = ({
  eventActivity,
  selectedEventActId,
  setSelectedEventActId,
}: Props) => {
  return (
    <div className="flex items-center">
      <div className="text-2xl font-semibold">
        Checkin:
        <span className="font-semibold text-pse-gray">
          {" "}
          {eventActivity.find(
            (x) => x.eventActivityId.toString() == selectedEventActId
          )?.activityName || "Chưa chọn hoạt động"}
        </span>
      </div>
      <Select
        value={selectedEventActId}
        onValueChange={(e: string) => {
          setSelectedEventActId(e);
        }}
      >
        <SelectTrigger className="w-[180px] ml-auto">
          <SelectValue placeholder="Chọn hoạt động" />
        </SelectTrigger>
        <SelectContent>
          {eventActivity.map((eventAct) => (
            <SelectItem value={eventAct.eventActivityId.toString()}>
              {eventAct.activityName}{" "}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterCheckIn;
