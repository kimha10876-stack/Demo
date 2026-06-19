import VisaImg from "../../../assets/VisaTag.svg";

interface BankCardProps {
  bankName?: string;
  accountNumber?: string;
  className?: string;
  ownerCard?: string;
}

export default function BankCard({
  bankName,
  accountNumber,
  className,
  ownerCard,
}: BankCardProps) {
  return (
    <div
      className={`w-[343px] max-w-sm h-[218px] flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#FED4B4] to-[#3BB9A1] text-white p-6 shadow-xl ${className}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold">
          {bankName || "Tên ngân hàng"}
        </h2>
        <span className="text-sm opacity-80 italic">
          <img src={VisaImg} className="w-14" />
        </span>
      </div>

      <div className="mb-4">
        <p className="tracking-wider font-semibold text-2xl">
          {accountNumber?.replace(/(\d{4})(?=\d)/g, "$1 ") ||
            "____ ____ ____ ____"}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs">Chủ sở hữu</p>
          <p className="text-sm tracking-wider font-bold">
            {ownerCard || "_______"}
          </p>
        </div>
        <div className="flex">
          <div className="w-[28px] h-[28px] bg-[#E33A24] rounded-full -mr-[10%]"></div>
          <div className="w-[28px] h-[28px] bg-[#F8CB2E]/80 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
