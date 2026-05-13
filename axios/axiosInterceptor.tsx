import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

// 1. Create the Axios instance
const api = axios.create({
  baseURL: "http://192.168.0.77:8081/api", // Replace with your actual API URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor: Attach the token before the request is sent
api.interceptors.request.use(
  async (config) => {
    try {
      // Fetch the token from your storage (AsyncStorage or SecureStore)
      const token = await AsyncStorage.getItem("userToken");

      if (token) {
        // If token exists, append it to the Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching token from storage", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. Response Interceptor: Handle global responses and errors
api.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx triggers this function
    return response;
  },
  async (error) => {
    // Any status code outside the range of 2xx triggers this function
    const originalRequest = error.config;

    // Check if the error is 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized. Logging out...");

      try {
        // Clear the invalid token
        await AsyncStorage.removeItem("userToken");

        // Force redirect to the login screen
        router.replace("/");
      } catch (e) {
        console.error("Error clearing auth data", e);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
