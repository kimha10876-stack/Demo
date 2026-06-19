import { useEffect, useState } from "react";
import { EventForConsumer } from "../interface/EventInterface";
import { da } from "date-fns/locale";
import eventApi from "../services/eventApi";
import { AxiosError } from "axios";

const useTop10Event = () => {
  const [data, setData] = useState<EventForConsumer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTop10 = async () => {
    setLoading(true);
    try {
      const response = await eventApi.getTop10();
      if (response.data.result) {
        setData(response.data.result);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.log(axiosError);
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTop10();
  }, []);

  return {
    data,
    loading,
    error,
  };
};

export default useTop10Event;
