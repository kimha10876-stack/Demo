import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "./DateTimePicker.css"; // Import file CSS tùy chỉnh

interface DateTimePickerProps {
  onChange?: (date: Date | null) => void;
  label: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ label, onChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (onChange) onChange(date);
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <label className="text-lg font-medium">{label}</label>
      <div className="relative">
        {" "}
        {/* Tăng kích thước rộng hơn */}
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          showTimeSelect
          dateFormat="Pp"
          className="custom-datepicker p-2 border rounded-md w-full pr-10"
        />
        <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
};

export default DateTimePicker;
