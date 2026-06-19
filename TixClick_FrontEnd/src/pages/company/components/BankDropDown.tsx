import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

type Bank = {
  id: string;
  bankName: string;
};

type Props = {
  banks: Bank[];
  selectedBankName: string;
  onChange: (bankName: string) => void;
};

const BankDropdown: React.FC<Props> = ({
  banks,
  selectedBankName,
  onChange,
}) => {
  return (
    <div className="w-full mb-4 px-1">
      <label className="block mb-1 font-medium text-white">
        Chọn ngân hàng
      </label>
      <Select value={selectedBankName} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-transparent text-white">
          <SelectValue placeholder="-- Chọn ngân hàng --" />
        </SelectTrigger>
        <SelectContent>
          {banks.map((bank) => (
            <SelectItem key={bank.id} value={bank.bankName}>
              {bank.bankName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BankDropdown;
