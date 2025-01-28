import axios from "axios";
import { auth } from "./firebaseConfig"; // Adjust path if needed
import { getAuthToken } from "../utils/authUtils";

// Create an Axios instance with default settings
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to include the Firebase token in every request
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const currentUser = auth.currentUser; // Get the currently signed-in user
      if (currentUser) {
        const token = await getAuthToken(); // Get a fresh Firebase token
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching Firebase token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getUserRole = async (token) => {
  let retries = 3
  while (retries > 0) {
      try {
      const response = await apiClient.post("auth/role/", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.role;
    } catch (error) {
      retries--;
      if (retries === 0) throw error;
    }
  }
};

export default apiClient;
