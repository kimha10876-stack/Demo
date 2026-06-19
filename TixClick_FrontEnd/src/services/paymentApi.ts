import axiosClient from "./axiosClient";

const paymentUrl = `/payment`;

const paymentApi = {
  callback(params: any) {
    const url = `${paymentUrl}/payos_call_back`;
    return axiosClient.get(url, { params });
  },
};

export default paymentApi;
