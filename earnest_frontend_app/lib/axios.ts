import axios from "axios";
import { getAccessToken, setAccessToken, clearAuth } from "./auth";

const api = axios.create({
  baseURL: "http://localhost:4500/",
  withCredentials: true, // important for cookies
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
   console.log("previous token generated", token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh logic
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (token) prom.resolve(token);
    else prom.reject(error);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          "http://localhost:4500/auth/refreshToken",
          {},
          { withCredentials: true }
        );

        const newToken = res.data.response.accessToken;
        
        setAccessToken(newToken);

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearAuth();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;