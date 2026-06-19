import axiosClient from "./axiosClient";

const ticketMappingUrl = "/ticket-mapping";

const ticketMappingApi = {
  getAllByAcitivityEventId: (eventActivityId: number) => {
    const url = `${ticketMappingUrl}/get-ticket-mapping-by-event-activity-id/${eventActivityId}`;
    return axiosClient.get(url);
  },
};

export default ticketMappingApi;
