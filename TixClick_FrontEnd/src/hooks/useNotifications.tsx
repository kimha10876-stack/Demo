import { useEffect, useState } from "react";
import notificationApi from "../services/notificationApi";
import { NotificationResponse } from "../interface/company/Notification";

const useNotifications = () => {
  const [data, setData] = useState<NotificationResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await notificationApi.getAllNotification();
      setData(response.data.result);
    };
    fetchData();
  }, []);
  return data;
};

export default useNotifications;
