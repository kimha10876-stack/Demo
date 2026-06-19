import axios, { AxiosError } from "axios";
import authApi from "./authApi";

const axiosClient = axios.create({
  baseURL: "https://tixclick.site/api",
  // httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const axiosResponseError = error as AxiosError<{
      code: number;
      message: string;
    }>;

    const originalRequest = error.config;

    // Nếu lỗi 401 và không phải đang gọi refresh token
    if (
      axiosResponseError.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;
      delete axiosClient.defaults.headers.common["Authorization"];
      delete originalRequest.headers["Authorization"];
      try {
        const refreshTokenResponse = await authApi.refreshAccessToken();
        console.log(refreshTokenResponse);
        const newAccessToken = refreshTokenResponse.data.result.accessToken;
        // const refreshToken = refreshTokenResponse.data.result.refreshToken;
        console.log(newAccessToken);

        // Cập nhật token mới vào localStorage và header
        localStorage.setItem("accessToken", newAccessToken);
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry lại request ban đầu
        return axiosClient(originalRequest);
      } catch (error) {
        console.error("Lỗi khi lấy refresh token", error);
        localStorage.clear();
        // window.location.href = "/auth/signin"; // Redirect về login nếu refresh token không hợp lệ
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
