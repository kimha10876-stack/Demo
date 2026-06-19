import React from "react";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { SortType } from "../../../interface/ticket/Ticket";
import { Input } from "../../../components/ui/input";
import { Search } from "lucide-react";

type TicketFilterProps = {
  sort: SortType;
  setSort: (e: string) => void;
  search: string;
  setSearch: (e: string) => void;
};

const TicketFilter: React.FC<TicketFilterProps> = ({
  sort,
  setSort,
  search,
  setSearch,
}) => {
  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  return (
    <div className="flex justify-between items-center">
      <div className="relative">
        <Search className="absolute top-1/2 left-2 -translate-y-1/2" />
        <Input
          value={search}
          placeholder="Tìm kiếm tên sự kiện"
          onChange={handleChangeSearch}
          className="bg-transparent text-white pl-10"
        />
      </div>
      <Select value={sort} onValueChange={(e: string) => setSort(e)}>
        <SelectTrigger className="w-[200px] text-black">
          <SelectValue placeholder="Sắp xếp theo ngày" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="DESC">Mới nhất</SelectItem>
          <SelectItem value="ASC">Cũ nhất</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TicketFilter;
