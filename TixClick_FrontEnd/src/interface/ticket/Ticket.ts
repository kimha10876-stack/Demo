export interface TicketResponse {
  ticketId: number;
  eventId: number;
  eventActivityId: number;
  ticketPurchaseId: number;
  eventCategoryId: number;
  eventName: string;
  eventDate: Date;
  eventStartTime: string;
  timeBuyTicket: string;
  locationName: string;
  location: string;
  price: number;
  seatCode: string | null;
  ticketType: string;
  qrCode: string;
  zoneName: string | null;
  quantity: number;
  ishaveSeatmap: boolean;
  logo: string;
  banner: string;
}
export interface TicketPurchaseRequest {
  zoneId: number;
  seatId: number;
  eventActivityId: number;
  ticketId: number;
  eventId: number;
  quantity: number;
}

export interface TicketCheckin {
  ticketType: string;
  price: number;
  checkedIn: number;
  total: number;
  totalTicket: number;
  percentage: number;
}

export interface ChangeTicket {
  ticketPurchaseId: number;
  caseTicket: string | null;
}

export interface TicketParams {
  page: number;
  sortDirection: SortType;
}

export type SortType = "ASC" | "DESC";

export interface OrderResponse {
  orderId: number;
  orderCode: string;
  orderDate: string;
  totalPrice: number;
  totalDiscount: number;
  eventId: number;
  eventActivityId: number;
  eventCategoryId: number;
  eventName: string;
  eventDate: Date;
  eventStartTime: string;
  timeBuyOrder: string;
  locationName: string;
  location: string;
  qrCode: string;
  logo: string;
  banner: string;
  ishaveSeatmap: boolean;
  quantityOrdered: number;
  ticketPurchases: TicketPurchase[];
}

export interface TicketPurchase {
  ticketPurchaseId: number;
  price: number;
  seatCode: null | string;
  ticketType: string;
  zoneName: string;
  quantity: number;
}
