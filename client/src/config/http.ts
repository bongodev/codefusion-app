import axios, { type AxiosInstance } from "axios";
import { envConfig } from "./envConfig";

const API_BASE_URL = envConfig.VITE_API_URL;

const http: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default http;
