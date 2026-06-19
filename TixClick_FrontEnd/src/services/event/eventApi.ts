import { Activity } from "../../components/CreateEvent/steps/StepTwo";
import axiosClient from "../axiosClient";

const eventApi = {
  createEventActivity: (data: Activity[], contractCode: string | null) => {
    const url = "/event-activity/create";
    return axiosClient.post(url, data, { params: { contractCode } });
  },
};

export default eventApi;
