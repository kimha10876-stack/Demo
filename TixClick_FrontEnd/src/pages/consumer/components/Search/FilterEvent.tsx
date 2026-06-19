import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import { Filter } from "lucide-react";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Slider } from "../../../../components/ui/slider";

type Props = {
  selectedArea: string;
  onChangeArea: (e: string) => void;
  typeEvent: string;
  onChangeTypeEvent: (e: string) => void;
  priceRange: number[];
  onChangePriceRange: (e: number[]) => void;
};

export const FilterEvent = ({
  typeEvent,
  onChangeTypeEvent,
  selectedArea,
  onChangeArea,
  priceRange,
  onChangePriceRange,
}: Props) => {
  return (
    <Card className="bg-transparent text-white shadow-lg">
      <CardHeader className="text-xl font-semibold flex items-center gap-2 pb-2">
        <Filter size={20} /> Bộ lọc
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Loại sự kiện */}
        <div className="space-y-1">
          <Label className="text-sm text-gray-300">Loại sự kiện</Label>
          <Select value={typeEvent} onValueChange={(e) => onChangeTypeEvent(e)}>
            <SelectTrigger className="bg-[#1e1e1e] border border-gray-600 text-white">
              <SelectValue placeholder="Chọn loại sự kiện" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] text-white border-gray-700">
              <SelectItem value={"0"}>Tất cả thể loại</SelectItem>
              <SelectItem value={"1"}>Âm nhạc</SelectItem>
              <SelectItem value={"2"}>Thể thao</SelectItem>
              <SelectItem value={"3"}>Sân khấu & Nghệ thuât</SelectItem>
              <SelectItem value={"4"}>Thể loại khác</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Khu vực */}
        <div className="space-y-1">
          <Label className="text-sm text-gray-300">Khu vực</Label>
          <Select value={selectedArea} onValueChange={(e) => onChangeArea(e)}>
            <SelectTrigger className="bg-[#1e1e1e] border border-gray-600 text-white">
              <SelectValue placeholder="Chọn khu vực" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] text-white border-gray-700">
              <SelectItem value="all">Toàn quốc</SelectItem>
              <SelectItem value="Thành phố Hồ Chí Minh">TP.HCM</SelectItem>
              <SelectItem value="Thành phố Hà Nội">Hà Nội</SelectItem>
              <SelectItem value="Thành phố Đà Nẵng">Đà Nẵng</SelectItem>
              <SelectItem value="other">Khu vực khác</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Giá vé */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-300">Khoảng giá (đ)</Label>
          <Slider
            min={0}
            max={2000000}
            step={10000}
            value={priceRange}
            onValueChange={(val) => onChangePriceRange(val)}
            className="slider-custom"
          />
          <div className="text-sm text-gray-400">
            Từ {priceRange[0].toLocaleString("vi-VN")} đ trở lên
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
