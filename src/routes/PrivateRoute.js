import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../api/firebaseConfig";
import { getAuthToken } from "../utils/authUtils";

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        console.warn("No user authenticated. Redirecting to login.");
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Attempt to get the token
        const token = await getAuthToken();

        // Save the token in localStorage
        localStorage.setItem("authToken", token);

        // Update user state
        setUser({ token });
      } catch (error) {
        console.error("Error with authentication:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Show a loading state while checking auth
  if (loading) return <p>Loading...</p>;

  // Redirect to login if no user is authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Allow access if user is authenticated
  return children;
};

export default PrivateRoute;