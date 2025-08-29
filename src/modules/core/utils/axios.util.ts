import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
const axiosDefaults: CreateAxiosDefaults = {
  headers: {
    "X-Susant": "true",
    "User-Agent": "BazzarifyConsumer",
    "Content-Type": "application/json",
    "X-APP-Key": process.env.X_APP_KEY || "",
  },
};
const baseURL =
  process.env.API_URL ||
  "http://local-ne.bazzarify.local:8081/api/v1/consumers";

const authUrl =
  process.env.AUTH_URL || "http://local-ne.bazzarify.local:8081/api/v1/auth";

const defaultConfig: CreateAxiosDefaults = { ...axiosDefaults, baseURL };
const authConfig: CreateAxiosDefaults = { ...axiosDefaults, baseURL: authUrl };

const axiosInstance: AxiosInstance = axios.create(defaultConfig);
export const authAxiosInstance: AxiosInstance = axios.create(authConfig);

export default axiosInstance;
