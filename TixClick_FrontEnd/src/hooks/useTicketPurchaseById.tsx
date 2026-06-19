import { useEffect, useState } from "react";
import { TicketResponse } from "../interface/ticket/Ticket";
import ticketPurchase from "../services/TicketPurchase/ticketPurchase";

const useTicketPurchaseById = (ticketPurchaseId: number) => {
  const [ticket, setTicket] = useState<TicketResponse | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>();

  const fetchData = async (ticketPurchaseId: number) => {
    setLoading(true);
    try {
      const res = await ticketPurchase.getOne(ticketPurchaseId);
      if (res.data.code == 200) {
        setTicket(res.data.result);
      } else {
        setTicket(undefined);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(ticketPurchaseId);
  }, [ticketPurchaseId]);

  return { ticket, loading };
};

export default useTicketPurchaseById;
