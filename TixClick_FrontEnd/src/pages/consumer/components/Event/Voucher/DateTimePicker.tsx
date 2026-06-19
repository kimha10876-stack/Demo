// components/ui/DateTimePicker.tsx
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../components/ui/popover";
import { Button } from "../../../../../components/ui/button";
import { cn } from "../../../../../lib/utils";
import { Calendar } from "../../../../../components/ui/calendar";

type Props = {
  date?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
};

export function DateTimePicker({ date, onChange, placeholder }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date
            ? format(date, "dd/MM/yyyy HH:mm")
            : placeholder || "Chọn ngày giờ"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              // Gán giờ hiện tại vào ngày chọn (để có cả date + time)
              const now = new Date();
              const withTime = new Date(
                selectedDate.setHours(now.getHours(), now.getMinutes())
              );
              onChange(withTime);
              setOpen(false);
            }
          }}
          disabled={{ before: new Date() }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
