import { useEffect, useState } from "react";
import eventApi from "../services/eventApi";
import { Consumer } from "../interface/company/Consumer";

const useConsumerWithOrder = (eventActivityId: number | undefined) => {
  const [consumers, setConsumers] = useState<Consumer[]>();
  const [loading, setLoading] = useState<boolean>();
  const fetchData = async () => {
    if (!eventActivityId) return;
    setLoading(true);
    try {
      const res = await eventApi.getBuyers(eventActivityId);
      if (res.data.code == 200) {
        setConsumers(res.data.result);
      }
    } catch (error) {
      console.error(error);
      setConsumers([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [eventActivityId]);
  return { consumers, loading };
};

export default useConsumerWithOrder;
