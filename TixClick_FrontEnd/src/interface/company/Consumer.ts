export interface Consumer {
  username: string;
  email: string;
  phone: string;
  ticketPurchases: TicketPurchase[];
  cccd: string;
  mssv: string;
}

interface TicketPurchase {
  orderId: number;
  orderCode: string;
  ticketPurchases: TicketPurchase2[];
  haveCheckin: boolean;
}

interface TicketPurchase2 {
  ticketPurchaseId: number;
  price: number;
  seatCode: string;
  ticketType: string;
  zoneName: string;
  quantity: number;
}
