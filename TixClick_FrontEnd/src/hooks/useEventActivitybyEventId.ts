import { useEffect, useState } from "react";
import { EventActivityResponse } from "../interface/event/EventActivity";
import eventActivityApi from "../services/eventActivityApi";

const useEventActivitybyEventId = (eventId: number) => {
  const [activity, setActivity] = useState<EventActivityResponse[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const res = await eventActivityApi.getByEventId(eventId);
      if (res.data.code == 200) {
        setActivity(res.data.result);
      }
    } catch (error) {
      console.error(error);
      setActivity([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  return { activity, loading };
};

export default useEventActivitybyEventId;
