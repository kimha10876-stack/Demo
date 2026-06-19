import { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

interface Province {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
  province_code: number;
}

interface Ward {
  code: number;
  name: string;
  district_code: number;
}

interface VietnamAddressValue {
  province: string;
  district: string;
  ward: string;
  address: string;
}

interface Props {
  value: VietnamAddressValue;
  onChange: (value: VietnamAddressValue) => void;
}

const VietNamAddressPicker = ({ value, onChange }: Props) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState<
    number | undefined
  >();
  const [selectedDistrictId, setSelectedDistrictId] = useState<
    number | undefined
  >();

  const fetchData = async () => {
    const [p, d, w] = await Promise.all([
      axios.get("https://provinces.open-api.vn/api/"),
      axios.get("https://provinces.open-api.vn/api/d/"),
      axios.get("https://provinces.open-api.vn/api/w/"),
    ]);
    setProvinces(p.data);
    setDistricts(d.data);
    setWards(w.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (value.province) {
      const province = provinces.find((p) => p.name === value.province);
      if (province) {
        setSelectedProvinceId(province.code);
      }
    }
  }, [value.province, provinces]);

  useEffect(() => {
    if (value.district) {
      const district = districts.find((d) => d.name === value.district);
      if (district) {
        setSelectedDistrictId(district.code);
      }
    }
  }, [value.district, districts]);

  const handleSelectProvince = (provinceName: string) => {
    if (provinceName === value.province) return; // Nếu trùng, không làm gì cả
    const province = provinces.find((p) => p.name === provinceName);
    setSelectedProvinceId(province?.code);
    setSelectedDistrictId(undefined); // Reset district
    onChange({ province: provinceName, district: "", ward: "", address: "" });
  };

  const handleSelectDistrict = (districtName: string) => {
    if (districtName === value.district) return;
    const district = districts.find((d) => d.name === districtName);
    setSelectedDistrictId(district?.code);
    onChange({ ...value, district: districtName, ward: "" });
  };

  const handleSelectWard = (wardName: string) => {
    if (wardName === value.ward) return;
    onChange({ ...value, ward: wardName });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, address: e.target.value });
  };

  const filteredDistricts = districts.filter(
    (d) => d.province_code === selectedProvinceId
  );

  const filteredWards = wards.filter(
    (w) => w.district_code === selectedDistrictId
  );

  return (
    <div className="grid grid-cols-2 gap-4 mx-1">
      {/* Province */}
      <div>
        <label className="block text-sm font-bold mb-1 text-white">
          Tỉnh / Thành phố
        </label>
        <Select value={value.province} onValueChange={handleSelectProvince}>
          <SelectTrigger className="w-full bg-transparent text-white">
            <SelectValue placeholder="-- Chọn tỉnh / thành phố --" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((p) => (
              <SelectItem key={p.code} value={p.name}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* District */}
      <div>
        <label className="block text-sm font-bold mb-1 text-white">
          Quận / Huyện
        </label>
        <Select
          value={value.district}
          onValueChange={handleSelectDistrict}
          disabled={!selectedProvinceId}
        >
          <SelectTrigger className="w-full bg-transparent text-white">
            <SelectValue placeholder="-- Chọn quận / huyện --" />
          </SelectTrigger>
          <SelectContent>
            {filteredDistricts.map((d) => (
              <SelectItem key={d.code} value={d.name}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ward */}
      <div>
        <label className="block text-sm font-bold mb-1 text-white">
          Phường / Xã
        </label>
        <Select
          value={value.ward}
          onValueChange={handleSelectWard}
          disabled={!selectedDistrictId}
        >
          <SelectTrigger className="w-full bg-transparent text-white">
            <SelectValue placeholder="-- Chọn phường / xã --" />
          </SelectTrigger>
          <SelectContent>
            {filteredWards.map((w) => (
              <SelectItem key={w.code} value={w.name}>
                {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Address input */}
      <div>
        <label className="block text-sm font-bold mb-1 text-white">
          Số nhà, tên đường
        </label>
        <Input
          className="bg-transparent text-white"
          type="text"
          value={value.address}
          onChange={handleAddressChange}
          placeholder="Số nhà, tên đường"
        />
      </div>
    </div>
  );
};

export default VietNamAddressPicker;
