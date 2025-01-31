import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../api/firebaseConfig";
import { getAuthToken } from "../utils/authUtils";
import apiClient from "../api/apiClient";

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

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
        console.log("Sending Firebase Token:", token); // Debugging

        // Save the token in localStorage
        localStorage.setItem("authToken", token);

        // Fetch user profile data from backend using `apiClient`
        const response = await apiClient.get("/auth/profile/detail/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Extract profile completion status
        setProfileCompleted(response.data.profile_completed);

        // Update user state
        setUser({ token, profileCompleted: response.data.profile_completed });
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

  // Redirect users to complete their profile if they haven't done so
  if (!profileCompleted) {
    return <Navigate to="/complete-profile" />;
  }

  // Allow access if user is authenticated
  return children;
};

export default PrivateRoute;