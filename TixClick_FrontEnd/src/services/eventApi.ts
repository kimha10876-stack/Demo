import axiosClient from "./axiosClient";

const baseURL = "/event";

const eventApi = {
  create: (data: FormData) => {
    const url = `${baseURL}/create`;
    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update: (data: FormData) => {
    const url = `${baseURL}/update`;
    return axiosClient.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  approveEvent: (eventId: number) => {
    const url = `${baseURL}/request-approval/${eventId}`;
    return axiosClient.get(url);
  },
  getEventList: () => {
    const url = `${baseURL}/consumer/scheduled`;
    return axiosClient.get(url);
  },
  getEventDetail: (id: number) => {
    const url = `${baseURL}/consumer/${id}`;
    return axiosClient.get(url);
  },
  countView: (eventId: number) => {
    const url = `${baseURL}/count-view/${eventId}`;
    return axiosClient.post(url);
  },
  search: (params: {
    eventName: string | null;
    eventCategoryId: number;
    minPrice: number;
    city: string | null;
    page: number;
  }) => {
    const url = `${baseURL}/search`;
    return axiosClient.get(url, { params: params });
  },
  getAllByCompany: (companyId: number | undefined, page: number) => {
    const url = `${baseURL}/dashboard/${companyId}`;
    return axiosClient.get(url, { params: { page } });
  },
  getRevenue: (eventId: number) => {
    const url = `${baseURL}/dashboard/event-activity/${eventId}`;
    return axiosClient.get(url);
  },
  getCheckIn: (eventActivityId: number) => {
    const url = `${baseURL}/checkin/ticket-type/${eventActivityId}`;
    return axiosClient.get(url);
  },
  getSummary: (eventId: number) => {
    const url = `${baseURL}/summary/${eventId}`;
    return axiosClient.get(url);
  },
  getWeekend: () => {
    const url = `${baseURL}/consumer/weekend`;
    return axiosClient.get(url);
  },
  getMonth: (month: number) => {
    const url = `${baseURL}/consumer/month/${month}`;
    return axiosClient.get(url);
  },
  getByCategory: (eventCategoryId: number, status: string) => {
    const url = `${baseURL}/consumer/event-category/${eventCategoryId}?status=${status}`;
    return axiosClient.get(url);
  },
  getTop10: () => {
    const url = `${baseURL}/consumer/top-10`;
    return axiosClient.get(url);
  },
  getBuyers: (eventActivityId: number | undefined) => {
    const url = `${baseURL}/list-consumer/${eventActivityId}`;
    return axiosClient.get(url);
  },
  exportConsumers: (eventActivityId: number | undefined) => {
    const url = `${baseURL}/export-consumers/${eventActivityId}`;
    return axiosClient.get(url, {
      responseType: "blob",
    });
  },
};

export default eventApi;
