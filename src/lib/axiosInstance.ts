import axios, { type AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/api/v1",

  // Important for HttpOnly cookie auth.
  // Browser will attach backend cookies to API requests.
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;