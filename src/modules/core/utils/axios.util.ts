import axios, {AxiosInstance, CreateAxiosDefaults} from "axios";


export const axiosDefaults: CreateAxiosDefaults = {
    headers: {
        "X-Susant": "true",
        "User-Agent": "BazzarifyConsumer",
        "Content-Type": "application/json",
        "X-APP-Key": process.env.X_APP_KEY || "",
    },
};
const consumerUrl =
    process.env.API_URL ||
    "http://local-ne.larashops.local:8081/api/v1/consumers";
const authUrl =
    process.env.AUTH_URL || "http://local-ne.larashops.local:8081/api/v1/auth";
const marketingUrl = process.env.MARKETING_URL || "http://local-ne.larashops.local:8081/api/v1/marketing";
const consumerConfig: CreateAxiosDefaults = {...axiosDefaults, baseURL: consumerUrl};
const authConfig: CreateAxiosDefaults = {...axiosDefaults, baseURL: authUrl};
const marketingConfig: CreateAxiosDefaults = {...axiosDefaults, baseURL: marketingUrl};

const consumerInstance: AxiosInstance = axios.create(consumerConfig);
export const authAxiosInstance: AxiosInstance = axios.create(authConfig);
export const marketingInstance: AxiosInstance = axios.create(marketingConfig);

export const getHeadersWithToken = (token: string) => {
    return {...authConfig.headers, Authorization: `Bearer ${token}`};
}

/**
 * Creates an authenticated axios instance with the provided token
 * Merges the token with existing authConfig
 *
 * @param token The authentication token
 * @returns AxiosInstance configured with the token
 */
export const createAuthAxiosInstance = (token: string): AxiosInstance => {
    const configWithToken: CreateAxiosDefaults = {
        ...authConfig,
        headers: {
            ...authConfig.headers,
            Authorization: `Bearer ${token}`
        }
    };
    return axios.create(configWithToken);
}

export const createConsumerAxiosInstance = (token: string): AxiosInstance => {
    const configWithToken: CreateAxiosDefaults = {
        ...consumerConfig,
        headers: {
            ...consumerConfig.headers,
            Authorization: `Bearer ${token}`
        }
    };
    return axios.create(configWithToken);
}

export default consumerInstance;
