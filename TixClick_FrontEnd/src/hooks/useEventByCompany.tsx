import { useEffect, useState } from "react";
import { EventDetailResponse } from "../interface/EventInterface";
import eventApi from "../services/eventApi";
import { Pagination } from "./useTicketPurchases";

const useEventByCompany = (companyId: number | undefined) => {
  const [events, setEvents] = useState<EventDetailResponse[] | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 6,
  });

  const fetchEvents = async (companyId: number | undefined, page: number) => {
    if (!companyId) return;
    setLoading(true);
    try {
      const res = await eventApi.getAllByCompany(companyId, page);
      const result = res.data.result;

      setEvents(result.items || []);
      setPagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalElements: result.totalElements,
        pageSize: result.pageSize,
      });
    } catch (error) {
      console.error("Lỗi fetch events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(companyId, page);
  }, [companyId, page]);

  return {
    events,
    loading,
    pagination,
    page,
    setPage,
    refetch: () => fetchEvents(companyId, page),
  };
};

export default useEventByCompany;
