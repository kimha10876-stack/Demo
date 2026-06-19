import { FileSpreadsheet } from "lucide-react";
import { Button } from "../../../../../components/ui/button";

type Props = {
  exportExcelFile: () => void;
};
const ExportBuyers = ({ exportExcelFile }: Props) => {
  return (
    <Button
      onClick={exportExcelFile}
      className=" bg-gradient-to-tr from-[#217346] via-[#21A366] to-[#33A852] hover:bg-[#1e5f3b] text-white gap-2"
    >
      <FileSpreadsheet className="w-4 h-4" />
      Tải xuống Excel
    </Button>
  );
};

export default ExportBuyers;
