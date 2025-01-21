import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth State Changed:", currentUser); // Debugging
      setUser(currentUser);
      setLoading(false); // Stop loading once we know the auth state
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Show a loading indicator while determining the auth state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Log user state for debugging
  console.log("User in PrivateRoute:", user);
  console.log("Loading in PrivateRoute:", loading);

  // If user is authenticated, render the children; otherwise, redirect to login
  if (!user) {
    console.error("User not authenticated!");
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
