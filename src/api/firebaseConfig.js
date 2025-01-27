// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import axios from "axios";
import apiClient from "./apiClient";

export const getUserRole = async (token) => {
  try {
    console.log("Sending token to backend:", token);
    const response = await apiClient.post("auth/role/", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Role fetched from backend:", response.data.role);
    return response.data.role;
  } catch (error) {
    console.error("Error fetching user role:", error.response?.data || error.message);
    throw error;
  }
};

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set auth persistence to persist across reloads
setPersistence(auth, browserLocalPersistence)
  .catch((error) => console.error("Error setting persistence:", error));

console.log("API Key:", process.env.REACT_APP_FIREBASE_API_KEY);
console.log("Auth Domain:", process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);

export { auth }; 