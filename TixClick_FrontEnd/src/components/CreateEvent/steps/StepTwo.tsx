import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Ticket,
  Save,
  X,
  CalendarIcon,
  Plus,
  Trash2,
  LoaderCircle,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import eventApi from "../../../services/event/eventApi";
import {
  cn,
  convertHHMMtoHHMMSS,
  formatDate,
  formatDateTime,
  formatDateVietnamese,
  formatMoney,
  formatTimeFe,
} from "../../../lib/utils";
import { toast } from "sonner";
import { StepProps } from "./Step1_Infor";
import { Card, CardContent, CardTitle } from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";
import { format } from "date-fns";
import TimeInput from "../../Input/TimeInput";
import Popup from "../../Popup/Popup";
import { TOAST_MESSAGE } from "../../../constants/constants";
import eventActivityApi from "../../../services/eventActivityApi";
import { EventStatus } from "../../../interface/EventInterface";
import { AxiosError } from "axios";

interface TicketType {
  ticketCode: string;
  ticketName: string;
  price: number;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  eventId: number;
}

export interface Activity {
  eventActivityId?: number;
  activityName: string;
  dateEvent: Date;
  startTimeEvent: string;
  endTimeEvent: string;
  startTicketSale: string; // yy-mm-dd hh:mm:ss
  endTicketSale: string; // yy-mm-dd hh:mm:ss
  tickets?: TicketType[];
  eventId: number; // Optional vì chỉ dùng khi in
}
const defaultTicket: TicketType = {
  ticketCode: "",
  ticketName: "",
  price: 0,
  quantity: 0,
  minQuantity: 1,
  maxQuantity: 2,
  eventId: 0,
};

