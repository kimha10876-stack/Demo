export interface ManagerPayment {
    invoiceNumber: string;
    company: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    date: string;
    dueDate: string;
    status: string;
    paymentMethod: string;
    currency: string;
    paymentType: string;
    installments: Installment[];
}

export interface Installment {
    amount: number;
    dueDate: string;
    status: string;
}

// export interface Payments {
//   paymentId: number;
//   paymentMethod: string;
//   amount: number;
//   paymentDate: string;
//   status: string;
//   orderCode: string;
//   orderId: number;
//   accountId: number;
// }

// export interface AccountGroup {
//   accountId: number
//   payments: Payments[]
//   isExpanded: boolean
// }

export interface ContractDTO {
  contractId: number
  contractCode: string
  contractName: string
  totalAmount: number
  commission: string
  contractType: string
  startDate: string
  endDate: string
  status: string
  accountId: number
  eventId: number
  companyId: number
}

export interface ContractPaymentDTO {
  contractPaymentId: number
  paymentAmount: number
  paymentDate: string | null
  paymentMethod: string
  status: string
  note: string
  contractDetailId: number
  bankName: string
  accountNumber: string
}

export interface ContractPaymentGroup {
  contractDTO: ContractDTO
  contractPaymentDTOList: ContractPaymentDTO[]
}

export interface AccountGroup {
  accountId: number
  payments: ContractPaymentDTO[]
  contractInfo: ContractDTO
  isExpanded: boolean
}
