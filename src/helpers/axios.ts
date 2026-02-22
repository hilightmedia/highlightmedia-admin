import axios from "axios";
import Router from "next/router";
import { toast } from "react-toastify";

import { BACKEND_URI } from "../lib/constant";
import { clearStorage, getAccessToken, getRefreshToken } from "../lib/util";

const BASE_URL = `${BACKEND_URI}/api`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.method?.toLowerCase() !== "get") {
      const message = response?.data?.message;
      if (message) toast.success(message);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    const showErrorToast = (err: any) => {
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong";
      toast.error(message);
    };

    if (error?.response?.status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers["authorization"] = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          clearStorage();
          Router.push("/login");
          showErrorToast(error);
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          { refreshToken },
        );

        const newAccessToken = refreshResponse?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Token refresh failed");
        }

        localStorage.setItem("accessToken", newAccessToken);

        axiosInstance.defaults.headers.common["authorization"] =
          `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers["authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearStorage();
        Router.push("/login");
        showErrorToast(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error?.response?.status === 401) {
      clearStorage();
      Router.push("/login");
    }

    showErrorToast(error);
    return Promise.reject(error);
  },
);

export default axiosInstance;
