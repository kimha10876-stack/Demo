import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface TextInputProps {
  maxLength: number;
  label: string;
  text: string | undefined;
  setText: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  isTextArea?: boolean; // thêm props mới
}

export default function TextInput({
  maxLength,
  label,
  text,
  setText,
  className,
  isTextArea,
}: TextInputProps) {
  const [nullError, setNullError] = useState<boolean>(false);
  const [isMaxLength, setIsMaxLength] = useState<boolean>(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;

    setNullError(value.length === 0);
    setIsMaxLength(value.length >= maxLength);

    setText(value);
  };

  return (
    <div
      className={`flex flex-col w-full items-start rounded-lg px-1 ${className}`}
    >
      <label className="text-white mb-[2px]">{label}</label>

      {isTextArea ? (
        <Textarea
          value={text}
          onChange={handleChange}
          placeholder={label}
          maxLength={maxLength}
          className="px-2 py-1 outline-none text-[14px] bg-transparent text-white w-full rounded-md resize-none"
          rows={4} // có thể chỉnh số dòng tùy ý
        />
      ) : (
        <Input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder={label}
          className="px-2 py-1 outline-none text-[14px] text-white bg-transparent w-full rounded-md"
          maxLength={maxLength}
        />
      )}

      <div className="flex justify-between w-full text-sm text-white/80 mt-1">
        {nullError ? (
          <p className="text-pse-error">Vui lòng điền thông tin</p>
        ) : (
          <p></p>
        )}
        <p className={`${isMaxLength ? "text-pse-error" : "text-white/80"}`}>
          {text?.length ?? 0}/{maxLength}
        </p>
      </div>
    </div>
  );
}
