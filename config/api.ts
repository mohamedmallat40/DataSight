// lib/api.ts
import axios from "axios";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: "https://all-care-demo.perla-it.com/api/v1",
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (optional - for adding auth tokens, etc.)
apiClient.interceptors.request.use(
  (config) => {
    // Add any request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor (optional - for handling common errors)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    console.error("API Error:", error.response?.data || error.message);

    return Promise.reject(error);
  },
);

// OCR specific function
export const extractBusinessCardData = async (front: File, back?: File) => {
  const formData = new FormData();

  formData.append("front", front);
  if (back) formData.append("back", back);

  const response = await apiClient.post("/ocr", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Email validation endpoint
export const checkEmailAlive = async (email: string) => {
  const response = await apiClient.get(
    `/is-email-alive?email=${encodeURIComponent(email)}`,
  );
  return response.data;
};

// Website reachability endpoint
export const checkWebsiteReachable = async (url: string) => {
  const response = await apiClient.get(
    `/is-website-reachable?url=${encodeURIComponent(url)}`,
  );
  return response.data;
};

// Website preview endpoint
export const getWebsitePreview = async (url: string) => {
  const response = await apiClient.get(
    `/preview-website?url=${encodeURIComponent(url)}`,
    {
      responseType: "blob",
    },
  );
  return response.data;
};

export default apiClient;
