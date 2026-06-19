import { Contract } from "../../interface/manager/Contracts";
import axiosClient from "../axiosClient";

const refreshTokenRequest = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token");

  const response = await axiosClient.post("/auth/refresh-token", {
    refreshToken,
  });

  const newAccessToken = response.data.result.accessToken;
  localStorage.setItem("accessToken", newAccessToken);
  return newAccessToken;
};

const authorizedRequest = async (method: "get" | "post" | "patch", url: string, data?: any, config = {}) => {
  try {
    const token = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${token}`,
      ...(config as any).headers,
    };
    return await axiosClient({ method, url, data, ...config, headers });
  } catch (error: any) {
    if (error.response?.status === 401) {
      const newToken = await refreshTokenRequest();
      const headers = {
        Authorization: `Bearer ${newToken}`,
        ...(config as any).headers,
      };
      return await axiosClient({ method, url, data, ...config, headers });
    }
    throw error;
  }
};

const managerApi = {
  getAllCompany() {
    return authorizedRequest("get", "/company/manager");
  },

  getAllContract() {
    return authorizedRequest("get", "/contract/all");
  },

  getContractDetails(contractId: number) {
    return authorizedRequest("get", `/contract-detail/get/${contractId}`);
  },

  confirmContractPaymentPay(transactionCode: string, paymentId: number) {
    return authorizedRequest("get", `/contract-payment/pay?transactionCode=${transactionCode}&paymentId=${paymentId}`);
  },

  getAllPayment() {
    return authorizedRequest("get", "/contract-payment/get");
  },

  getAllEvent() {
    return authorizedRequest("get", "/event/all_scheduled_pending_approved", { timeout: 10000 });
  },

  getContractsByEventId(eventId: number) {
    return authorizedRequest("get", `/contract-document/all_by_event/${eventId}`, { timeout: 10000 });
  },

  approveCompany(status: string, companyVerificationId: number) {
    return authorizedRequest("patch", `/company-verification/${companyVerificationId}/approve?status=${status}`, {}, { timeout: 10000 });
  },

  approveEvent(status: string, eventId: number) {
    return authorizedRequest("post", `/event/approve/${eventId}/${status}`, {}, {
      headers: { Accept: "*/*" },
      timeout: 10000,
    });
  },

  uploadContractDocument(contractId: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return authorizedRequest("post", `/contract-document/upload?contractId=${contractId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadContractManager(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return authorizedRequest("post", "/contract/createContractAndContractDetail", formData, {
      headers: {
        "Content-Type": "application/pdf",
        Accept: "*/*",
      },
      timeout: 30000,
    });
  },

  updateContract(request: Contract) {
    return authorizedRequest("post", "/contract/createContractAndContractDetail", request);
  },

  payContractPayment(transactionCode: string, paymentId: number) {
    return authorizedRequest("get", `/contract-payment/pay?transactionCode=${transactionCode}&paymentId=${paymentId}`);
  },

  getQrByContractId(contractId: number | undefined) {
    return authorizedRequest("get", `/contract-detail/qr/${contractId}`);
  },

  cancelEvent(eventId: number, status: string) {
    return authorizedRequest("post", `/event/approve/${eventId}/${status}`, {}, {
      headers: { Accept: "*/*" },
      timeout: 10000,
    });
  },

  // tôi muốn có một box để hiện lên khi bấm nút hủy sự kiên để xác nhận bànj có chắc hủy sự kiện hay không và nêú xác nhận thì call api trong hình và nếu thành công thì mới hiện hộp hủy sự kiện chứa import với export
  exportRefund(eventId: number) {
    return authorizedRequest("get", `/payment/export_refund/${eventId}`, null, {
      responseType: "blob",
      headers: { Accept: "*/*" },
    }).then(response => {
      // Create a blob URL and trigger download
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'refund_data.xlsx';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response;
    });
  },

  importRefund(file: FormData) {
  
    return authorizedRequest("post", "/payment/import_refund", file, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}



export default managerApi;
