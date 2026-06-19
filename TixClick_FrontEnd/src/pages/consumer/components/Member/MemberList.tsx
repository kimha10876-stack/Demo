import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { MemberResponse } from "../../../../interface/consumer/Member";
import { Mail, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { subRoles, TOAST_MESSAGE } from "../../../../constants/constants";
import memberApi from "../../../../services/memberApi";
import { toast } from "sonner";
import { Switch } from "../../../../components/ui/switch";
import { Label } from "../../../../components/ui/label";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

type MemberProps = {
  members: MemberResponse[] | undefined;
  fetchMembers: () => void;
};

const MemberList: React.FC<MemberProps> = ({ members, fetchMembers }) => {
  const [editMemberId, setEditMemberId] = useState<number | null>(null);
  const [selectedSubRole, setSelectedSubRole] = useState<string>("");

  const saveEditMemberId = async (memberId: number) => {
    if (editMemberId === memberId) {
      // Gọi API cập nhật subRole
      try {
        // Fake API call
        const response = await memberApi.editSubRole(
          editMemberId,
          selectedSubRole
        );
        //
        if (response.data.result == true) {
          toast.success(TOAST_MESSAGE.successUpdateMember);
        }

        await fetchMembers();
        setEditMemberId(null);
      } catch (error) {
        console.error("Lỗi khi cập nhật subRole:", error);
      }
    } else {
      // Khi ấn "Chỉnh sửa" thì lưu subRole hiện tại
      const member = members?.find((m) => m.memberId === memberId);
      setSelectedSubRole(member?.subRole || "");
      setEditMemberId(memberId);
    }
  };

  const changeStatusMember = async (checked: boolean, memberId: number) => {
    const editStatusResonse = await memberApi.changeStatus(
      memberId,
      checked ? "ACTIVE" : "INACTIVE"
    );
    console.log(editStatusResonse);
    await fetchMembers();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members?.map((member) => (
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          key={member.memberId}
          className={`${member.status == "ACTIVE" ? "bg-none" : "bg-white/85"}`}
        >
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl flex gap-1 items-center max-md:max-w-[150px] max-w-sm truncate">
                <User size={20} />

                <span className="truncate max-w-40 inline-block">
                  {member.userName}
                </span>
              </CardTitle>
              <CardDescription className="flex gap-1 items-center">
                <Mail size={16} />

                <span className="max-md:max-w-[150px] max-w-sm truncate">
                  {member.email}
                </span>
              </CardDescription>
            </div>
            <CardDescription className="font-semibold">
              {member.memberId === editMemberId ? (
                <Select
                  value={selectedSubRole || member.subRole}
                  onValueChange={(value) => setSelectedSubRole(value)}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Chức vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Chức vụ</SelectLabel>
                      {subRoles.map((subRole) => (
                        <SelectItem key={subRole.id} value={subRole.value}>
                          {subRole.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                member.subRole
              )}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                disabled={member.subRole == "OWNER" ? true : false}
                checked={member.status == "ACTIVE"}
                id="member-status"
                onCheckedChange={(checked) =>
                  changeStatusMember(checked, member.memberId)
                }
              />
              <Label
                htmlFor="member-status"
                className={`${
                  member.status == "ACTIVE"
                    ? "text-pse-success"
                    : "text-pse-error"
                } text-xs`}
              >
                {member.status == "ACTIVE"
                  ? "Đang hoạt động"
                  : "Ngừng hoạt động"}
              </Label>
            </div>

            <Button
              className={`${
                member.subRole == "OWNER"
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={member.subRole == "OWNER" ? true : false}
              onClick={() => saveEditMemberId(member.memberId)}
            >
              {member.memberId === editMemberId ? "Hoàn tất" : "Chỉnh sửa"}
            </Button>
          </CardFooter>
        </MotionCard>
      ))}
    </div>
  );
};

export default MemberList;
