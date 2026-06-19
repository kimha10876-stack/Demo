import { useEffect, useState } from "react";
import {
  OrderResponse,
  SortType,
  TicketResponse,
} from "../interface/ticket/Ticket";
import ticketPurchase from "../services/TicketPurchase/ticketPurchase";
import useDebounce from "../hooks/useDebounce"; // 🔄 Nhớ sửa đường dẫn nếu khác

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
};

const useTicketsPurchases = () => {
  const [ticketPurchases, setTicketPurchases] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [sort, setSort] = useState<SortType>("DESC");
  const [searchEventName, setSearchEventName] = useState<string>("");
  const debouncedSearch = useDebounce(searchEventName, 500);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 3,
  });

  const fetchTicketPurchases = async (
    pageToFetch: number,
    sortToFetch: SortType
  ) => {
    setLoading(true);
    try {
      const res = await ticketPurchase.getAll({
        page: pageToFetch,
        sortDirection: sortToFetch,
      });
      const result = res.data.result;

      setTicketPurchases(result.items || []);
      setPagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalElements: result.totalElements,
        pageSize: result.pageSize,
      });
    } catch (error) {
      console.error("Lỗi fetch ticket purchases:", error);
      setTicketPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketPurchases(page, sort);
  }, [page, sort]);

  return {
    ticketPurchases,
    loading,
    pagination,
    page,
    setPage,
    sort,
    setSort,
    searchEventName,
    setSearchEventName,
    refetch: () => fetchTicketPurchases(page, sort),
  };
};

export default useTicketsPurchases;
