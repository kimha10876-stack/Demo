import { Input } from "../ui/input";
import { Label } from "../ui/label";

type TimeInputProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
};

const TimeInput = ({
  label,
  id,
  value,
  onChange,
  className,
  error,
}: TimeInputProps) => (
  <div className="grid gap-1">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`border ${
        error ? "border-red-500" : "border-input"
      } bg-background text-white shadow-sm ${className}`}
    />
    {error && <span className="text-sm text-red-500">{error}</span>}
  </div>
);

export default TimeInput;
