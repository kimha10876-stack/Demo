import { Button } from "../ui/button";
import { Input } from "../ui/input";

type Props = {
  placeholder?: string;
  type?: string;
  onSubmit?: () => void;
  buttonLabel: string;
};

export function InputWithButton({
  placeholder,
  type,
  onSubmit,
  buttonLabel,
}: Props) {
  return (
    <div className="flex w-full max-w-sm items-center mx-auto space-x-2">
      <Input className="bg-transparent" type={type} placeholder={placeholder} />
      <Button
        className="bg-white text-black hover:bg-opacity-80"
        onSubmit={onSubmit}
        type="submit"
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
