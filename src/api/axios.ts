import axios from "axios";

const BASE_URL = "http://localhost:3000/api/";

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
    // const token = localStorage.getItem("accessToken");
    if (error.response.status === 401) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
