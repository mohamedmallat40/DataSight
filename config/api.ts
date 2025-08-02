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
    let errorMessage = error.message;

    // Better handling for blob responses
    if (error.response?.data instanceof Blob) {
      errorMessage = `${error.response.status} ${error.response.statusText}`;
    } else if (error.response?.data) {
      errorMessage = error.response.data;
    }

    console.error("API Error:", errorMessage);

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
  try {
    const response = await apiClient.get(
      `/preview-website?url=${encodeURIComponent(url)}`,
      {
        responseType: "blob",
        timeout: 30000, // 30 second timeout for preview generation
      },
    );

    // Validate that we got a valid image blob
    if (
      response.data &&
      response.data.type &&
      response.data.type.startsWith("image/")
    ) {
      return response.data;
    } else {
      throw new Error("Invalid image response received");
    }
  } catch (error: any) {
    // Add more specific error information
    if (error.response?.status === 500) {
      throw new Error("Preview generation failed on server");
    } else if (error.response?.status === 404) {
      throw new Error("Preview endpoint not available");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Preview generation timed out");
    } else {
      throw new Error(`Preview failed: ${error.message}`);
    }
  }
};

export default apiClient;
