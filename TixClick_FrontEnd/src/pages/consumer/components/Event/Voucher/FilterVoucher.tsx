import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";

type Props = {
  status: string;
  onChange: (e: string) => void;
};

const FilterVoucher = ({ status, onChange }: Props) => {
  return (
    <div>
      <Select value={status.toLowerCase()} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Chọn trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="inactive">Vô hiệu hóa</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="expired">Hết hạn</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterVoucher;
