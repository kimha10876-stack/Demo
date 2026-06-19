import { useEffect, useState } from "react";
import { EventDetailResponse } from "../../interface/EventInterface";
import EventList from "./components/Search/EventList";
import { FilterEvent } from "./components/Search/FilterEvent";
import { useLocation, useNavigate } from "react-router";
import eventApi from "../../services/eventApi";
import Pagination from "../../components/Pagination/Pagination";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
};
const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [typeEvent, setTypeEvent] = useState<string>("0");
  const [priceRange, setPriceRange] = useState([0]);
  const [events, setEvents] = useState<EventDetailResponse[]>([]);
  const [page, setPage] = useState<number>(0);
  const [pagination, setPagination] = useState<PaginationProps>({
    currentPage: 0,
    pageSize: 6,
    totalElements: 0,
    totalPages: 0,
  });

  const fetchSearchData = async () => {
    const searchParams = new URLSearchParams(location.search);
    const eventName = searchParams.get("event-name");
    const eventCategoryId = searchParams.get("type")
      ? searchParams.get("type")
      : typeEvent;
    const city = searchParams.get("area")
      ? searchParams.get("area")
      : selectedArea;
    const minPrice = searchParams.get("price")
      ? searchParams.get("price")
      : priceRange[0];
    try {
      const res = await eventApi.search({
        eventName: eventName,
        eventCategoryId: Number(eventCategoryId),
        minPrice: Number(minPrice?.toString().trim()),
        city: city,
        page: page,
      });
      setEvents(res.data.result.items || []);
      setPagination((prev) => ({
        ...prev,
        currentPage: res.data.result.currentPage,
        pageSize: res.data.result.pageSize,
        totalElements: res.data.result.totalElements,
        totalPages: res.data.result.totalPages,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSearchData();
  }, [location.search, page]);

  const onChangeSearchParams = (key: string, value: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(key, value);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const onChangeArea = (e: string) => {
    setSelectedArea(e);
    onChangeSearchParams("area", e);
  };

  const onChanngeTypeEvent = (e: string) => {
    setTypeEvent(e);
    onChangeSearchParams("type", e);
  };

  const onChangePriceRange = (e: number[]) => {
    setPriceRange(e);
    onChangeSearchParams("price", e.toString());
  };

  return (
    <div className="grid grid-cols-12 gap-6 min-h-screen mt-[70px] p-4 lg:px-14 bg-[#1e1e1e] text-white">
      <section className="col-span-12 lg:col-span-3 mb-8 lg:mb-0">
        <FilterEvent
          typeEvent={typeEvent}
          onChangeTypeEvent={onChanngeTypeEvent}
          selectedArea={selectedArea}
          onChangeArea={onChangeArea}
          priceRange={priceRange}
          onChangePriceRange={onChangePriceRange}
        />
      </section>

      <section className="col-span-12 lg:col-span-9">
        <EventList eventList={events} />
      </section>
      <section className="col-span-12">
        <Pagination
          currentPage={pagination.currentPage + 1}
          pageSize={pagination.pageSize}
          totalElements={pagination.totalElements}
          totalPages={pagination.totalPages}
          onPageChange={(newPage) => setPage(newPage - 1)}
        />
      </section>
    </div>
  );
};

export default SearchPage;
