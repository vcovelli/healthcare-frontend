// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import apiClient from "./apiClient";

export const getUserRole = async () => {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error("No Firebase user found! Are you logged in?");
      return null;
    }

    const token = await currentUser.getIdToken();  // Fetch token

    console.log("Sending Firebase Token to Backend:", token);  // Debugging

    const response = await apiClient.get("/auth/role/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("User Role Response:", response.data);
    return response.data.role;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
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