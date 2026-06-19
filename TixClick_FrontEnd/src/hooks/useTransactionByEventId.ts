import { useEffect, useState } from "react";
import { TransactionResponse } from "../interface/company/Transaction";
import transactionApi from "../services/transactionApi";
import { Pagination } from "./useTicketPurchases";
import { SortType } from "../interface/ticket/Ticket";

const useTransactionByEventId = (eventId: number) => {
  const [transactions, setTransactions] = useState<TransactionResponse[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [sort, setSort] = useState<SortType>("DESC");
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 3,
  });

  const fetchTransaction = async (page: number, sort: SortType) => {
    setLoading(true);
    try {
      const response = await transactionApi.getByEventId(Number(eventId), {
        page: page,
        sortDirection: sort,
      });
      const result = response.data.result;

      setTransactions(result.items || []);
      setPagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalElements: result.totalElements,
        pageSize: result.pageSize,
      });
    } catch (error) {
      console.log(error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction(page, sort);
  }, [eventId, page, sort]);
  return {
    transactions,
    loading,
    pagination,
    page,
    setPage,
    sort,
    setSort,
    refetch: () => fetchTransaction(page, sort),
  };
};

export default useTransactionByEventId;
