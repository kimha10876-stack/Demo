import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import DashDivider from "../../../components/Divider/DashDivider";
import Popup from "../../../components/Popup/Popup";
import { eventTypes } from "../../../constants/constants";
import useTicketsPurchases from "../../../hooks/useTicketPurchases";
import { OrderResponse, SortType } from "../../../interface/ticket/Ticket";
import {
  formatDateVietnamese,
  formatTimeFe,
  parseSeatCode,
} from "../../../lib/utils";
import { useNavigate } from "react-router";
import { formatMoney } from "../../DataTranfer";
import TicketFilter from "./TicketFilter";
import Pagination from "../../../components/Pagination/Pagination";
import TicketList from "./TicketList";

export default function TicketManagement() {
  const navigate = useNavigate();
  const {
    ticketPurchases,
    loading,
    pagination: { currentPage, totalPages, totalElements, pageSize },
    setPage,
    sort,
    setSort,
    searchEventName,
    setSearchEventName,
  } = useTicketsPurchases();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<OrderResponse>();
  const [showZoomedQR, setShowZoomedQR] = useState(false);

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleSelectedTicket = (ticket: OrderResponse) => {
    setSelectedTicket(ticket);
    handleOpenPopup();
  };

  const saveTicketPurchaseId = (ticket: OrderResponse | undefined) => {
    console.log(ticket);
    navigate("/change-ticket", { state: ticket });
  };
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col p-6 bg-[#1e1e1e]">
      <div className="border-b mb-4 border-gray-800">
        <nav className="text-sm text-gray-400 mb-2">
          <span className="hover:text-white">Trang chủ</span>
          <span className="mx-2">/</span>
          <span className="text-white">Vé đã mua</span>
        </nav>
      </div>
      <TicketFilter
        sort={sort}
        setSort={(e: string) => setSort(e as SortType)}
        search={searchEventName}
        setSearch={setSearchEventName}
      />
      <section className="mt-auto">
        <TicketList
          ticketList={ticketPurchases}
          clickOpenPopup={handleOpenPopup}
          onClickSelectTicket={handleSelectedTicket}
          loading={loading}
        />
      </section>
      <section className="mt-auto">
        <Pagination
          currentPage={currentPage + 1}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage - 1)}
        />
      </section>

      <Popup
        key={"order-detail"}
        className="w-auto max-w-sm p-4"
        isOpen={openPopup}
        onClose={() => setOpenPopup(false)}
      >
        <div className="overflow-x-hidden text-black">
          <div className="relative flex flex-col justify-center items-center">
            <button
              onClick={() => saveTicketPurchaseId(selectedTicket)}
              className="absolute top-2 right-0 bg-black hover:bg-opacity-80 text-white px-2 py-1 rounded-md"
            >
              Đổi vé
            </button>
            {selectedTicket?.totalDiscount != selectedTicket?.totalPrice && (
              <div className="absolute top-0 left-0 -rotate-45 translate-y-8 text-white bg-pse-green-second rounded-md px-2 z-10">
                Đã áp mã
              </div>
            )}
            <img
              src={selectedTicket?.banner}
              alt=""
              className="w-40 h-20 rounded-md"
            />
            <div className="font-semibold mt-1 text-black text-xl text-center break-words">
              {selectedTicket?.eventName}
            </div>
            <div className="flex gap-1 items-center">
              {/* <span className="text-pse-gray font-medium">
                {selectedTicket?.ticketType}
              </span> */}
              <p
                style={{
                  backgroundColor: eventTypes.find(
                    (x) => x.id == selectedTicket?.eventCategoryId
                  )?.color,
                }}
                className="text-white text-xs text-center font-medium rounded-md w-fit px-2 py-1"
              >
                {
                  eventTypes.find(
                    (x) => x.id == selectedTicket?.eventCategoryId
                  )?.vietnamName
                }
              </p>
            </div>
          </div>
          <DashDivider />
          <div className="space-y-2">
            <p className="break-words">
              <span className="text-pse-green font-semibold">
                {selectedTicket?.locationName}
              </span>{" "}
              {"- "}
              {selectedTicket?.location}
            </p>
            <p className="w-full truncate">
              Giờ bắt đầu: {formatTimeFe(selectedTicket?.eventStartTime)} {"-"}
              <span className="font-semibold">
                {formatDateVietnamese(selectedTicket?.eventDate.toString())}
              </span>
            </p>
          </div>
          <DashDivider />
          {selectedTicket?.ticketPurchases.map((item) => (
            <div className="flex gap-2 mb-1 items-center">
              <p className="bg-pse-green text-white rounded-full px-1">
                x{item.quantity}
              </p>
              {/* <p className="text-sm font-semibold">{item.ticketType}</p> */}
              <div>
                Ghế:{" "}
                <span className="font-bold">
                  {parseSeatCode(item?.seatCode)}
                  {" - "}
                  <span className="font-semibold">{item.zoneName}</span>
                </span>{" "}
              </div>

              <div className="ml-auto">
                <span className="font-bold">{formatMoney(item.price)}</span>{" "}
              </div>
            </div>
          ))}
          <div className="flex justify-center mt-4">
            <div
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer"
            >
              <QRCodeSVG
                value={selectedTicket?.qrCode as string}
                size={160}
                bgColor={"#FFFFFF"}
                level={"L"}
              />
            </div>

            {isModalOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => setIsModalOpen(false)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white p-4 rounded-lg shadow-lg"
                >
                  <QRCodeSVG
                    value={selectedTicket?.qrCode as string}
                    size={320}
                    bgColor={"#FFFFFF"}
                    level={"L"}
                  />
                </div>
              </div>
            )}
          </div>

          <DashDivider />
          <section className="flex justify-between text-black">
            <div>
              <h1 className="text-left">Mã vé</h1>
              <p className="text-left font-bold">{selectedTicket?.orderId}</p>
            </div>
            <div>
              <h1 className="text-center">Số lượng</h1>
              <p className="text-center font-bold">
                {selectedTicket?.quantityOrdered}
              </p>
            </div>
            <div>
              <h1 className="text-right">Giá</h1>
              <p className="text-right font-bold">
                {selectedTicket?.totalDiscount != selectedTicket?.totalPrice ? (
                  <p className="flex flex-col">
                    <span className="line-through text-pse-gray/70 font-medium">
                      {formatMoney(selectedTicket?.totalPrice)}
                    </span>
                    <span>{formatMoney(selectedTicket?.totalDiscount)}</span>
                  </p>
                ) : (
                  <span>{formatMoney(selectedTicket?.totalPrice)}</span>
                )}
              </p>
            </div>
          </section>
          {/* <DashDivider /> */}
          {/* <Button onClick={() => saveTicketPurchaseId(selectedTicket)}>
            Đổi vé
          </Button> */}
        </div>
      </Popup>

      <Popup
        key={"show-qr"}
        isOpen={showZoomedQR}
        onClose={() => setShowZoomedQR(false)}
        className="p-4"
      >
        <div className="flex flex-col items-center justify-center text-black">
          <h2 className="text-lg font-semibold mb-2">Mã QR của bạn</h2>
          <QRCodeSVG
            value={selectedTicket?.qrCode as string}
            size={300}
            bgColor={"#FFFFFF"}
            level={"L"}
          />
        </div>
      </Popup>
    </div>
  );
}
