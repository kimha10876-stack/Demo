import { OrderList } from "./OrderList";
import { useParams } from "react-router";
import useTransactionByEventId from "../../../../../hooks/useTransactionByEventId";
import Pagination from "../../../../../components/Pagination/Pagination";
import { SortType } from "../../../../../interface/ticket/Ticket";

const Order = () => {
  const { eventId } = useParams();
  const {
    transactions,
    setPage,
    sort,
    setSort,
    pagination: { currentPage, pageSize, totalElements, totalPages },
  } = useTransactionByEventId(Number(eventId));
  return (
    <div className="flex flex-col p-6 bg-white w-auto min-h-[calc(100vh-64px)]]">
      <p className="font-bold text-foreground text-3xl"></p>
      <OrderList
        sort={sort}
        setSort={(e: string) => setSort(e as SortType)}
        transactions={transactions}
      />
      <section className="mt-auto">
        <Pagination
          currentPage={currentPage + 1}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage - 1)}
        />
      </section>
    </div>
  );
};

export default Order;
