import type React from "react";

import {
  ArrowLeft,
  Calendar,
  Loader2,
  LogIn,
  MapPin,
  Ticket,
} from "lucide-react";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import CustomDivider from "../components/Divider/CustomDivider";
import Header from "../components/Header/Header";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import useTicketByEventId, {
  type TicketResponse,
} from "../hooks/useTicketByEventId";
// import Popup from "../components/Popup/Popup";
// import DashDivider from "../components/Divider/DashDivider";
// import { eventTypes } from "../constants/constants";
// import { QRCodeSVG } from "qrcode.react";
// import useTicketPurchaseById from "../hooks/useTicketPurchaseById";
// import ticketPurchase from "../services/TicketPurchase/ticketPurchase";

import useWebSocket from "../hooks/useWebSocket";
import type { EventDetailResponse } from "../interface/EventInterface";
import {
  formatDateVietnamese,
  formatMoney,
  formatTimeFe,
  parseSeatCode,
} from "../lib/utils";
import { useAppSelector } from "../redux/hooks";
import eventApi from "../services/eventApi";
import seatmapApi from "../services/seatmapApi";
import ticketApi from "../services/ticketApi";
import { TicketPurchaseRequest } from "./TicketBookingNoneSeatmap";
import ticketPurchase from "../services/TicketPurchase/ticketPurchase";
import axios, { AxiosError } from "axios";

// type SeatStatus = "available" | "disabled"
// type ToolType = "select" | "add" | "remove" | "edit" | "move" | "addSeatType"
// type ViewMode = "edit" | "preview"
export type SectionType = "SEATED" | "STANDING";

const ticketPurchaseApi = {
  createTicketPurchase: async (data: any, accessToken: string) => {
    try {
      const response = await fetch(
        "https://tixclick.site/api/ticket-purchase/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create ticket purchase");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating ticket purchase:", error);
      throw error;
    }
  },
};

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export type SeatTypeEdit = {
  id: string;
  name: string;
  color: string;
  textColor: string;
  price: number;
  minQuantity?: number;
  maxQuantity?: number;
  eventId?: number;
  ticketId: number;
};

export interface ISeat {
  seatId: number;
  zoneActivityId?: number;
  id: string;
  row: number;
  column: number;
  status: string;
  price: number;
  seatTypeId: string;
  x?: number;
  y?: number;
}

export interface ISection {
  id: string;
  name: string;
  rows: number;
  columns: number;
  seats: ISeat[];
  x: number;
  y: number;
  width: number;
  height: number;
  type: SectionType;
  priceId?: string;
  price?: number; // Price for standing sections
  capacity?: number; // Capacity for standing sections
  isSave: boolean;
  zoneActivityId?: number; // Added to ensure we can access this property
}

// Helper function to generate seat label
const generateSeatLabel = (row: number, column: number): string => {
  // Convert row index to letter (0 -> A, 1 -> B, etc.)
  const rowLetter = String.fromCharCode(65 + row);
  // Column is 0-based, so add 1 for display
  const seatNumber = column + 1;
  return `${rowLetter}${seatNumber}`;
};

