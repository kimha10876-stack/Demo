import { useEffect, useState } from "react";
import ticketApi from "../services/ticketApi";

export interface TicketResponse {
  ticketId: number;
  id: string;
  name: string;
  color: string;
  textColor: string;
  price: number;
  maxQuantity: number;
}

const useTicketByEventId = (eventId: number) => {
  const [tickets, setTickets] = useState<TicketResponse[]>([]);

  const fetchTickets = async () => {
    try {
      const response = await ticketApi.getTicketsByEventId(eventId);
      if (response.data.result) {
        setTickets(response.data.result);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchTickets();
  }, [eventId]);

  return { tickets };
};

export default useTicketByEventId;
