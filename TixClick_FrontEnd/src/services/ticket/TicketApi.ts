import { TicketPurchaseRequest } from "../../interface/ticket/Ticket";
import axiosClient from "../axiosClient";

const ticketApi = {
    getAllTickets() {
        const url = "/ticket-purchase/all_of_account";
        const token = localStorage.getItem('accessToken');
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },

    createTicketPurchase(request: TicketPurchaseRequest) {
        const url = "/ticket-purchase/create";
        const token = localStorage.getItem('accessToken');
        return axiosClient.post(url, request, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json" 
          }
        });
      }
}

export default ticketApi;