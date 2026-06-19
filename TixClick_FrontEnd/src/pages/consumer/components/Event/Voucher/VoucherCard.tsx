import { Card } from "../../../../../components/ui/card";
import {
  VoucherResponse,
  VoucherStatus,
} from "../../../../../interface/company/Voucher";
import { formatDateVietnamese } from "../../../../../lib/utils";
import { TicketMinus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

type Props = {
  voucher: VoucherResponse;
  onChangeStatus: (voucher: number, newStatus: VoucherStatus) => void;
  deleteVoucher: (voucher: VoucherResponse) => void;
};

const VoucherCard = ({ voucher, deleteVoucher }: Props) => {
  const handleToggle = (voucher: VoucherResponse) => {
    deleteVoucher(voucher);
  };

  const renderStatus = (status: VoucherStatus) => {
    const baseClass = "text-xs font-semibold px-2 py-1 rounded";
    switch (status) {
      case "ACTIVE":
        return (
          <span className={`${baseClass} text-green-600 bg-green-100`}>
            Đang hoạt động
          </span>
        );
      case "INACTIVE":
        return (
          <span className={`${baseClass} text-gray-600 bg-gray-100`}>
            Vô hiệu hóa
          </span>
        );
      case "EXPIRED":
        return (
          <span className={`${baseClass} text-red-600 bg-red-100`}>
            Hết hạn
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative flex items-center gap-4 max-w-md shadow-md rounded-lg border bg-white px-6 py-4 border-gray-200"
    >
      <div className="absolute bg-pse-green left-0 top-0 h-full w-2 rounded-l-lg"></div>
      <div className="hidden lg:flex lg:flex-col items-center w-[20%] bg-pse-green-second text-white p-4 rounded-lg">
        <TicketMinus />
        <p className="font-semibold">{voucher.discount}%</p>
      </div>
      <div className="flex flex-col">
        <p className="flex items-center gap-4 font-bold text-base mb-1">
          {voucher.voucherCode} <p>{renderStatus(voucher.status)}</p>
        </p>
        <p className="font-bold text-sm max-w-sm truncate">
          {voucher.voucherName}
        </p>
        <p className="text-xs">
          Hạn sử dụng:{" "}
          <span className="text-pse-green-second">
            {formatDateVietnamese(voucher.startDate)} -{" "}
            {formatDateVietnamese(voucher.endDate)}
          </span>
        </p>
      </div>
      <button
        onClick={() => handleToggle(voucher)}
        className="flex flex-col ml-auto items-center"
      >
        <Trash2 />
      </button>
    </MotionCard>
  );
};

export default VoucherCard;
