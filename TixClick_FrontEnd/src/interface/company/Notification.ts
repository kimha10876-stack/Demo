export interface NotificationResponse {
  accountId: number;
  createdDate: string;
  message: string;
  read: boolean;
  readDate: string | null;
}