interface DraggableSectionProps {
  section: ISection;
  seatTypes: SeatTypeEdit[];
  getSeatColor: (seat: ISeat) => string;
  onSeatClick: (
    seat: ISeat,
    sectionName: string,
    quantityAction?: "increase" | "decrease"
  ) => void;
  selectedSeats: SelectedSeatInfo[];
  isLoggedIn: boolean;
  showLoginPrompt: () => void;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({
  section,
  seatTypes,
  getSeatColor,
  onSeatClick,
  selectedSeats,
  isLoggedIn,
  showLoginPrompt,
}) => {
  const [hoveredSeat, setHoveredSeat] = useState<ISeat | null>(null);

  const handleSeatClick = (seat: ISeat) => {
    if (!seat.status) return;

    // Check if user is logged in before allowing seat selection
    if (!isLoggedIn) {
      showLoginPrompt();
      return;
    }

    onSeatClick(seat, section.name);
  };

  return (
    <Draggable
      position={{ x: section.x, y: section.y }}
      disabled={true}
      bounds="parent"
    >
      <div
        className={`absolute w-auto h-auto p-4 overflow-visible `}
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div className="text-center text-gray-800 font-semibold mb-3">
          {section.name}
          {section.type == "STANDING" && (
            <div className="text-sm text-gray-600 mt-1">
              Khu vực đứng - {formatCurrency(section.price || 0)}
            </div>
          )}
        </div>
        {section.type == "STANDING" ? (
          <div
            className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg flex flex-col items-center justify-center text-gray-700 font-medium relative overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors"
            style={{
              width: section.width - 32,
              height: section.height - 32,
              minWidth: "180px",
              minHeight: "80px",
              // Add visual indication when selected
              border: selectedSeats.some(
                (s) => s.id === `standing-${section.id}`
              )
                ? "3px solid #059669"
                : "none",
              boxShadow: selectedSeats.some(
                (s) => s.id === `standing-${section.id}`
              )
                ? "0 0 0 2px #059669"
                : "none",
            }}
            onClick={() => {
              // Check if user is logged in before allowing seat selection
              if (!isLoggedIn) {
                showLoginPrompt();
                return;
              }

              // Create a "virtual seat" for the standing section
              const standingSeat: ISeat = {
                id: `standing-${section.id}`,
                seatId: Number.parseInt(section.id),
                row: 0,
                column: 0,
                status: "available",
                price: section.price || 0,
                seatTypeId: section.priceId || "",
                zoneActivityId: section.zoneActivityId,
              };
              onSeatClick(standingSeat, section.name);
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, #6b7280 0, #6b7280 1px, transparent 0, transparent 50%)`,
                  backgroundSize: "10px 10px",
                }}
              />
            </div>
            <div className="flex flex-col items-center relative z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mb-3 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs text-gray-500">
                Số lượng: {section.capacity || 0} vé
              </span>

              {/* Remove quantity controls from here - they will be in the sidebar instead */}
              {selectedSeats.some((s) => s.id === `standing-${section.id}`) && (
                <></>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-3 rounded-lg">
            {Array.from({ length: section.rows }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex text-gray-700 gap-2.5 mb-2.5">
                <div
                  style={{
                    width: `25px`,
                    textAlign: "center",
                    height: "25px",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600",
                  }}
                  className="bg-gray-700 bg-opacity-20 rounded-md"
                >
                  {String.fromCharCode(65 + rowIndex)}
                </div>
                {Array.from({ length: section.columns }).map((_, colIndex) => {
                  const seat = section.seats.find(
                    (s) => s.row == rowIndex && s.column == colIndex
                  );

                  if (!seat)
                    return (
                      <div
                        key={colIndex}
                        style={{
                          width: `25px`,
                          height: `25px`,
                          marginRight: "5px",
                        }}
                      ></div>
                    );
                  const seatColor = getSeatColor(seat);
                  const seatLabel = generateSeatLabel(rowIndex, colIndex);

                  return (
                    <div
                      key={colIndex}
                      className="flex items-center justify-center rounded-md shadow-sm transition-all duration-200 hover:shadow-md"
                      style={{
                        width: `25px`,
                        height: `25px`,
                        fontSize: `12px`,
                        backgroundColor: seatColor,
                        color:
                          seatTypes.find((type) => type.id == seat.seatTypeId)
                            ?.textColor || "#000000",
                        marginRight: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSeatClick(seat);
                      }}
                      onMouseEnter={() => setHoveredSeat(seat)}
                      onMouseLeave={() => setHoveredSeat(null)}
                    >
                      {seatLabel}

                      {hoveredSeat && hoveredSeat.id == seat.id && (
                        <div
                          className="absolute z-20 bg-gray-800 text-white p-3 rounded-lg text-xs whitespace-nowrap shadow-lg"
                          style={{
                            bottom: rowIndex == 0 ? "auto" : "100%",
                            top: rowIndex == 0 ? "100%" : "auto",
                            left: "50%",
                            transform: "translateX(-50%)",
                            marginBottom: rowIndex == 0 ? "0" : "2px",
                            marginTop: rowIndex == 0 ? "2px" : "0",
                          }}
                        >
                          <div className="mb-1">
                            Hàng: {String.fromCharCode(65 + rowIndex)}
                          </div>
                          <div className="mb-1">Ghế: {colIndex + 1}</div>
                          <div className="mb-1">
                            Loại ghế:{" "}
                            {seatTypes.find(
                              (type) => type.id == seat.seatTypeId
                            )?.name || "Chưa xác định"}
                          </div>
                          <div className="mb-1">
                            Giá:{" "}
                            {formatMoney(
                              seatTypes.find(
                                (type) => type.id == seat.seatTypeId
                              )?.price
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </Draggable>
  );
};

export interface SelectedSeatInfo extends ISeat {
  sectionName: string;
  typeName: string;
  formattedPrice: string;
  seatLabel: string;
  rcCode: string; // Added this property to store the seat coordinate
  ticketId?: number; // Added to store the ticket ID
  zoneId?: number; // Added to store the zone ID
  quantity?: number; // Add this line for quantity tracking
}

const TicketBooking = () => {
  const [searchParms] = useSearchParams();
  const eventId = searchParms.get("eventId");
  const eventActivityId = searchParms.get("eventActivityId");
  const [sections, setSections] = useState<ISection[]>([]);
  const [seatTypes, setSeatTypes] = useState<SeatTypeEdit[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeatInfo[]>([]);
  const [eventInfor, setEventInfor] =
    useState<
      Pick<
        EventDetailResponse,
        "eventName" | "eventActivityDTOList" | "locationName"
      >
    >();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const changeTicket = state?.changeTicket ?? false;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { tickets } = useTicketByEventId(Number(eventId));
  const oldTicketPurchase = useAppSelector((state) => state.ticketPurchase);
  // const { ticket } = useTicketPurchaseById(oldTicketPurchase.ticketPurchaseId);
  const [openOldTicket, setOpenOldTicket] = useState<boolean>(false);
  const [loadingChangeTicket, setLoadingChangeTicket] =
    useState<boolean>(false);
  const message = useWebSocket();

  console.log("old ticket redux", JSON.stringify(oldTicketPurchase, null, 2));

  const handleOpenOldTicket = () => {
    setOpenOldTicket(true);
  };

  const closeOldTicket = () => {
    setOpenOldTicket(false);
  };

  // Check if user is logged in
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setIsLoggedIn(!!accessToken);
  }, []);

  useEffect(() => {
    const fetchEventInfor = async () => {
      const response = await eventApi.getEventDetail(Number(eventId));
      if (response.data.result.length != 0) {
        setEventInfor(response.data.result);
      }
    };
    fetchEventInfor();
  }, [eventId]);

  useEffect(() => {
    const fetchSeatmap = async () => {
      try {
        const response = await seatmapApi.getSeatmapConsumer(
          Number(eventId),
          Number(eventActivityId)
        );
        if (response.data.result.length != 0) {
          setSections(response.data.result);
        }
        const ticketResponse = await ticketApi.getTicketsByEventId(
          Number(eventId)
        );
        // console.log("ticket:", ticketResponse.data.result);
        if (ticketResponse.data.result.length != 0) {
          setSeatTypes(ticketResponse.data.result);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSeatmap();
  }, [eventId, eventActivityId, message]);

  const validateSeatQuantity = (
    seats: any[],
    tickets: TicketResponse[]
  ): boolean => {
    const seatCount: { [key: string]: number } = {};

    seats.forEach((seat) => {
      if (seat.quantity) {
        // Nếu có quantity, cộng thêm vào số ghế
        seatCount[seat.seatTypeId] =
          (seatCount[seat.seatTypeId] || 0) + seat.quantity;
      } else {
        // Nếu không có quantity, tính mỗi ghế là 1
        seatCount[seat.seatTypeId] = (seatCount[seat.seatTypeId] || 0) + 1;
      }
    });

    // Kiểm tra xem tổng số ghế có vượt quá maxQuantity của từng loại vé không
    for (const seatTypeId in seatCount) {
      const ticket = tickets.find((ticket) => ticket.id === seatTypeId);
      if (ticket && seatCount[seatTypeId] > ticket.maxQuantity) {
        toast.error(
          `Số vé được mua tối đa của ghế ${ticket.name} là ${ticket.maxQuantity}`
        );
        return false; // Nếu vượt quá maxQuantity, trả về false
      }
    }

    return true; // Nếu không có lỗi, trả về true
  };

  // Function to show login prompt
  const showLoginPrompt = () => {
    setShowLoginDialog(true);
  };

  // Function to handle login redirect
  const handleLoginRedirect = () => {
    // Save current page URL to return after login
    localStorage.setItem(
      "redirectAfterLogin",
      window.location.pathname + window.location.search
    );
    // Redirect to login page
    navigate("/auth/signin");
  };

  // Function to get the seat color based on selection status
  const getSeatColor = (seat: ISeat): string => {
    // Nếu seat.status là falsy (null, undefined, false, ""), dùng màu xám
    if (!seat.status) {
      return "#d1d5db"; // gray-300, bạn có thể chọn màu khác như "#9ca3af" (gray-400)
    }

    // Nếu ghế đang được chọn thì dùng màu highlight
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    if (isSelected) {
      return "#059669"; // green-600
    }

    // Dùng màu của loại ghế nếu có, ngược lại dùng màu mặc định
    const seatType = seatTypes.find((type) => type.id == seat.seatTypeId);
    return seatType ? seatType.color : "#6b7280"; // gray-500 mặc định
  };

  // Handle seat click
  const handleSeatClick = (
    seat: ISeat,
    sectionName: string,
    quantityAction?: "increase" | "decrease"
  ) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      showLoginPrompt();
      return;
    }

    // Find the section
    const section = sections.find((s) => s.name === sectionName);
    const isStandingSection = section?.type === "STANDING";

    // For standing sections, we need to handle differently
    if (isStandingSection) {
      // Check if this standing section is already selected
      const isSelected = selectedSeats.some((s) => s.id === seat.id);
      const existingSeat = selectedSeats.find((s) => s.id === seat.id);

      // Handle quantity actions for standing sections
      if (isSelected && quantityAction) {
        setSelectedSeats((prev) =>
          prev.map((s) => {
            if (s.id === seat.id) {
              const currentQuantity = s.quantity || 1;
              let newQuantity = currentQuantity;

              if (quantityAction === "increase") {
                // Check if we're at capacity
                if (section?.capacity && currentQuantity >= section.capacity) {
                  toast.error(
                    `Số lượng tối đa cho khu vực này là ${section.capacity} vé`
                  );
                  return s;
                }
                newQuantity = currentQuantity + 1;
              } else if (quantityAction === "decrease") {
                if (currentQuantity <= 1) {
                  // If quantity would go below 1, remove the section entirely
                  return s;
                }
                newQuantity = currentQuantity - 1;
              }

              return { ...s, quantity: newQuantity };
            }
            return s;
          })
        );

        // If quantity is decreased to 0, remove the section
        if (
          quantityAction === "decrease" &&
          (existingSeat?.quantity || 1) <= 1
        ) {
          setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
        }

        return;
      }

      if (isSelected && !quantityAction) {
        // Remove the standing section if already selected and no quantity action
        setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
        return;
      } else if (!isSelected) {
        // Find seat type info for standing section
        const seatType = seatTypes.find((type) => type.id === section.priceId);

        // Get zoneId from the section
        const zoneId =
          section.zoneActivityId || Number.parseInt(section.id || "0");

        // Create the seat info for standing section
        const seatInfo: SelectedSeatInfo = {
          ...seat,
          sectionName,
          typeName: "Khu vực đứng",
          formattedPrice: formatCurrency(section.price || 0),
          seatLabel: "Đứng",
          rcCode: "Khu vực đứng",
          ticketId: seatType?.ticketId,
          zoneId: zoneId,
          quantity: 1, // Initialize with quantity 1
        };

        // Add the standing section
        setSelectedSeats((prev) => [...prev, seatInfo]);
        // console.log("Selected standing section:", seatInfo);
        return;
      }
    }

    // For regular seats, continue with the existing logic
    // Find seat type info
    const seatType = seatTypes.find((type) => type.id === seat.seatTypeId);

    // Find the corresponding ticket by matching seatTypeId with ticket id in the seatTypes array
    // In this case, the seatTypeId is the same as the ticket id
    const ticket = seatTypes.find((type) => type.id === seat.seatTypeId);
    const ticketId = ticket ? ticket.ticketId : undefined;
    // console.log("ticketId:", ticketId);

    // Get zoneId from the section or from the seat if available
    const zoneId =
      seat.zoneActivityId ||
      section?.zoneActivityId ||
      Number.parseInt(section?.id || "0");

    const rcCode = seat.id.split("-").slice(1).join("-");

    // console.log("Found section:", section);
    // console.log("Zone ID:", zoneId);
    // console.log("Ticket ID:", ticketId);

    // Create the correct seat label using our helper function
    const seatLabel = generateSeatLabel(seat.row, seat.column);

    // Create rich seat info object
    const seatInfo: SelectedSeatInfo = {
      ...seat,
      sectionName,
      typeName: seatType?.name || "Unknown Type",
      formattedPrice: formatCurrency(seatType?.price || 0),
      seatLabel: seatLabel,
      rcCode: rcCode, // Store the seat coordinate
      ticketId: ticketId, // Add the ticketId to the seat info
      zoneId: zoneId, // Add the zoneId to the seat info
    };

    // Check if seat is already selected
    const isSelected = selectedSeats.some((s) => s.id === seat.id);

    // console.log("seat ID:", seat.seatId);

    if (isSelected) {
      // Remove the seat if already selected
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
      console.log("Unselected seat:", seatInfo);
    } else {
      // Add the seat if not already selected
      setSelectedSeats((prev) => [...prev, seatInfo]);
      console.log("Selected seat:", seatInfo);
    }

    // Log the full seat info for debugging
    // console.log("Seat details:", {
    //   id: seat.id,
    //   seatId: seat.seatId,
    //   row: seat.row,
    //   column: seat.column,
    //   seatLabel: seatLabel,
    //   section: sectionName,
    //   seatType: seatType?.name,
    //   price: seatType?.price,
    //   formattedPrice: formatCurrency(seatType?.price || 0),
    //   ticketId: ticketId, // Log the ticketId
    //   zoneId: zoneId, // Log the zoneId
    // });
  };

  // Tính tổng tiền từ các ghế đã chọn
  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      const seatType = seatTypes.find((type) => type.id === seat.seatTypeId);
      const quantity = seat.quantity || 1;
      return total + (seatType?.price || 0) * quantity;
    }, 0);
  };

  // Hàm xử lý việc chuyển đến trang thanh toán
  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) return;
    if (!validateSeatQuantity(selectedSeats, tickets)) return;

    // Check if user is logged in
    if (!isLoggedIn) {
      showLoginPrompt();
      return;
    }

    setIsLoading(true);

    try {
      const ticketPurchaseRequests: TicketPurchaseRequest = {
        ticketPurchaseRequests: selectedSeats.map((seat) => {
          const isStandingSection = seat.id.startsWith("standing-");

          // For standing sections
          if (isStandingSection) {
            return {
              zoneId: seat.zoneId || 0,
              seatId: 0, // dùng 0 thay vì null để đúng kiểu number
              eventActivityId: Number(eventActivityId),
              ticketId: seat.ticketId ?? 0,
              eventId: Number(eventId),
              quantity: seat.quantity || 1,
            };
          }

          // Regular seated section
          return {
            zoneId: seat.zoneId || 0,
            seatId: seat.seatId,
            eventActivityId: Number(eventActivityId),
            ticketId: seat.ticketId ?? 0,
            eventId: Number(eventId),
            quantity: 1,
          };
        }),
      };

      // console.log(
      //   "Ticket purchase requests:",
      //   JSON.stringify(ticketPurchaseRequests, null, 2)
      // );

      // Call the API to create the ticket purchase
      const response = await ticketPurchaseApi.createTicketPurchase(
        ticketPurchaseRequests,
        localStorage.getItem("accessToken") || ""
      );

      console.log("Ticket purchase response:", response);

      // Kiểm tra thông báo phản hồi thay vì chỉ kiểm tra trạng thái success
      if (
        response.message &&
        response.message.toLowerCase().includes("successfully")
      ) {
        // LƯU Ý: Nếu API trả về thành công với message chứa "successfully",
        // chúng ta coi đó là thành công dù response.success có thể là false

        // Store data for payment page
        localStorage.setItem(
          "selectedSeats",
          JSON.stringify({
            seats: selectedSeats,
            totalAmount: calculateTotal(),
            eventInfo: {
              id: eventId,
              activityId: eventActivityId,
              name:
                eventInfor?.eventName || "Nhà Hát Kịch IDECAF: MÁ ƠI ÚT DÌA!",
              location: eventInfor?.locationName || "Nhà Hát Kịch IDECAF",
              date: "19:30, 12 tháng 4, 2025",
            },
            apiResponses: {
              ticket: seatTypes,
              seats: selectedSeats,
              purchase: response,
            },
          })
        );

        // Show success message
        toast.success("Đã tạo đơn hàng thành công!");

        // Chuyển đến trang thanh toán
        navigate(`/payment?eventId=${eventId}`);
        return; // Kết thúc sớm nếu thành công
      }

      // Nếu có success attribute và nó là true
      else if (response.success === true) {
        // Xử lý tương tự như trên khi API trả về success: true
        localStorage.setItem(
          "selectedSeats",
          JSON.stringify({
            seats: selectedSeats,
            totalAmount: calculateTotal(),
            eventInfo: {
              id: eventId,
              activityId: eventActivityId,
              name:
                eventInfor?.eventName || "Nhà Hát Kịch IDECAF: MÁ ƠI ÚT DÌA!",
              location: eventInfor?.locationName || "Nhà Hát Kịch IDECAF",
              date: "19:30, 12 tháng 4, 2025",
            },
            apiResponses: {
              ticket: seatTypes,
              seats: selectedSeats,
              purchase: response,
            },
          })
        );

        toast.success("Đã tạo đơn hàng thành công!");
        navigate("/payment");
        return;
      }

      // Nếu không có message success và success không phải true, coi như lỗi
      throw new Error(response.message || "Không thể tạo đơn hàng");
    } catch (error) {
      // Kiểm tra nội dung lỗi - nếu chứa "successfully" thì đó có thể là thành công
      if (
        error instanceof Error &&
        error.message &&
        error.message.toLowerCase().includes("successfully")
      ) {
        // Dù ở trong catch block nhưng message cho thấy đây là thành công
        toast.success("Đã tạo đơn hàng thành công!");

        // Lưu trữ dữ liệu cho trang thanh toán và chuyển hướng
        localStorage.setItem(
          "selectedSeats",
          JSON.stringify({
            seats: selectedSeats,
            totalAmount: calculateTotal(),
            eventInfo: {
              id: eventId,
              activityId: eventActivityId,
              name:
                eventInfor?.eventName || "Nhà Hát Kịch IDECAF: MÁ ƠI ÚT DÌA!",
              location: eventInfor?.locationName || "Nhà Hát Kịch IDECAF",
              date: "19:30, 12 tháng 4, 2025",
            },
            apiResponses: {
              ticket: seatTypes,
              seats: selectedSeats,
            },
          })
        );

        navigate("/payment");
      } else if (error instanceof Error) {
        toast.error(`Bạn không có quyền mua vé`);
      } else {
        toast.error("Đã xảy ra lỗi khi tạo đơn hàng");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlechangeTicket = async () => {
    if (selectedSeats.length === 0) return;
    if (!validateSeatQuantity(selectedSeats, tickets)) return;
    const ticketPurchaseRequests = selectedSeats.map((seat) => {
      // Check if this is a standing section (id starts with "standing-")
      const isStandingSection = seat.id.startsWith("standing-");

      // For standing sections, we need to use a different format
      if (isStandingSection) {
        return {
          zoneId: seat.zoneId || 0,
          seatId: 0, // Use null instead of 0 for standing sections
          eventActivityId: Number(eventActivityId),
          ticketId: seat.ticketId,
          eventId: Number(eventId),
          quantity: seat.quantity || 1,
          // isStanding: true,
          // price: section?.price || 0,
        };
      }
      return {
        zoneId: seat.zoneId || 0,
        seatId: seat.seatId,
        eventActivityId: Number(eventActivityId),
        ticketId: seat.ticketId,
        eventId: Number(eventId),
        quantity: 1,
      };
    });

    if (ticketPurchaseRequests.length > oldTicketPurchase.quantity) {
      toast.error("Số lượng vé chọn vượt quá số lượng vé cũ.");
      return;
    }

    const totalQuantity = ticketPurchaseRequests.reduce(
      (sum, req) => sum + (req.quantity || 0),
      0
    );

    if (totalQuantity > oldTicketPurchase.quantity) {
      toast.error("Tổng số lượng vé vượt quá số lượng vé cũ.");
      return;
    }

    try {
      const payload = {
        ticketPurchaseRequests: oldTicketPurchase.ticketPurchaseId.map(
          (id) => ({ ticketPurchaseId: id })
        ),
        ticketChange: ticketPurchaseRequests,
        orderCode: oldTicketPurchase.orderCode,
      };
      console.log("payload changeticket", payload);
      const res = await ticketPurchase.changeTicket(payload);
      console.log(res.data);
      if (res.data.result.data) {
        const paymentUrl = res.data.result.data.checkoutUrl;
        window.location.href = paymentUrl;
      } else if (res.data.result.data == null) {
        toast.success(res.data.result.message, {
          onAutoClose: () => {
            navigate("/ticketManagement");
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingChangeTicket(false);
    }
  };

  return (
    <div className="h-[calc(100vh-70px)] w-full text-black">
      <div className="relative">
        <Header />
        {location.pathname.includes("/manager") && (
          <Button
            onClick={() => navigate("/manager-dashboard/events")}
            className="absolute top-[80px] left-5 bg-pse-green text-white hover:bg-pse-green/80 flex items-center gap-2 z-10"
          >
            <ArrowLeft size={16} />
            Về trang quản lý
          </Button>
        )}
      </div>
      <div className="flex gap-6">
        <div className="relative mt-[70px] flex justify-left">
          <div
            id="mapContainer"
            className="relative w-[1200px] h-[800px] bg-gray-100 border border-gray-300 rounded overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 p-5 bg-gray-800 text-white text-center">
              Sân khấu
            </div>
            {changeTicket == true && (
              <div className="absolute top-4 left-5">
                <button
                  onClick={handleOpenOldTicket}
                  className=" bg-black text-white px-3 py-1 rounded-md shadow-box"
                >
                  Xem vé muốn đổi
                </button>
              </div>
            )}

            {sections?.map((section) => (
              <DraggableSection
                key={section.id}
                section={section}
                seatTypes={seatTypes}
                getSeatColor={getSeatColor}
                onSeatClick={(seat, sectionName, quantityAction) =>
                  handleSeatClick(seat, sectionName, quantityAction)
                }
                selectedSeats={selectedSeats}
                isLoggedIn={isLoggedIn}
                showLoginPrompt={showLoginPrompt}
              />
            ))}
          </div>
        </div>
        <div className="fixed flex flex-col top-0 right-0 h-full w-80 pt-[70px] bg-white shadow-md border border-gray-200">
          <div className="overflow-y-auto flex-1 p-6">
            <div className="mb-4 space-y-4">
              <div className="text-[18px] font-semibold">
                {eventInfor?.eventName}
              </div>
              <div className="flex items-center gap-1 font-medium">
                <span>
                  <Calendar
                    size={20}
                    fill="white"
                    className="text-pse-green-second"
                  />
                </span>
                {eventInfor?.eventActivityDTOList != undefined &&
                  formatTimeFe(
                    eventInfor.eventActivityDTOList.find(
                      (x) => x.eventActivityId == Number(eventActivityId)
                    )?.startTimeEvent
                  ) +
                    ` - ` +
                    formatTimeFe(
                      eventInfor.eventActivityDTOList.find(
                        (x) => x.eventActivityId == Number(eventActivityId)
                      )?.endTimeEvent
                    ) +
                    `, ` +
                    formatDateVietnamese(
                      eventInfor.eventActivityDTOList
                        .find(
                          (x) => x.eventActivityId == Number(eventActivityId)
                        )
                        ?.dateEvent.toString()
                    )}
              </div>
              <div className="flex items-center gap-1">
                <span>
                  <MapPin
                    size={20}
                    fill="white"
                    className="text-pse-green-second"
                  />
                </span>
                {eventInfor?.locationName}
              </div>
            </div>
            <CustomDivider />

            <div className="space-y-3">
              <h3 className="text-black font-semibold mb-4">
                Chú thích loại ghế
              </h3>
              {/* Map mảng ticketType ở đây */}
              {seatTypes.map((seatType) => (
                <div
                  key={seatType.id}
                  className="flex items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200"
                >
                  <div
                    className="w-8 h-8 rounded-lg shadow-md mr-3"
                    style={{ backgroundColor: seatType.color }}
                  ></div>
                  <div>
                    <div className="flex items-center font-medium text-gray-900">
                      <p>
                        {seatType.name}{" "}
                        <span className="text-xs text-pse-gray ml-auto">
                          (Tối đa {seatType.maxQuantity} vé)
                        </span>
                      </p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(seatType.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-3">Ghế đã chọn:</h3>
              {selectedSeats.length > 0 ? (
                <div className="space-y-2">
                  {selectedSeats.map((seat) => (
                    <div
                      key={seat.id}
                      className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium">
                          {seat.sectionName}: {parseSeatCode(seat.rcCode)}
                        </div>
                        <div className="text-sm font-semibold text-gray-700">
                          {seat.formattedPrice}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          {seat.typeName}
                        </div>

                        {/* Add quantity controls for standing sections */}
                        {seat.id.startsWith("standing-") && (
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                              onClick={() => {
                                const sectionId = seat.id.replace(
                                  "standing-",
                                  ""
                                );
                                const section = sections.find(
                                  (s) => s.id === sectionId
                                );
                                if (!section) return;

                                const standingSeat: ISeat = {
                                  id: `standing-${section.id}`,
                                  seatId: Number.parseInt(section.id),
                                  row: 0,
                                  column: 0,
                                  status: "available",
                                  price: section.price || 0,
                                  seatTypeId: section.priceId || "",
                                  zoneActivityId: section.zoneActivityId,
                                };
                                handleSeatClick(
                                  standingSeat,
                                  section.name,
                                  "decrease"
                                );
                              }}
                            >
                              <span className="text-sm font-bold">-</span>
                            </button>
                            <span className="text-sm font-semibold">
                              {seat.quantity || 1}
                            </span>
                            <button
                              className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                              onClick={() => {
                                const sectionId = seat.id.replace(
                                  "standing-",
                                  ""
                                );
                                const section = sections.find(
                                  (s) => s.id === sectionId
                                );
                                if (!section) return;

                                const standingSeat: ISeat = {
                                  id: `standing-${section.id}`,
                                  seatId: Number.parseInt(section.id),
                                  row: 0,
                                  column: 0,
                                  status: "available",
                                  price: section.price || 0,
                                  seatTypeId: section.priceId || "",
                                  zoneActivityId: section.zoneActivityId,
                                };
                                handleSeatClick(
                                  standingSeat,
                                  section.name,
                                  "increase"
                                );
                              }}
                            >
                              <span className="text-sm font-bold">+</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Show total price for standing sections with multiple tickets */}
                      {seat.id.startsWith("standing-") &&
                        seat.quantity &&
                        seat.quantity > 1 && (
                          <div className="flex justify-between items-center mt-1 pt-1 border-t border-gray-200">
                            <div className="text-xs text-gray-500">
                              Tổng ({seat.quantity} vé):
                            </div>
                            <div className="text-sm font-medium">
                              {formatCurrency(
                                (seatTypes.find(
                                  (type) => type.id === seat.seatTypeId
                                )?.price || 0) * seat.quantity
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                  <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-200">
                    <div>Tổng tiền:</div>
                    <div>{formatCurrency(calculateTotal())}</div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">Chưa chọn ghế nào.</p>
              )}
            </div>
          </div>

          {/* Footer cố định ở dưới cùng */}
          <div className="bg-pse-black-light text-white p-4">
            <div className="mb-2 flex items-center text-xs gap-1">
              <Ticket fill="white" className="text-pse-black-light" />
              {selectedSeats.length > 0
                ? selectedSeats
                    .map(
                      (seat) =>
                        `(${seat.sectionName} ${parseSeatCode(seat.rcCode)})`
                    )
                    .join(", ")
                : "Chưa chọn ghế"}
            </div>

            <Button
              className={`w-full ${
                selectedSeats.length != 0
                  ? "bg-pse-green text-white"
                  : "bg-white text-pse-gray"
              }  font-semibold hover:bg-opacity-70 transition-all duration-300`}
              disabled={
                selectedSeats.length === 0 || isLoading || loadingChangeTicket
              }
              onClick={
                changeTicket == true
                  ? handlechangeTicket
                  : handleProceedToPayment
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : selectedSeats.length > 0 ? (
                "Tiếp tục"
              ) : (
                "Vui lòng chọn vé"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Đăng nhập để tiếp tục</DialogTitle>
            <DialogDescription>
              Bạn cần đăng nhập để có thể đặt vé cho sự kiện này.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="text-center text-sm text-muted-foreground">
              Vui lòng đăng nhập để tiếp tục quá trình đặt vé. Sau khi đăng
              nhập, bạn sẽ được chuyển trở lại trang này.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleLoginRedirect} className="gap-2">
              <LogIn className="h-4 w-4" />
              Đăng nhập ngay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <Popup
        isOpen={openOldTicket}
        onClose={closeOldTicket}
        className="w-auto max-w-sm p-4"
      >
        <div className="overflow-x-hidden text-black">
          <div className="flex flex-col justify-center items-center">
            <img
              src={ticket?.banner || "/placeholder.svg"}
              alt=""
              className="w-40 h-20 rounded-md"
            />
            <div className="font-semibold mt-1 text-black text-xl text-center break-words">
              {ticket?.eventName}
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-pse-gray font-medium">
                {ticket?.ticketType}
              </span>
              <p
                style={{
                  backgroundColor: eventTypes.find(
                    (x) => x.id == ticket?.eventCategoryId
                  )?.color,
                }}
                className="text-white text-xs text-center font-medium rounded-md w-fit px-2 py-1"
              >
                {
                  eventTypes.find((x) => x.id == ticket?.eventCategoryId)
                    ?.vietnamName
                }
              </p>
            </div>
          </div>
          <DashDivider />
          <div className="space-y-2">
            <p className="break-words">
              <span className="text-pse-green font-semibold">
                {ticket?.locationName}
              </span>{" "}
              {"- "}
              {ticket?.location}
            </p>
            <p className="w-full truncate">
              Giờ bắt đầu: {formatTimeFe(ticket?.eventStartTime)} {"-"}
              <span className="font-semibold">
                {formatDateVietnamese(ticket?.eventDate.toString())}
              </span>
            </p>
          </div>
          <DashDivider />
          {ticket?.ishaveSeatmap && (
            <div>
              <div>
                Ghế {"- "}
                <span className="font-bold">
                  {parseSeatCode(ticket?.seatCode)}
                </span>{" "}
              </div>
              <div>
                Khu vực {"- "}
                <span className="font-bold">{ticket.zoneName}</span>{" "}
              </div>
            </div>
          )}
          <div className="flex justify-center mt-4">
            <QRCodeSVG
              value={ticket?.qrCode as string}
              size={140}
              bgColor={"#FFFFFF"}
              level={"M"}
            />
          </div>
          <DashDivider />
          <section className="flex justify-between text-black">
            <div>
              <h1 className="text-left">Mã vé</h1>
              <p className="text-left font-bold">{ticket?.ticketPurchaseId}</p>
            </div>
            <div>
              <h1 className="text-center">Số lượng</h1>
              <p className="text-center font-bold">{ticket?.quantity}</p>
            </div>
            <div>
              <h1 className="text-right">Giá</h1>
              <p className="text-right font-bold">
                {formatMoney(ticket?.price)}
              </p>
            </div>
          </section>
        </div>
      </Popup> */}
    </div>
  );
};

export default TicketBooking;
