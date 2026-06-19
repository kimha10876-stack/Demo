export interface ChangeTicketRequest {
  ticketPurchaseRequests: TicketPurchaseRequest[];
  ticketChange: TicketChange[];
  orderCode: string;
}

export interface TicketPurchaseRequest {
  ticketPurchaseId: number;
}

export interface TicketChange {
  zoneId: number;
  seatId: number;
  eventActivityId: number;
  ticketId: number;
  eventId: number;
  quantity: number;
}
