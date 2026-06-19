export interface VoucherRequest {
  voucherName: string;
  voucherCode: string;
  discount: number;
  eventId: number;
  quantity: number;
  startDate: string;
  endDate: string;
}

export interface VoucherResponse extends VoucherRequest {
  voucherId: number;
  createdDate: string;
  status: VoucherStatus;
  accountId: number;
}

export type VoucherStatus = "ALL" | "ACTIVE" | "INACTIVE" | "EXPIRED";
