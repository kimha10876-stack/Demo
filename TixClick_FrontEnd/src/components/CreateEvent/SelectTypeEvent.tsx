import { EventType } from "../../interface/EventInterface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  label: string;
  listType: EventType[];
  choice: string;
  setChoice: React.Dispatch<React.SetStateAction<string>>;
  selectedId: number | null;
};

const SelectTypeEvent = ({
  label,
  listType,
  choice,
  setChoice,
  selectedId,
}: Props) => {
  return (
    <div className="flex flex-col items-start gap-1 p-2 w-full">
      <label htmlFor="selects" className="text-white text-sm font-bold">
        {label}
      </label>
      <Select value={choice} onValueChange={setChoice}>
        <SelectTrigger className="w-full bg-transparent text-white">
          <SelectValue placeholder="Vui lòng chọn" />
        </SelectTrigger>
        <SelectContent>
          {listType.map((type) => (
            <SelectItem
              key={type.id}
              value={type.id.toString()}
              className={`${
                selectedId === type.id
                  ? "bg-pse-green text-white font-semibold"
                  : ""
              }`}
            >
              {type.vietnamName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectTypeEvent;
