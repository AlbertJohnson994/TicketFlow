import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);

    if (error.code === "ECONNREFUSED") {
      throw new Error(
        "Backend server is not running. Please start the backend service on port 4000."
      );
    }

    if (error.response?.status === 404) {
      throw new Error("Requested resource not found.");
    }

    throw error;
  }
);

export default api;
