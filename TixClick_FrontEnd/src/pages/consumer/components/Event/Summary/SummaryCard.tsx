import { Card, CardContent } from "../../../../../components/ui/card";
import { formatMoney } from "../../../../../lib/utils";
import { Summary } from "./SummaryRevenue";

const SummaryCard = ({ name, value, icon, type }: Summary) => {
  return (
    <Card className="flex flex-col bg-background text-foreground shadow-md rounded-2xl border w-sm">
      <div className="font-semibold px-6 pt-6 mb-4">
        <div className="flex justify-between items-center text-lg">
          {name}
          <span>{icon}</span>
        </div>
      </div>
      <CardContent className="font-bold text-2xl">
        {!value && (
          <span className="text-sm text-pse-gray">Chưa có dữ liệu</span>
        )}
        {type == "REVENUE" && value ? formatMoney(value) : value}

        <div className="text-pse-gray text-xs mt-1"></div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
