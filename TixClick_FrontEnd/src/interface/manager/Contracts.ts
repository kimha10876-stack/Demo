export interface ContractDTO {
  contractId: number;
  contractName: string;
  totalAmount: number;
  commission: string;
  contractType: string;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  accountId: number;
  eventId: number;
  companyId: number;
}

export interface ContractDocumentDTO {
  contractDocumentId: number;
  contractId: number;
  fileName: string;
  fileURL: string;
  fileType: string;
  uploadedBy: number;
  status: string;
  uploadDate: string | null;
}

export interface ContractResponse {
  contractDTO: ContractDTO;
  contractDocumentDTOS: ContractDocumentDTO[];
}

export interface VietQR {
  bankID: string;
  accountID: string;
  amount: number;
  description: string;
  dueDate?: string;
  status?: ContractPaymentStatus;
}

export interface ContractUpload {
  contractId: number;
  file: string;
}

export interface ContractDetailDTO {
  contractDetailId: number;
  contractDetailName: string;
  contractDetailCode: string;
  description: string;
  contractAmount: number;
  contractPayDate: string;
  status: string;
  contractId: number;
}

export interface Contract {
  contractId: number;
  contractName: string;
  totalAmount: number;
  commission: string;
  contractType: string;
  startDate: string;
  endDate: string;
  status: string;
  accountId: number;
  eventId: number;
  companyId: number;
  contractDetailDTOS: ContractDetailDTO[];
}

export type ContractPaymentStatus = "PENDING" | "PAID" | "OVERDUE";
