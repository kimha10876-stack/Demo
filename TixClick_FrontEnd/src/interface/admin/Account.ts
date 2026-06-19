export interface AdminAccount {
  accountId: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string | null;
  active: boolean;
  avatarURL: string | undefined;
  dob: string | null;
  roleId: number;
}

export interface ManagerAccount {
  email: string;
  username: string;
  role: string;
}

export interface OverviewMetrics {
  totalTransaction: number;
  totalTickets: number;
  totalRevenue: number;
}
