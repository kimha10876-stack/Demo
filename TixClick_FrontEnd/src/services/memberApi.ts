import {
  CreateMemberRequest,
  MemberActivityRequest,
  MemberStatus,
} from "../interface/consumer/Member";
import axiosClient from "./axiosClient";

const memberUrl = `/member`;

const memberApi = {
  create: (data: CreateMemberRequest) => {
    const url = `${memberUrl}/create`;
    return axiosClient.post(url, data);
  },
  getMembers: (companyId: number) => {
    const url = `${memberUrl}/get/${companyId}`;
    return axiosClient.get(url);
  },
  editSubRole: (id: number, subrole: string) => {
    const url = `${memberUrl}/update/${id}/${subrole}`;
    return axiosClient.put(url);
  },
  changeStatus: (id: number, status: MemberStatus) => {
    const url = `${memberUrl}/update-status/${id}/${status}`;
    return axiosClient.put(url);
  },
  addMemberToActivity: (data: MemberActivityRequest) => {
    const url = `/member-activity`;
    return axiosClient.post(url, data);
  },
  getMembersByEventActivityId: (eventActivityId: number) => {
    const url = `/member-activity/${eventActivityId}`;
    return axiosClient.get(url);
  },
  deleteMemberOfActivity(
    memberActivityId: number,
    companyId: number | undefined
  ) {
    const url = `/member-activity/${memberActivityId}/${companyId}`;
    return axiosClient.delete(url);
  },
};

export default memberApi;
