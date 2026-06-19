import { TransactionParams } from "../interface/company/Transaction";
import axiosClient from "./axiosClient";

const transactionUrl = "/transaction";

const transactionApi = {
  getByEventId: (eventId: number, params: TransactionParams) => {
    const url = `${transactionUrl}/total_transaction_company/${eventId}`;
    return axiosClient.get(url, { params: params });
  },
};

export default transactionApi;
