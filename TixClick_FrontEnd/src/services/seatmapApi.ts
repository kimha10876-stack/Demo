import { ISection } from "../pages/seatmap/Seatmap";
import axiosClient from "./axiosClient";

const seatmapUrl = "/seat-map";

const seatmapApi = {
  createSeatmap: (data: ISection[], eventId: number) => {
    const url = `${seatmapUrl}/design-seatmap?eventId=${eventId}`;
    return axiosClient.post(url, data);
  },
  getSections: (eventId: number) => {
    const url = `${seatmapUrl}/sections/${eventId}`;
    return axiosClient.get(url);
  },
  deleteSections: (zoneId: string, eventId: number, data: ISection[]) => {
    const url = `${seatmapUrl}/zones/${zoneId}/events/${eventId}`;
    return axiosClient.delete(url, { data: data });
  },
  getSeatmapConsumer: (eventId: number, eventActivityId: number) => {
    const url = `${seatmapUrl}/events/${eventId}/activities/${eventActivityId}`;
    return axiosClient.get(url);
  },
};

export default seatmapApi;
