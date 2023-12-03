import axios from "axios";
import { BASE_URL } from "../lib/constants";

export const axiosApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

axiosApi.defaults.headers.common["Content-Type"] = "application/json";

axiosApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosApi.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      window.location.href = "/";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
