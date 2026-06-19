import { formatMoney } from "../../../../lib/utils";

type Props = {
  maxPrice: number;
  onChange: (newMaxPrice: number) => void;
  maxLimit?: number;
};

const PriceRangeSlider = ({
  maxPrice,
  onChange,
  maxLimit = 1000000,
}: Props) => {
  return (
    <div className="w-full">
      <label className="block font-semibold mb-2">Khoảng giá</label>
      <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
        <span>{formatMoney(0)}</span>
        <span>{formatMoney(maxPrice)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={maxLimit}
        step={100000}
        value={maxPrice}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-pse-black"
      />
    </div>
  );
};

export default PriceRangeSlider;
