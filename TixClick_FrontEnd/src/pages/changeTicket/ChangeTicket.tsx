import { NavLink, useLocation, useNavigate } from "react-router";
import Header from "../../components/Header/Header";
import { OrderResponse } from "../../interface/ticket/Ticket";
import { useEffect, useState } from "react";
import { Checkbox } from "../../components/ui/checkbox";
import { formatMoney, parseSeatCode } from "../../lib/utils";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  clearTicketPurchase,
  setTicketPurchase,
} from "../../redux/features/ticketPurchase/ticketPurchaseSlice";
import { Button } from "../../components/ui/button";

const ChangeTicket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state: OrderResponse = location.state;
  const oldTicketPurchase = useAppSelector((state) => state.ticketPurchase);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearTicketPurchase());
  }, []);

  const handleToggle = (ticketId: number, checked: boolean) => {
    const updatedIds = checked
      ? [...oldTicketPurchase.ticketPurchaseId, ticketId]
      : oldTicketPurchase.ticketPurchaseId.filter((id) => id !== ticketId);

    // Tìm danh sách vé đã được chọn theo ID
    const selectedTickets = state.ticketPurchases.filter((ticket) =>
      updatedIds.includes(ticket.ticketPurchaseId)
    );

    // Tính lại quantity dựa trên seatCode
    const newQuantity = selectedTickets.reduce((acc, ticket) => {
      // Nếu có ghế thì cộng 1, nếu không thì cộng số lượng thực tế
      return acc + (ticket.seatCode ? 1 : ticket.quantity);
    }, 0);

    dispatch(
      setTicketPurchase({
        orderCode: state.orderCode,
        ticketPurchaseId: updatedIds,
        quantity: newQuantity,
      })
    );
  };

  const submitChangeSeatmap = () => {
    if (state.ishaveSeatmap) {
      navigate(
        `/event-detail/${state.eventId}/booking-ticket?eventId=${state.eventId}&eventActivityId=${state.eventActivityId}`,
        {
          state: {
            changeTicket: true,
          },
        }
      );
    } else {
      navigate(
        `/event-detail/${state.eventId}/booking-ticket-no-seatmap?eventId=${state.eventId}&eventActivityId=${state.eventActivityId}`,
        {
          state: {
            changeTicket: true,
          },
        }
      );
    }
  };

  const selectedTickets = state.ticketPurchases.filter((ticket) =>
    oldTicketPurchase.ticketPurchaseId.includes(ticket.ticketPurchaseId)
  );

  const totalSelectedPrice = selectedTickets.reduce(
    (acc, ticket) => acc + ticket.price * ticket.quantity,
    0
  );

  console.log(JSON.stringify(oldTicketPurchase, null, 2));

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1e1e1e" }}>
      <Header />

      {/* Hero Section */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-4 backdrop-blur-sm">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Quản lý vé
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Thay đổi vé sự kiện
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Chọn những vé bạn muốn thay đổi từ đơn hàng #{state.orderId}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        {/* Order Summary Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
              Danh sách vé trong đơn hàng
            </h2>
          </div>

          <div className="p-6 space-y-4">
            {state.ticketPurchases.map((ticket, index) => {
              const isSelected = oldTicketPurchase.ticketPurchaseId.includes(
                ticket.ticketPurchaseId
              );

              return (
                <div
                  key={ticket.ticketPurchaseId}
                  className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-xl ${
                    isSelected
                      ? "border-blue-400/50 bg-blue-900/30 shadow-lg shadow-blue-500/20"
                      : "border-gray-600/50 bg-gray-700/30 hover:border-gray-500/50 hover:bg-gray-600/20"
                  }`}
                >
                  <div className="flex items-center p-6 gap-4">
                    <div className="flex-shrink-0">
                      <Checkbox
                        id={`ticket-${ticket.ticketPurchaseId}`}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleToggle(ticket.ticketPurchaseId, !!checked)
                        }
                        className="w-5 h-5 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 border-gray-500 bg-gray-700"
                      />
                    </div>

                    <label
                      htmlFor={`ticket-${ticket.ticketPurchaseId}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-400/30">
                              Vé #{index + 1}
                            </span>
                            <h3 className="font-semibold text-white text-lg">
                              {ticket.ticketType}
                            </h3>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4 text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span>{ticket.zoneName}</span>
                            </div>

                            {ticket.seatCode && (
                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4 text-green-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zM3 9a2 2 0 012-2h14a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                  />
                                </svg>
                                <span>{parseSeatCode(ticket.seatCode)}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <span className="px-2 py-1 bg-gray-600/50 text-gray-200 rounded-lg">
                              Số lượng:{" "}
                              <span className="font-medium text-white">
                                {ticket.quantity}
                              </span>
                            </span>
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 border border-green-400/30 rounded-lg font-medium">
                              {formatMoney(ticket.price)}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className={`text-2xl font-bold ${
                              isSelected ? "text-blue-400" : "text-gray-400"
                            }`}
                          >
                            {formatMoney(ticket.price * ticket.quantity)}
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-blue-400">
                      <svg
                        className="absolute -top-4 -right-1 w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selection Summary */}
        {oldTicketPurchase.ticketPurchaseId.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Tóm tắt lựa chọn
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-blue-400">
                    {oldTicketPurchase.ticketPurchaseId.length}
                  </div>
                  <div className="text-sm text-gray-300">Vé đã chọn</div>
                </div>
                <div className="text-center p-4 bg-green-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-green-400">
                    {oldTicketPurchase.quantity}
                  </div>
                  <div className="text-sm text-gray-300">Tổng số lượng</div>
                </div>
                <div className="text-center p-4 bg-purple-500/20 border border-purple-400/30 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-purple-400">
                    {formatMoney(totalSelectedPrice)}
                  </div>
                  <div className="text-sm text-gray-300">Tổng giá trị</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <NavLink to="/ticketManagement" className="flex-1 sm:flex-none">
            <Button className="w-full sm:w-auto px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-600">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Quay lại
            </Button>
          </NavLink>

          <Button
            onClick={submitChangeSeatmap}
            disabled={oldTicketPurchase.ticketPurchaseId.length === 0}
            className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-blue-400/50"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Xác nhận thay đổi
          </Button>
        </div>

        {/* Help Text */}
        {oldTicketPurchase.ticketPurchaseId.length === 0 && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-xl text-amber-300 backdrop-blur-sm">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Vui lòng chọn ít nhất một vé để tiếp tục
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeTicket;
