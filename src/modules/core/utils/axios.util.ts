import axios, {AxiosInstance, CreateAxiosDefaults, RawAxiosRequestHeaders} from "axios";


export const axiosDefaults: CreateAxiosDefaults = {
    headers: {
        "X-Susant": "true",
        "User-Agent": "BazzarifyConsumer",
        "Content-Type": "application/json",
        "X-APP-Key": process.env.X_APP_KEY || "",
        "Authorization": 'Bearer 01994efc-0dbd-70fa-b9fa-30a2d667cfc0|KrDMnjV1Na6fp2pPF14TqzeGlfPK5C7hWLecU1l4176a46da',
    },
};
const baseURL =
    process.env.API_URL ||
    "http://local-ne.bazzarify.local:8081/api/v1/consumers";

const authUrl =
    process.env.AUTH_URL || "http://local-ne.bazzarify.local:8081/api/v1/auth";

const defaultConfig: CreateAxiosDefaults = {...axiosDefaults, baseURL};
const authConfig: CreateAxiosDefaults = {...axiosDefaults, baseURL: authUrl};

const axiosInstance: AxiosInstance = axios.create(defaultConfig);
export const authAxiosInstance: AxiosInstance = axios.create(authConfig);

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

export default axiosInstance;
