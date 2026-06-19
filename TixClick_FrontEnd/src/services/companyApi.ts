import axiosClient from "./axiosClient";

const baseUrl = "/company";
const companyApi = {
  create: (data: FormData) => {
    const url = `${baseUrl}/create`;
    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  createDocumentCompany: (data: FormData) => {
    const url = `/company-document/create`;
    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  createCompanyandDocument: (data: FormData) => {
    const url = `${baseUrl}/create-company-and-document`;
    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getCompaniesByAccountId: () => {
    const url = `${baseUrl}/get-company-by-account-id`;
    return axiosClient.get(url);
  },
  isAccountHaveCompany: () => {
    const url = `${baseUrl}/is-account-have-company`;
    return axiosClient.get(url);
  },
  getByEventId: (eventId: number) => {
    const url = `${baseUrl}/get-company-by-event-id/${eventId}`;
    return axiosClient.get(url);
  },
  update: (data: FormData, companyId: number | undefined) => {
    const url = `${baseUrl}/${companyId}`;
    return axiosClient.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getListCompany() {
    const url = `${baseUrl}/get-list-company-by-account-id`;
    return axiosClient.get(url);
  },
};

export default companyApi;
