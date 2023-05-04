import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

export type RequestResponse = AxiosResponse;

export interface CreateAxiosInstanceConfig {
  baseURL: string;
  token?: string;
  getToken?: () => string;
  headers?: AxiosRequestHeaders;
  loginErrorCallback?: (errmsg: string) => void;
}

export interface CreateAxiosInstance {
  (params: CreateAxiosInstanceConfig): AxiosInstance;
}

// 创建 Axios 实例
export const createAxiosInstance: CreateAxiosInstance = ({
  baseURL,
  token = '',
  getToken,
  headers = {},
  loginErrorCallback,
}): AxiosInstance => {
  const instance = axios.create({
    baseURL,
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
      // 在此处添加请求前的逻辑，例如添加自定义请求头
      config.headers = {
        'Content-Type': 'application/json',
        token: getToken ? getToken() : token,
        ...headers,
        ...config.headers,
      } as any;

      return config;
    },
    // 处理请求错误
    (error) => Promise.reject(error),
  );

  // 响应拦截器
  instance.interceptors.response.use(
    // 在此处添加对响应数据的处理逻辑，例如处理特定错误码
    (response: AxiosResponse) => response,
    (error) => {
      // 处理响应错误
      if (error.response) {
        if (error.response?.status === 401 && loginErrorCallback) {
          loginErrorCallback(error.response?.data?.errMsg);
        }
        return Promise.reject(error);
      }
      return Promise.reject(error);
    },
  );

  return instance;
};
