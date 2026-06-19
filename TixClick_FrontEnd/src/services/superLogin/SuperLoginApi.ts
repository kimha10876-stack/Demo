import { LoginRequest } from "../../interface/superLogin/Login";
import axiosClient from "../axiosClient";

const baseURL = "/auth";

const superLoginApi = {
  login(data: LoginRequest) {
    const url = `${baseURL}/login_with_manager_and_admin`;
    return axiosClient.post(url, data);
  },
};

export default superLoginApi;
