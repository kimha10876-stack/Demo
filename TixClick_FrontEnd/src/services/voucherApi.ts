import { VoucherRequest, VoucherStatus } from "../interface/company/Voucher";
import axiosClient from "./axiosClient";

const voucherUrl = `/voucher`;

const voucherApi = {
  create: (data: VoucherRequest) => {
    const url = `${voucherUrl}/create`;
    return axiosClient.post(url, data);
  },
  getAll: (eventId: number, status: string) => {
    const url = `${voucherUrl}/all/${eventId}/${status}`;
    return axiosClient.get(url);
  },
  changeStatus: (voucherId: number, status: VoucherStatus) => {
    const url = `${voucherUrl}/change-status/${voucherId}`;
    return axiosClient.put(url, null, { params: { status } });
  },
  check(voucherCode: string, eventId: number) {
    const url = `${voucherUrl}/check/${voucherCode}/${eventId}`;
    return axiosClient.get(url);
  },
  delete(voucherId: number) {
    const url = `${voucherUrl}/delete/${voucherId}`;
    return axiosClient.delete(url);
  },
};

export default voucherApi;
