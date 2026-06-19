import axiosClient from "./axiosClient";

const baseURL = "/notification";

const notificationApi = {
  getAllNotification: () => {
    const url = `${baseURL}/notifications`;
    return axiosClient.get(url);
  },
};

export default notificationApi;
