import NoEvent from "../../../../../assets/NoEvent.png";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import eventActivityApi from "../../../../../services/eventActivityApi";
import { EventActivityResponse } from "../../../../../interface/event/EventActivity";
import {
  MemberOfTaskResponse,
  MemberResponse,
} from "../../../../../interface/consumer/Member";
import companyApi from "../../../../../services/companyApi";
import memberApi from "../../../../../services/memberApi";
import { toast } from "sonner";
import { Card } from "../../../../../components/ui/card";
import { CalendarDays, Clock, Ticket, Trash2, User } from "lucide-react";
import { formatDateVietnamese } from "../../../../../lib/utils";
import { Button } from "../../../../../components/ui/button";
import { Checkbox } from "../../../../../components/ui/checkbox";
import Popup from "../../../../../components/Popup/Popup";
import EmptyList from "../../../../../components/EmptyList/EmptyList";
import useCompany from "../../../../../hooks/useCompany";

const Tasks = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { company } = useCompany();
  const [tasks, setTasks] = useState<EventActivityResponse[]>([]);
  const [isOpenMenu, setIsOpenMenu] = useState<Record<number, boolean>>({});
  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [assignments, setAssignments] = useState<Record<number, number[]>>({});
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [memberOfTask, setMemberOfTask] = useState<MemberOfTaskResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await eventActivityApi.getByEventId(Number(eventId));
      if (response.data.result.length != 0) {
        setTasks(response.data.result);
      } else {
        setTasks([]);
      }
    };
    fetchData();
  }, [eventId]);

  const fetchMembers = async () => {
    const companyId = (await companyApi.isAccountHaveCompany()).data.result
      .companyId;
    const response = await memberApi.getMembers(companyId);
    if (response.data.result.length != 0) {
      setMembers(response.data.result);
    }
  };
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembersOfTask = async (eventActivityId: number) => {
    memberApi
      .getMembersByEventActivityId(eventActivityId)
      .then((response) => {
        if (response.data.result.length != 0) {
          setMemberOfTask(response.data.result);
        } else {
          setMemberOfTask([]);
        }
      })
      .catch((error) => {
        console.error(error);
        setMemberOfTask([]);
      });
  };

  const toggleMenu = (id: number) => {
    setIsOpenMenu((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleMemberForTask = (activityId: number, memberId: number) => {
    setAssignments((prev) => {
      const currentMembers = prev[activityId] || [];
      const isSelected = currentMembers.includes(memberId);

      return {
        ...prev,
        [activityId]: isSelected
          ? currentMembers.filter((id) => id !== memberId) // bỏ nếu đã có
          : [...currentMembers, memberId], // thêm nếu chưa có
      };
    });
  };

  const handleConfirmAssignment = async (activityId: number) => {
    const assignedMemberIds = assignments[activityId] || [];

    const payload = {
      eventActivityId: activityId,
      memberIds: assignedMemberIds,
    };

    try {
      const response = await memberApi.addMemberToActivity(payload);
      console.log(response.data);
      if (response.data.result.success.length != 0) {
        toast.success(
          `Đã thêm thành công ${response.data.result.success.length} thành viên vào hoạt động`
        );
      }
      if (response.data.result.failed.length != 0) {
        toast.info(
          `${response.data.result.failed.length} thành viên này đã có trong hoạt động`
        );
      }

      // Đóng menu
      setIsOpenMenu((prev) => ({
        ...prev,
        [activityId]: false,
      }));
    } catch (error) {
      console.error("Lỗi khi phân công thành viên:", error);
    }
  };

  const changePopup = async (
    open: boolean,
    eventActivity: EventActivityResponse
  ) => {
    await fetchMembersOfTask(eventActivity.eventActivityId);
    setOpenPopup(open);
  };

  const closePopup = () => {
    setOpenPopup(false);
  };

  const deleteMemberOfActivity = async (
    member: MemberOfTaskResponse,
    companyId: number | undefined
  ) => {
    try {
      const res = await memberApi.deleteMemberOfActivity(
        member.memberActivityId,
        companyId
      );
      if (res.data.code == 200) {
        await fetchMembersOfTask(member.eventActivityId);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // console.log(memberOfTask);
  return (
    <div className="p-6 bg-background text-foreground border min-h-screen">
      <p className="text-2xl font-bold mb-8">Phân chia công việc</p>
      <div>
        {!tasks && (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)]">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <img
                src={NoEvent || "/placeholder.svg"}
                alt="No events"
                className="w-16 h-16 opacity-50"
              />
            </div>
            <p className="text-black/60">
              Không có hoạt động nào của sự kiện này
            </p>
            <NavLink to={`/create-event?id=${eventId}&step=2`}>
              <Button className="my-2 bg-black hover:bg-pse-green transition-all duration-300">
                Thêm hoạt động
              </Button>
            </NavLink>
          </div>
        )}
        {tasks.length != 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((activity) => (
              <Card
                key={activity.eventActivityId}
                className="bg-background h-auto text-foreground shadow-md rounded-2xl border bg-white p-6 space-y-2 border-gray-200"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {activity.activityName}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays className="w-4 h-4" />
                  <span>
                    {formatDateVietnamese(activity.dateEvent.toString())}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {activity.startTimeEvent} - {activity.endTimeEvent}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Ticket className="w-4 h-4" />
                  <span>
                    Bán vé:{" "}
                    {formatDateVietnamese(activity.startTicketSale.toString())}{" "}
                    → {formatDateVietnamese(activity.endTicketSale.toString())}
                  </span>
                </div>

                <div className="relative flex justify-between">
                  <Button
                    onClick={() => changePopup(true, activity)}
                    className="bg-transparent border border-black text-black hover:bg-white/50"
                  >
                    Xem thành viên
                  </Button>
                  <Button
                    onClick={() => toggleMenu(activity.eventActivityId)}
                    className={`border transition-all duration-300 ${
                      isOpenMenu[activity.eventActivityId]
                        ? "bg-pse-green hover:bg-black"
                        : "bg-black hover:bg-pse-green"
                    }`}
                  >
                    Phân công
                  </Button>

                  {isOpenMenu[activity.eventActivityId] && (
                    <div className="absolute top-12 p-2 max-h-[200px] overflow-y-auto text-sm bg-background text-foreground shadow-md rounded-2xl border z-10">
                      <div className="flex ">
                        <p className="ml-2 my-2 text-[18px] italic font-semibold">
                          Danh sách thành viên
                        </p>
                        <button
                          onClick={() =>
                            handleConfirmAssignment(activity.eventActivityId)
                          }
                          className="ml-auto bg-pse-green hover:bg-opacity-80 text-white px-2 py-1 rounded-md"
                        >
                          Xác nhận
                        </button>
                      </div>
                      <div className="w-full h-[1px] bg-pse-gray my-2"></div>
                      <ul className="flex flex-wrap items-center gap-4">
                        {members.map((member) => (
                          <li
                            key={member.memberId}
                            className="flex items-center px-2 py-1 w-full gap-1"
                          >
                            <Checkbox
                              checked={
                                assignments[activity.eventActivityId]?.includes(
                                  member.memberId
                                ) || false
                              }
                              onCheckedChange={() =>
                                toggleMemberForTask(
                                  activity.eventActivityId,
                                  member.memberId
                                )
                              }
                            />
                            <User />
                            <div>
                              <p className="text-xs font-semibold">
                                {member.userName}
                              </p>
                              <p className="text-xs">{member.email}</p>
                            </div>
                            <div className="ml-auto font-bold">
                              {member.subRole.toLocaleLowerCase()}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {/* <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                  Event ID: {activity.eventId} · Seatmap ID:{" "}
                  {activity.seatMapId}
                </div> */}
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Show member by event activity */}
      <Popup title="Thành viên" isOpen={openPopup} onClose={closePopup}>
        {memberOfTask.length == 0 && (
          <EmptyList label={`Không có thành viên nào trong hoạt động `} />
        )}
        <ul className="flex flex-wrap gap-4">
          {memberOfTask.map((member) => (
            <li
              key={member.memberActivityId}
              className="flex items-center px-2 py-1 w-full gap-1 border rounded-lg"
            >
              <User />
              <div>
                <p className="text-xs font-semibold">
                  {member.member.userName}
                </p>
                <p className="text-xs">{member.member.email}</p>
              </div>
              <div className="ml-auto font-bold">
                {member.member.subRole.toLocaleLowerCase()}
              </div>
              <button
                onClick={() =>
                  deleteMemberOfActivity(member, company?.companyId)
                }
              >
                <span>
                  <Trash2 className="text-pse-error" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Popup>
    </div>
  );
};

export default Tasks;
