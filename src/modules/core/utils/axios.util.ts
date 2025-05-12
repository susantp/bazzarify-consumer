import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";

const remoteData: Record<string, string> = {
  apiUrl:
    process.env.API_URL ||
    "http://local-ne.bazzarify.local:8081/api/v1/consumers",
  appKey: process.env.EXPO_PUBLIC_APP_KEY || "",
};
const defaultConfig: CreateAxiosDefaults = {
  baseURL: remoteData.apiUrl,
  headers: {
    "User-Agent": "BazzarifyConsumer",
    "Content-Type": "application/json",
    "X-APP-Key": remoteData.appKey,
  },
};

const axiosInstance: AxiosInstance = axios.create(defaultConfig);

export default axiosInstance;
