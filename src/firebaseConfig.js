// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAP0ejMWYxVKpCQsQopW7Shca18koNLWPg",
  authDomain: "appointment-scheduler-361e8.firebaseapp.com",
  projectId: "appointment-scheduler-361e8",
  storageBucket: "appointment-scheduler-361e8.firebasestorage.app",
  messagingSenderId: "61767285196",
  appId: "1:61767285196:web:eaa96b82a658cdc410c569"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);