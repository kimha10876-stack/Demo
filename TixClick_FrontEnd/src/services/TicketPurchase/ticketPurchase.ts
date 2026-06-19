import { ChangeTicketRequest } from "../../interface/ticket/ChangeTicket";
import { ChangeTicket, TicketParams } from "../../interface/ticket/Ticket";
import { TicketPurchaseRequest } from "../../pages/TicketBookingNoneSeatmap";
import axiosClient from "../axiosClient";

const ticketPurchaseUrl = "/ticket-purchase";

const ticketPurchase = {
  create: () => {
    const url = `${ticketPurchaseUrl}/create`;
    return axiosClient.post(url);
  },
  createPurchase: (data: TicketPurchaseRequest) => {
    const url = `${ticketPurchaseUrl}/create`;
    return axiosClient.post(url, data);
  },
  changeTicket(data: any) {
    const url = `/payment/change-ticket`;
    return axiosClient.post(url, data);
  },
  getAll(params: TicketParams) {
    const url = `${ticketPurchaseUrl}/all_of_account`;
    return axiosClient.get(url, { params: params });
  },
  getOne(ticketPurchaseId: number) {
    const url = `${ticketPurchaseUrl}/${ticketPurchaseId}`;
    return axiosClient.get(url);
  },
};

export default ticketPurchase;
