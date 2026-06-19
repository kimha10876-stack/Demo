import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { EventActivityResponse } from "../../../../../interface/event/EventActivity";

type Props = {
  activity: EventActivityResponse[] | undefined;
  selectedActivity: EventActivityResponse | undefined;
  onChangeActivity: (activityName: string) => void;
};

export function BuyersFiler({
  activity,
  onChangeActivity,
  selectedActivity,
}: Props) {
  return (
    <div className="flex items-center gap-4">
      <Select
        value={selectedActivity?.eventActivityId.toString()}
        onValueChange={(value) => onChangeActivity(value)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Chọn hoạt động" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Hoạt động</SelectLabel>
            {activity?.map((item) => (
              <SelectItem
                key={item.eventActivityId}
                value={item.eventActivityId.toString()}
              >
                {item.activityName}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {!selectedActivity && (
        <div className="text-red-700">Bạn chưa chọn họat động</div>
      )}
    </div>
  );
}
