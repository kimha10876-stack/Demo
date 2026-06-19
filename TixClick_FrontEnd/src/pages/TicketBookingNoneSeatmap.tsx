import axios from "axios";
import { ArrowLeft, Calendar, MapPin, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { toast, Toaster } from "sonner";
import CustomDivider from "../components/Divider/CustomDivider";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import type { EventDetailResponse } from "../interface/EventInterface";
import {
  formatDateVietnamese,
  formatMoney,
  formatTimeFe,
  parseSeatCode,
} from "../lib/utils";
import eventApi from "../services/eventApi";
import ticketMappingApi from "../services/ticketMappingApi";
import useWebSocket from "../hooks/useWebSocket";
import { useAppSelector } from "../redux/hooks";
import useTicketPurchaseById from "../hooks/useTicketPurchaseById";
import Popup from "../components/Popup/Popup";
import { eventTypes } from "../constants/constants";
import DashDivider from "../components/Divider/DashDivider";
import { QRCodeSVG } from "qrcode.react";
import ticketPurchase from "../services/TicketPurchase/ticketPurchase";

const ticketPurchaseApi = {
  createTicketPurchase: async (data: any, accessToken: string) => {
    try {
      console.log("Data purchase:", data)
      const response = await fetch("https://tixclick.site/api/ticket-purchase/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      })
      console.log("response", response)

      if (!response.ok) {
        throw new Error("Failed to create ticket purchase")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating ticket purchase:", error)
      throw error
    }
  },
}

export interface TicketResponse {
  id: number
  ticket: TicketClass
  quantity: number
  status: boolean
  purchaseQuantity?: number
}

interface TicketClass {
  ticketId: number
  ticketName: string
  ticketCode: string
  createdDate: Date
  price: number
  minQuantity: number
  maxQuantity: number
  status: boolean
  textColor: null
  seatBackgroundColor: null
  accountId: number
  eventId: number
}

export interface TicketPurchaseRequest {
  ticketPurchaseRequests: TicketPurchaseRequestElement[]
}

export interface TicketPurchaseRequestElement {
  zoneId: number
  seatId: number
  eventActivityId: number
  ticketId: number
  eventId: number
  quantity: number
}

const TicketBookingNoneSeatmap = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state
  const changeTicket = state?.changeTicket ?? false
  const oldTicketPurchase = useAppSelector((state) => state.ticketPurchase)
  // const { ticket } = useTicketPurchaseById(oldTicketPurchase.ticketPurchaseId)
  const [openOldTicket, setOpenOldTicket] = useState<boolean>(false)
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get("eventId")
  const activityEventId = searchParams.get("eventActivityId")
  const [tickets, setTickets] = useState<TicketResponse[]>([])
  const [totalQuantity, setTotalQuantity] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [eventInfor, setEventInfor] =
    useState<Pick<EventDetailResponse, "eventName" | "eventActivityDTOList" | "locationName">>()
  const [isLoading, setIsLoading] = useState(false)
  const message = useWebSocket()

  const handleOpenOldTicket = () => {
    setOpenOldTicket(true)
  }

  const closeOldTicket = () => {
    setOpenOldTicket(false)
  }
  const fetchTickets = async () => {
    try {
      const ticketResponse = await ticketMappingApi.getAllByAcitivityEventId(Number(activityEventId))
      // console.log(ticketResponse);
      if (ticketResponse.data.result.length !== 0) {
        const updatedTickets = ticketResponse.data.result.map((ticket: TicketResponse) => ({
          ...ticket,
          purchaseQuantity: 0,
        }))
        setTickets(updatedTickets)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchTickets()
    setTotalQuantity(0)
  }, [activityEventId, message])

  useEffect(() => {
    const newTotal = tickets.reduce((acc, ticket) => acc + (ticket.purchaseQuantity || 0) * ticket.ticket.price, 0)
    setTotalPrice(newTotal)
  }, [tickets])

  useEffect(() => {
    const fetchEventInfor = async () => {
      const response = await eventApi.getEventDetail(Number(eventId))
      if (response.data.result.length != 0) {
        setEventInfor(response.data.result)
      }
    }
    fetchEventInfor()
  }, [eventId])

  const handleIncreaseQuantity = (ticketId: number) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.ticket.ticketId === ticketId
          ? {
              ...ticket,
              purchaseQuantity: (ticket.purchaseQuantity || 0) + 1,
            }
          : ticket,
      ),
    )
    setTotalQuantity((prevTotalQuantity) => prevTotalQuantity + 1)
  }

  const handleDecreaseQuantity = (ticketId: number) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.ticket.ticketId === ticketId
          ? {
              ...ticket,
              purchaseQuantity: Math.max((ticket.purchaseQuantity || 0) - 1, 0),
            }
          : ticket,
      ),
    )
    setTotalQuantity((prevTotalQuantity) => prevTotalQuantity - 1)
  }

  const createTicketPurchase = async () => {
    setIsLoading(true)

    const ticketPurchaseRequest: TicketPurchaseRequest = {
      ticketPurchaseRequests: tickets
        .filter((ticket) => ticket.purchaseQuantity && ticket.purchaseQuantity > 0)
        .map((ticket) => ({
          ticketId: ticket.ticket.ticketId,
          quantity: ticket.purchaseQuantity as number,
          eventId: ticket.ticket.eventId,
          eventActivityId: Number(activityEventId),
          seatId: 0,
          zoneId: 0,
        })),
    }

    try {
      console.log("Đang gửi yêu cầu mua vé:", ticketPurchaseRequest)

      // Store the ticket purchase request in localStorage
      localStorage.setItem("ticketPurchaseRequest", JSON.stringify(ticketPurchaseRequest))

      // Call the API to create the ticket purchase
      const response = await ticketPurchaseApi.createTicketPurchase(
        ticketPurchaseRequest,
        localStorage.getItem("accessToken") || "",
      )

      console.log("Ticket purchase response:", response)

      // Store the full purchase response in localStorage
      localStorage.setItem("purchaseResponse", JSON.stringify(response))

      // Prepare selected seats data for the payment page
      const selectedSeats = tickets
        .filter((ticket) => ticket.purchaseQuantity && ticket.purchaseQuantity > 0)
        .map((ticket) => ({
          ticketId: ticket.ticket.ticketId,
          typeName: ticket.ticket.ticketName,
          sectionName: "General",
          seatLabel: "Non-reserved",
          formattedPrice: formatMoney(ticket.ticket.price),
          price: ticket.ticket.price,
          quantity: ticket.purchaseQuantity,
        }))

      // Store event information for the payment page
      const eventInfo = {
        id: eventId,
        activityId: activityEventId,
        name: eventInfor?.eventName,
        location: eventInfor?.locationName,
        date:
          formatDateVietnamese(
            eventInfor?.eventActivityDTOList
              ?.find((x) => x.eventActivityId == Number(activityEventId))
              ?.dateEvent.toString(),
          ) +
          " - " +
          formatTimeFe(
            eventInfor?.eventActivityDTOList?.find((x) => x.eventActivityId == Number(activityEventId))?.startTimeEvent,
          ),
      }

      // Store all the necessary data in localStorage
      localStorage.setItem(
        "selectedSeats",
        JSON.stringify({
          eventInfo,
          seats: selectedSeats,
          totalAmount: totalPrice,
          apiResponses: {
            purchase: ticketPurchaseRequest,
            purchaseResponse: response,
          },
        }),
      )

      localStorage.setItem("eventInfo", JSON.stringify(eventInfo))
      localStorage.setItem("totalPrice", totalPrice.toString())
      localStorage.setItem("totalQuantity", totalQuantity.toString())

      // Navigate to payment page with the purchase response
      navigate(`/payment?eventId=${eventId}`, {
        state: {
          ticketPurchaseRequest,
          eventInfo,
          totalPrice,
          totalQuantity,
          purchaseResponse: response,
        },
      })

      toast.success("Đặt vé thành công!")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Lỗi từ server không xác định"
        console.error("Lỗi Axios:", errorMessage, error.response?.data)

        toast.error(`Lỗi khi mua vé: ${errorMessage}`)
      } else {
        console.error("Lỗi không phải Axios:", error)
        toast.error("Có lỗi xảy ra khi mua vé")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeTicket = async () => {
    const ticketRequests = tickets
      .filter((ticket) => ticket.purchaseQuantity && ticket.purchaseQuantity > 0)
      .map((ticket) => ({
        ticketId: ticket.ticket.ticketId,
        quantity: ticket.purchaseQuantity as number,
        eventId: ticket.ticket.eventId,
        eventActivityId: Number(activityEventId),
        seatId: 0,
        zoneId: 0,
      }))

    console.log(JSON.stringify(ticketRequests, null, 2))

    if (ticketRequests.length > oldTicketPurchase.quantity) {
      toast.error("Số lượng vé chọn vượt quá số lượng vé cũ.")
      return
    }

    const totalQuantity = ticketRequests.reduce((sum, req) => sum + (req.quantity || 0), 0)

    if (totalQuantity > oldTicketPurchase.quantity) {
      toast.error("Tổng số lượng vé vượt quá số lượng vé cũ.")
      return
    }

    // try {
    //   const res = await ticketPurchase.changeTicket(ticketRequests, {
    //     ticketPurchaseId: oldTicketPurchase.ticketPurchaseId,
    //     caseTicket: oldTicketPurchase.caseTicket,
    //   })
    //   console.log(res.data)

    //   if (res.data.result.data) {
    //     const paymentUrl = res.data.result.data.checkoutUrl
    //     window.location.href = paymentUrl
    //   } else if (res.data.result.data == null) {
    //     toast.success(res.data.result.message, {
    //       onAutoClose: () => {
    //         navigate("/ticketManagement")
    //       },
    //     })
    //   }
    // } catch (error) {
    //   console.log(error)
    // }
  }

  return (
    <div className="flex flex-col h-auto lg:min-h-screen lg:flex-row">
      {location.pathname.includes("/manager") && (
        <Button
          onClick={() => navigate("/manager-dashboard/events")}
          className="absolute top-5 left-5 bg-pse-green text-white hover:bg-pse-green/80 flex items-center gap-2 z-10"
        >
          <ArrowLeft size={16} />
          Back to Manager
        </Button>
      )}
      <div className="lg:w-[80%]">
        <div className="relative text-center bg-pse-black-light py-4">
          Chọn vé
          {changeTicket == true && (
            <div className="absolute top-4 left-5">
              <button onClick={handleOpenOldTicket} className=" bg-black text-white px-3 py-1 rounded-md shadow-box">
                Xem vé muốn đổi
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col lg:w-[600px] mx-auto my-10">
          <div className="flex justify-between w-full bg-pse-green p-4 rounded-t-lg">
            <div className="font-bold">Loại vé</div>
            <div className="font-bold">Số lượng</div>
          </div>
          {tickets.map((ticket) => (
            <Card
              key={ticket.ticket.ticketId}
              className="flex justify-between items-center p-4 bg-transparent rounded-none last:rounded-b-lg "
            >
              <div>
                <div className="flex items-center gap-1 font-semibold text-base text-pse-green-second">
                  {ticket.ticket.ticketName}
                  <p className="text-xs text-pse-gray font-medium">(Còn {ticket.quantity} vé )</p>
                </div>
                <div className="text-white">{formatMoney(ticket.ticket.price)}</div>
              </div>
              {ticket.quantity == 0 || ticket.status == false ? (
                <p className="bg-red-200 text-pse-error/80 flex w-fit h-fit px-2 py-1 rounded-md">Hết vé</p>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDecreaseQuantity(ticket.ticket.ticketId)}
                    disabled={ticket.purchaseQuantity == 0 ? true : false}
                    className="bg-transparent border border-white"
                  >
                    -
                  </Button>
                  <Input value={ticket.purchaseQuantity} className="text-black w-[50px] text-center" readOnly />
                  <Button
                    onClick={() => handleIncreaseQuantity(ticket.ticket.ticketId)}
                    disabled={ticket.purchaseQuantity == ticket.ticket.maxQuantity}
                    className={`${
                      ticket.purchaseQuantity == ticket.ticket.maxQuantity && "cursor-not-allowed"
                    } bg-transparent border border-white`}
                  >
                    +
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:ml-auto lg:h-screen lg:w-[20%] text-black bg-white p-6 shadow-md border border-gray-200">
        <div className="mb-4 space-y-4">
          <div className="text-[18px] font-semibold">{eventInfor?.eventName}</div>
          <div className="flex items-center gap-1 font-medium">
            <span>
              <Calendar size={20} fill="white" className="text-pse-green-second" />
            </span>
            {eventInfor?.eventActivityDTOList != undefined &&
              formatTimeFe(
                eventInfor.eventActivityDTOList.find((x) => x.eventActivityId == Number(activityEventId))
                  ?.startTimeEvent,
              ) +
                ` - ` +
                formatTimeFe(
                  eventInfor.eventActivityDTOList.find((x) => x.eventActivityId == Number(activityEventId))
                    ?.endTimeEvent,
                ) +
                `, ` +
                formatDateVietnamese(
                  eventInfor.eventActivityDTOList
                    .find((x) => x.eventActivityId == Number(activityEventId))
                    ?.dateEvent.toString(),
                )}
          </div>
          <div className="flex items-center gap-1">
            <span>
              <MapPin size={20} fill="white" className="text-pse-green-second" />
            </span>
            {eventInfor?.locationName}
          </div>
        </div>
        <CustomDivider />

        <div className="space-y-3">
          <h3 className="text-black font-semibold mb-4">Chú thích loại vé</h3>

          {tickets.map((ticket) => (
            <div
              key={ticket.ticket.ticketId}
              className="flex items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200"
            >
              <div>
                <div className="font-medium text-gray-900">{ticket.ticket.ticketName}</div>
                <div className="text-sm text-gray-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(ticket.ticket.price)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto bg-pse-black-light text-white -mx-[26px] -my-[24px] p-4 pb-4">
          <div className="mb-2 flex items-center text-xs gap-1">
            <Ticket fill="white" className="text-pse-black-light" />
            {totalQuantity != 0 ? `x ${totalQuantity}` : "Chưa chọn vé nào"}
          </div>

          <Button
            onClick={changeTicket == true ? handleChangeTicket : createTicketPurchase}
            className={`w-full ${
              totalPrice != 0 ? "bg-pse-green text-white" : "bg-white text-pse-gray"
            }  font-semibold hover:bg-opacity-70 transition-all duration-300`}
            disabled={totalPrice != 0 || isLoading ? false : true}
          >
            {isLoading
              ? "Đang xử lý..."
              : totalPrice != 0
                ? `Tiếp tục - ${formatMoney(totalPrice)}`
                : "Vui lòng chọn vé"}
          </Button>
        </div>
      </div>
      {/* <Popup isOpen={openOldTicket} onClose={closeOldTicket} className="w-auto max-w-sm p-4">
        <div className="overflow-x-hidden text-black">
          <div className="flex flex-col justify-center items-center">
            <img src={ticket?.banner || "/placeholder.svg"} alt="" className="w-40 h-20 rounded-md" />
            <div className="font-semibold mt-1 text-black text-xl text-center break-words">{ticket?.eventName}</div>
            <div className="flex gap-1 items-center">
              <span className="text-pse-gray font-medium">{ticket?.ticketType}</span>
              <p
                style={{
                  backgroundColor: eventTypes.find((x) => x.id == ticket?.eventCategoryId)?.color,
                }}
                className="text-white text-xs text-center font-medium rounded-md w-fit px-2 py-1"
              >
                {eventTypes.find((x) => x.id == ticket?.eventCategoryId)?.vietnamName}
              </p>
            </div>
          </div>
          <DashDivider />
          <div className="space-y-2">
            <p className="break-words">
              <span className="text-pse-green font-semibold">{ticket?.locationName}</span> {"- "}
              {ticket?.location}
            </p>
            <p className="w-full truncate">
              Giờ bắt đầu: {formatTimeFe(ticket?.eventStartTime)} {"-"}
              <span className="font-semibold">{formatDateVietnamese(ticket?.eventDate.toString())}</span>
            </p>
          </div>
          <DashDivider />
          {ticket?.ishaveSeatmap && (
            <div>
              <div>
                Ghế {"- "}
                <span className="font-bold">{parseSeatCode(ticket?.seatCode)}</span>{" "}
              </div>
              <div>
                Khu vực {"- "}
                <span className="font-bold">{ticket.zoneName}</span>{" "}
              </div>
            </div>
          )}
          <div className="flex justify-center mt-4">
            <QRCodeSVG value={ticket?.qrCode as string} size={140} bgColor={"#FFFFFF"} level={"M"} />
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
              <p className="text-right font-bold">{formatMoney(ticket?.price)}</p>
            </div>
          </section>
        </div>
      </Popup> */}
      <Toaster position="top-center" />
    </div>
  )
}

export default TicketBookingNoneSeatmap
