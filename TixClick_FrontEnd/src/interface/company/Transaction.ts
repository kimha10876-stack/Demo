import { SortType } from "../ticket/Ticket";

export interface TransactionResponse {
  transactionCode: string;
  accountName: string;
  accountMail: string;
  note: string;
  transactionType: string;
  amount: number;
  transactionDate: Date;
  status: string;
}

export interface TransactionParams {
  page: number;
  sortDirection: SortType;
}