const StepTwo: React.FC<StepProps> = ({
  step,
  isStepValid,
  setIsStepValid,
  updateStep,
  event,
}) => {
  // console.log(JSON.stringify(event?.eventActivityDTOList, null, 2));
  const [hasSeatMap, setHasSeatMap] = useState<boolean | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [currentActivityIndex, setCurrentActivityIndex] = useState<
    number | null
  >(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingHasSeatMap, setPendingHasSeatMap] = useState<boolean | null>(
    null
  );
  const [newTicket, setNewTicket] = useState<TicketType>({ ...defaultTicket });
  const [errors, setErrors] = useState<{
    [key: number]: {
      startTimeEvent?: string;
      endTimeEvent?: string;
      startTicketSale?: string;
      endTicketSale?: string;
      dateEvent?: string;
    };
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdate, setIsUdpdate] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const eventId = Number(searchParams.get("id"));
  const navigate = useNavigate();
  const contractCode = searchParams.get("contractCode");
  // console.log(activities);

  const fetchData = async () => {
    try {
      if (!eventId) return;

      const response = await eventActivityApi.getWithTicketByEventId(eventId);
      const result = response.data.result;

      if (result) setActivities(result);

      // Kiểm tra nếu có bất kỳ activity nào có ticket khác rỗng
      const hasAnyTickets = result.some(
        (activity: Activity) =>
          Array.isArray(activity.tickets) && activity.tickets.length > 0
      );
      setHasSeatMap(hasAnyTickets ? false : true);
      setIsUdpdate(true);
    } catch (error) {
      console.log(error);
      setActivities([]);
      setIsUdpdate(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId]);

  useEffect(() => {
    const hasValidActivity = activities.some(
      (activity) =>
        activity.activityName.trim() &&
        activity.dateEvent &&
        activity.startTimeEvent.trim() &&
        activity.endTimeEvent.trim() &&
        activity.startTicketSale.trim() &&
        activity.endTicketSale.trim() &&
        activity.eventId !== undefined
    );

    if (hasValidActivity) {
      setIsStepValid(true);
    } else {
      setIsStepValid(false);
    }
  }, [activities]);

  const handleAddActivity = () => {
    setActivities((prev) => [
      ...prev,
      {
        activityName: "",
        dateEvent: new Date(),
        startTimeEvent: "",
        endTimeEvent: "",
        startTicketSale: "",
        endTicketSale: "",
        tickets: hasSeatMap ? undefined : [],
        eventId, // ← gán tự động từ URL
      },
    ]);
  };

  const handleRemoveActivity = (index: number) => {
    const updated = [...activities];
    updated.splice(index, 1);
    setActivities(updated);
  };

  const openTicketModal = (activityIndex: number) => {
    setCurrentActivityIndex(activityIndex);
    setNewTicket({
      ticketCode: Date.now().toString(),
      ticketName: "",
      price: 0,
      quantity: 0,
      minQuantity: 1,
      maxQuantity: 2,
      eventId, // ← gán tự động từ URL
    });
    setIsTicketModalOpen(true);
  };

  const saveTicket = () => {
    if (currentActivityIndex === null) return;
    const currentActivity = activities[currentActivityIndex];

    // Kiểm tra các field bắt buộc
    const isActivityValid =
      currentActivity.activityName &&
      currentActivity.dateEvent &&
      currentActivity.endTicketSale &&
      currentActivity.endTimeEvent &&
      currentActivity.startTicketSale &&
      currentActivity.startTimeEvent;

    if (!isActivityValid) {
      toast.warning(TOAST_MESSAGE.emmptyEventActivity);
      setIsTicketModalOpen(false);
      return;
    }
    const updated = [...activities];
    updated[currentActivityIndex].tickets?.push(newTicket);
    setActivities(updated);
    setIsTicketModalOpen(false);
  };

  const handleRemoveTicket = (activityIndex: number, ticketIndex: number) => {
    const updated = [...activities];
    updated[activityIndex].tickets?.splice(ticketIndex, 1);
    setActivities(updated);
  };

  const handleSeatMapChange = (newValue: boolean) => {
    if (activities.length > 0 && newValue !== hasSeatMap) {
      setPendingHasSeatMap(newValue);
      setShowConfirmDialog(true);
    } else {
      setHasSeatMap(newValue);
      setActivities([]); // reset khi đổi loại sơ đồ
    }
  };

  const confirmSeatMapChange = () => {
    setHasSeatMap(pendingHasSeatMap);
    setActivities([]);
    setShowConfirmDialog(false);
    setPendingHasSeatMap(null);
  };

  const cancelSeatMapChange = () => {
    setShowConfirmDialog(false);
    setPendingHasSeatMap(null);
  };

  const submitActivity = async () => {
    try {
      if (isUpdate) {
        setIsLoading(true);

        const formatActivities = activities.map((activity) => ({
          ...activity,
          eventActivityId: activity.eventActivityId,
          dateEvent: formatDate(activity.dateEvent),
          startTicketSale: formatDateTime(activity.startTicketSale),
          endTicketSale: formatDateTime(activity.endTicketSale),
          startTimeEvent: convertHHMMtoHHMMSS(activity.startTimeEvent),
          endTimeEvent: convertHHMMtoHHMMSS(activity.endTimeEvent),
        })) as any; // Any tạm thời

        console.log(JSON.stringify(formatActivities, null, 2));
        const response = await eventApi.createEventActivity(
          formatActivities,
          event?.status == EventStatus.SCHEDULED ? contractCode : ""
        );
        console.log("Update response", response);
        setIsLoading(false);
        toast.success(response.data.message);
        const queryParams = new URLSearchParams({
          id: eventId.toString(),
          step: hasSeatMap ? "3" : "4",
        }).toString();
        if (event?.status == EventStatus.SCHEDULED) {
          await navigate("/manager-dashboard/events");
        } else {
          await navigate(`?${queryParams}`);
        }
      } else {
        setIsLoading(true);
        const formatActivities = activities.map((activity) => ({
          ...activity,
          dateEvent: formatDate(activity.dateEvent),
          startTicketSale: formatDateTime(activity.startTicketSale),
          endTicketSale: formatDateTime(activity.endTicketSale),
          startTimeEvent: convertHHMMtoHHMMSS(activity.startTimeEvent),
          endTimeEvent: convertHHMMtoHHMMSS(activity.endTimeEvent),
        })) as any; // Any tạm thời

        console.log(JSON.stringify(formatActivities, null, 2));
        const response = await eventApi.createEventActivity(
          formatActivities,
          event?.status == EventStatus.SCHEDULED ? contractCode : ""
        );
        console.log("Create response", response);
        setIsLoading(false);
        toast.success(response.data.message);
        const queryParams = new URLSearchParams({
          id: eventId.toString(),
          step: hasSeatMap ? "3" : "4",
        }).toString();
        await navigate(`?${queryParams}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.log(axiosError.response?.data);
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    if (!isStepValid) {
      toast.warning("Bạn cần phải thêm activity");
      return;
    }
    await submitActivity();
    setIsStepValid(false); // reset cho bước sau
  };

  // const prevStep = () => {
  //   setStep((prev) => Math.max(prev - 1, 0));
  // };

  return (
    <div className="p-6 space-y-6 text-black">
      <h2 className="text-2xl font-semibold text-white">
        Sự kiện này có sơ đồ ghế không?
      </h2>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleSeatMapChange(true)}
          className={`px-4 py-2 rounded ${
            hasSeatMap === true ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Có
        </button>
        <button
          onClick={() => handleSeatMapChange(false)}
          className={`px-4 py-2 rounded ${
            hasSeatMap === false ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Không
        </button>
      </div>

      {hasSeatMap !== null && (
        <div className="space-y-6">
          <button
            onClick={handleAddActivity}
            className="flex items-center gap-2 bg-pse-green hover:bg-pse-green/80 text-white px-4 py-2 rounded"
          >
            <CalendarCheck size={18} /> Thêm hoạt động
          </button>

          {activities.map((activity, index) => (
            <Card key={index} className="px-4 py-2 bg-transparent text-white">
              <CardTitle className="flex justify-between items-center mb-4 mt-2 ml-4 text-[20px] font-bold">
                <p>Hoạt động {index + 1}</p>
                <X
                  className="hover:text-pse-error cursor-pointer"
                  onClick={() => handleRemoveActivity(index)}
                />
              </CardTitle>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Tên hoạt động */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="activityName">Tên hoạt động</Label>
                  <Input
                    placeholder="Tên hoạt động"
                    className="text-white bg-transparent"
                    id="activityName"
                    type="text"
                    value={activity.activityName || ""}
                    onChange={(e) => {
                      const updated = [...activities];
                      updated[index].activityName = e.target.value;
                      setActivities(updated);
                    }}
                  />
                </div>
                {/* 2. Ngày diễn ra */}
                <div className="flex flex-col gap-2">
                  <Label>Ngày diễn ra</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal text-white bg-transparent",
                          !activity.dateEvent && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {activity.dateEvent
                          ? format(activity.dateEvent, "dd/MM/yyyy")
                          : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        mode="single"
                        selected={activity.dateEvent}
                        onSelect={(date) => {
                          const updated = [...activities];
                          const startTicketSaleDate = new Date(
                            activity.startTicketSale || ""
                          );
                          const endTicketSaleDate = new Date(
                            activity.endTicketSale || ""
                          );

                          if (
                            date &&
                            (date <= startTicketSaleDate ||
                              date <= endTicketSaleDate)
                          ) {
                            setErrors((prev) => ({
                              ...prev,
                              [index]: {
                                ...prev[index],
                                dateEvent:
                                  "Ngày diễn ra phải sau ngày bắt đầu và kết thúc bán vé",
                              },
                            }));
                          } else {
                            setErrors((prev) => ({
                              ...prev,
                              [index]: { ...prev[index], dateEvent: "" },
                            }));
                            updated[index].dateEvent = date!;
                            setActivities(updated);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors[index]?.dateEvent && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors[index]?.dateEvent}
                    </p>
                  )}
                </div>
                {/* Giờ bắt đầu */}
                <TimeInput
                  className="text-white bg-transparent"
                  label="Giờ bắt đầu"
                  id={`startTimeEvent-${index}`}
                  value={activity.startTimeEvent || ""}
                  onChange={(value) => {
                    const updated = [...activities];
                    updated[index].startTimeEvent = value;
                    setActivities(updated);

                    const end = updated[index].endTimeEvent;
                    if (end) {
                      const [sh, sm] = value.split(":").map(Number);
                      const [eh, em] = end.split(":").map(Number);
                      if (eh * 60 + em <= sh * 60 + sm) {
                        setErrors((prev) => ({
                          ...prev,
                          [index]: {
                            ...prev[index],
                            startTimeEvent: "Giờ kết thúc phải sau giờ bắt đầu",
                          },
                        }));
                      } else {
                        setErrors((prev) => ({
                          ...prev,
                          [index]: { ...prev[index], startTimeEvent: "" },
                        }));
                      }
                    }
                  }}
                  error={errors[index]?.startTimeEvent}
                />

                {/* Giờ kết thúc */}
                <TimeInput
                  className="text-white bg-transparent"
                  label="Giờ kết thúc"
                  id={`endTimeEvent-${index}`}
                  value={activity.endTimeEvent || ""}
                  onChange={(value) => {
                    const updated = [...activities];
                    const start = updated[index].startTimeEvent;

                    if (start) {
                      const [sh, sm] = start.split(":").map(Number);
                      const [eh, em] = value.split(":").map(Number);
                      if (eh * 60 + em <= sh * 60 + sm) {
                        setErrors((prev) => ({
                          ...prev,
                          [index]: {
                            ...prev[index],
                            endTimeEvent: "Giờ kết thúc phải sau giờ bắt đầu",
                          },
                        }));
                        return;
                      } else {
                        setErrors((prev) => ({
                          ...prev,
                          [index]: { ...prev[index], endTimeEvent: "" },
                        }));
                      }
                    }

                    updated[index].endTimeEvent = value;
                    setActivities(updated);
                  }}
                  error={errors[index]?.endTimeEvent}
                />
                {/* 5. Bắt đầu bán vé */}
                <div className="flex flex-col gap-2">
                  <Label>Bắt đầu bán vé</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-white bg-transparent text-left font-normal",
                          !activity.startTicketSale && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {activity.startTicketSale ? (
                          format(
                            new Date(activity.startTicketSale),
                            "dd/MM/yyyy HH:mm"
                          )
                        ) : (
                          <div className="text-pse-gray">Chọn ngày và giờ</div>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="space-y-2">
                      <Calendar
                        mode="single"
                        disabled={(date) => date < new Date()}
                        selected={
                          activity.startTicketSale
                            ? new Date(activity.startTicketSale)
                            : undefined
                        }
                        onSelect={(date) => {
                          if (!date) return;
                          const updated = [...activities];
                          const old = new Date(
                            activity.startTicketSale || Date.now()
                          );
                          old.setFullYear(date.getFullYear());
                          old.setMonth(date.getMonth());
                          old.setDate(date.getDate());

                          const now = new Date();
                          const eventDate = activity.dateEvent
                            ? new Date(activity.dateEvent)
                            : null;

                          if (old <= now) {
                            setErrors((prev) => ({
                              ...prev,
                              [index]: {
                                ...prev[index],
                                startTicketSale:
                                  "Ngày bắt đầu bán vé phải sau thời điểm hiện tại",
                              },
                            }));
                          } else if (eventDate && old >= eventDate) {
                            setErrors((prev) => ({
                              ...prev,
                              [index]: {
                                ...prev[index],
                                startTicketSale:
                                  "Ngày bắt đầu bán vé phải trước ngày diễn ra sự kiện",
                              },
                            }));
                          } else {
                            setErrors((prev) => ({
                              ...prev,
                              [index]: { ...prev[index], startTicketSale: "" },
                            }));
                            updated[index].startTicketSale = old.toISOString();
                            setActivities(updated);
                          }
                        }}
                      />

                      <Input
                        type="time"
                        value={
                          activity.startTicketSale
                            ? new Date(activity.startTicketSale)
                                .toTimeString()
                                .slice(0, 5)
                            : "00:00"
                        }
                        onChange={(e) => {
                          const [hour, minute] = e.target.value.split(":");
                          const updated = [...activities];
                          const date = new Date(
                            activity.startTicketSale || new Date()
                          );
                          date.setHours(Number(hour));
                          date.setMinutes(Number(minute));
                          updated[index].startTicketSale = date.toISOString();
                          setActivities(updated);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors[index]?.startTicketSale && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors[index]?.startTicketSale}
                    </p>
                  )}
                </div>
                {/* 6. Kết thúc bán vé */}
                <div className="flex flex-col gap-2">
                  <Label>Kết thúc bán vé</Label>
                  <Popover>
                    <PopoverTrigger
                      className="text-white bg-transparent"
                      asChild
                    >
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !activity.endTicketSale && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {activity.endTicketSale ? (
                          format(
                            new Date(activity.endTicketSale),
                            "dd/MM/yyyy HH:mm"
                          )
                        ) : (
                          <div className="text-pse-gray">Chọn ngày và giờ</div>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="space-y-2">
                      <Calendar
                        disabled={(date) => {
                          const now = new Date();
                          const eventDate = activity.dateEvent
                            ? new Date(activity.dateEvent)
                            : undefined;

                          if (!eventDate) {
                            // Nếu chưa có ngày sự kiện thì chỉ cần chọn sau ngày hiện tại
                            return date < now;
                          }

                          // Cho chọn từ hôm nay tới ngày diễn ra sự kiện
                          return date < now || date > eventDate;
                        }}
                        mode="single"
                        selected={
                          activity.endTicketSale
                            ? new Date(activity.endTicketSale)
                            : undefined
                        }
                        onSelect={(date) => {
                          if (!date) return;

                          const updated = [...activities];

                          const old = new Date(
                            activity.endTicketSale || Date.now()
                          );
                          old.setFullYear(date.getFullYear());
                          old.setMonth(date.getMonth());
                          old.setDate(date.getDate());

                          const startDate = activity.startTicketSale
                            ? new Date(activity.startTicketSale)
                            : null;
                          const eventDate = activity.dateEvent
                            ? new Date(activity.dateEvent)
                            : null;

                          if (startDate && old <= startDate) {
                            setErrors((prev) => ({
                              ...prev,
                              [index]: {
                                ...prev[index],
                                endTicketSale:
                                  "Ngày kết thúc bán vé phải sau ngày bắt đầu",
                              },
                            }));
                          } else if (eventDate && old > eventDate) {
                            setErrors((prev) => ({
                              ...prev,
                              [index]: {
                                ...prev[index],
                                endTicketSale:
                                  "Không được kết thúc bán vé sau ngày diễn ra sự kiện",
                              },
                            }));
                          } else {
                            setErrors((prev) => ({
                              ...prev,
                              [index]: { ...prev[index], endTicketSale: "" },
                            }));
                            updated[index].endTicketSale = old.toISOString();
                            setActivities(updated);
                          }
                        }}
                      />

                      <Input
                        type="time"
                        value={
                          activity.endTicketSale
                            ? new Date(activity.endTicketSale)
                                .toTimeString()
                                .slice(0, 5)
                            : "00:00"
                        }
                        onChange={(e) => {
                          const [hour, minute] = e.target.value.split(":");
                          const updated = [...activities];
                          const date = new Date(
                            activity.endTicketSale || new Date()
                          );
                          date.setHours(Number(hour));
                          date.setMinutes(Number(minute));

                          const startDate = activity.startTicketSale
                            ? new Date(activity.startTicketSale)
                            : null;
                          const eventDate = activity.dateEvent
                            ? new Date(activity.dateEvent)
                            : null;

                          if (startDate && date <= startDate) {
                            setErrors((prev) => ({
                              ...prev,
                              [index]: {
                                ...prev[index],
                                endTicketSale:
                                  "Ngày kết thúc bán vé phải sau ngày bắt đầu",
                              },
                            }));
                          } else if (eventDate && date > eventDate) {
                            setErrors((prev) => ({
                              ...prev,
                              [index]: {
                                ...prev[index],
                                endTicketSale:
                                  "Không được kết thúc bán vé sau ngày diễn ra sự kiện",
                              },
                            }));
                          } else {
                            setErrors((prev) => ({
                              ...prev,
                              [index]: { ...prev[index], endTicketSale: "" },
                            }));
                            updated[index].endTicketSale = date.toISOString();
                            setActivities(updated);
                          }
                        }}
                      />
                    </PopoverContent>
                    {errors[index]?.endTicketSale && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors[index]?.endTicketSale}
                      </p>
                    )}
                  </Popover>
                </div>
              </CardContent>
              {!hasSeatMap && (
                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Ticket size={18} /> Vé
                    </h4>
                    <button
                      onClick={() => openTicketModal(index)}
                      className="text-white hover:text-white/80 flex items-center gap-1"
                    >
                      <Plus size={16} /> Thêm vé
                    </button>
                  </div>

                  {activity.tickets?.map((ticket, tIndex) => (
                    <div
                      key={tIndex}
                      className="bg-white relative border p-4 flex justify-between h-auto items-center"
                    >
                      <div className="absolute hidden lg:flex justify-center items-center bg-[#3D5685] top-0 left-0 w-[10%] h-full">
                        <p className="-rotate-90 uppercase">
                          {ticket.ticketName}
                        </p>
                      </div>
                      <div className="lg:pl-[10%] w-[90%] text-black flex flex-col justify-between">
                        <p className="font-bold text-[20px] uppercase mb-2">
                          {ticket.ticketName}
                        </p>
                        <div className="flex flex-col lg:flex-row gap-6">
                          <section className="flex flex-col gap-1">
                            <p className="text-black/80 uppercase text-xs">
                              Số lượng
                            </p>
                            <p className="font-medium bg-[#3D7485] bg-opacity-15 p-2">
                              {ticket.quantity}
                            </p>
                          </section>
                          <section className="flex flex-col gap-1">
                            <p className="text-black/80 uppercase text-xs">
                              Giá
                            </p>
                            <p className="font-medium bg-[#3D7485] bg-opacity-15 p-2">
                              {formatMoney(ticket.price)}
                            </p>
                          </section>
                          <section className="flex flex-col gap-1">
                            <p className="text-black/80 uppercase text-xs">
                              Ngày
                            </p>
                            <p className="font-medium bg-[#3D7485] bg-opacity-15 p-2">
                              {formatDateVietnamese(
                                activity.dateEvent.toString()
                              )}
                            </p>
                          </section>
                          <section className="flex flex-col gap-1">
                            <p className="text-black/80 uppercase text-xs">
                              Thời gian
                            </p>
                            <p className="font-medium bg-[#3D7485] bg-opacity-15 p-2">
                              {formatTimeFe(activity.startTimeEvent) +
                                " - " +
                                formatTimeFe(activity.endTimeEvent)}
                            </p>
                          </section>
                          {/* QR Image */}
                          <div></div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveTicket(index, tIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Popup
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        title="Thêm vé"
      >
        <div className="bg-transparent w-full max-w-md rounded-lg p-4 space-y-4 relative">
          {[
            { label: "Tên vé", key: "ticketName" },
            { label: "Giá", key: "price", type: "number" },
            { label: "Số lượng", key: "quantity", type: "number" },
            { label: "Mua tối đa", key: "maxQuantity", type: "number" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block mb-1 text-sm font-medium">{label}</label>
              <input
                type={type || "text"}
                className="w-full border px-3 py-2 rounded text-black"
                value={(newTicket as any)[key]}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    [key]: e.target.value,
                  }))
                }
              />
            </div>
          ))}
          <button
            onClick={saveTicket}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Save size={18} /> Lưu vé
          </button>
        </div>
      </Popup>

      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
          onClick={() => updateStep(step - 1)}
          disabled={step === 1}
        >
          Quay lại
        </button>

        <button
          className="px-4 py-2 bg-pse-green-second hover:bg-pse-green-third text-white rounded disabled:opacity-50"
          onClick={nextStep}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin">
              <LoaderCircle />
            </div>
          ) : (
            "Tiếp tục"
          )}
        </button>
      </div>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <h3 className="text-lg font-semibold">Xác nhận thay đổi</h3>
            <p className="text-sm text-gray-500">
              Việc chuyển chế độ sơ đồ ghế sẽ xóa toàn bộ dữ liệu hoạt động đã
              nhập. Bạn có chắc chắn không?
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelSeatMapChange}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmSeatMapChange}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StepTwo;
