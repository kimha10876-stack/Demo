export interface TicketOrderRequest {
  ticketOrderDTOS: TicketOrderDTO[];
  voucherCode: string;
}

export interface TicketOrderDTO {
  ticketPurchaseId: number;
  quantity: number;
}
