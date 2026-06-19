import { MoveUpLeft } from "lucide-react";

type StatisticProps = {
  label: string;
  percent?: number;
  quantity: number;
  subLabel: string;
};

const Statistic = ({ label, percent, quantity, subLabel }: StatisticProps) => {
  return (
    <div className="w-full h-auto bg-transparent border border-[#bdbdbd] rounded-lg text-[16px] p-6">
      <div className="flex gap-2 items-center font-bold ">
        {label}
        <span className="inline-flex items-center gap-1 bg-pse-success bg-opacity-20 px-2 py-1 rounded-[50px] text-[14px] font-normal text-pse-success">
          <MoveUpLeft size={16} strokeWidth={1} /> {percent?.toFixed(1)}%
        </span>
      </div>
      <div className="font-bold text-[28px]">{quantity}</div>
      <div className="text-[14px] text-pse-gray">{subLabel}</div>
    </div>
  );
};

export default Statistic;
