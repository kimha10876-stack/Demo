export interface CreateMemberRequest {
  companyId: number;
  mailList: MailList[];
}

export interface MailList {
  mail: string;
  subRole: SubRole;
}

export interface MemberResponse {
  memberId: number;
  subRole: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  lastName: string;
  firstNane: string;
  status: MemberStatus;
}

export interface MemberActivityRequest {
  eventActivityId: number;
  memberIds: number[];
}

export interface MemberOfTaskResponse {
  member: MemberResponse;
  memberActivityId: number;
  status: string;
  eventActivityId: number;
}

export type SubRole = "ADMIN" | "EMPLOYEE";

export type MemberStatus = "ACTIVE" | "INACTIVE";
