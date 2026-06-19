import { SeatTypeEdit } from "../pages/seatmap/Seatmap";
import axiosClient from "./axiosClient";

const ticketUrl = "/ticket";

const ticketApi = {
  createTicketInSeatMap: (data: SeatTypeEdit) => {
    const url = `${ticketUrl}/create-ticket-seat-map`;
    return axiosClient.post(url, data);
  },
  getTicketsByEventId: (eventId: number | null) => {
    const url = `${ticketUrl}/get-tickets-by-event-id/${eventId}`;
    return axiosClient.get(url);
  },
  updateTicket: (data: SeatTypeEdit) => {
    const url = `${ticketUrl}/update-ticket-seat-map`;
    return axiosClient.put(url, data);
  },
  deleteTicket: (ticketCode: string) => {
    const url = `${ticketUrl}/delete/${ticketCode}`;
    return axiosClient.delete(url);
  },
};

export default ticketApi;
