import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, getUserRole } from "../api/firebaseConfig";

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        console.log("Auth Token:", token); // Debugging token
        const fetchedRole = await getUserRole(token);
        console.log("Fetched Role:", fetchedRole); // Debugging role
        setRole(fetchedRole);
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Show loading spinner
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />; // Redirect if not authorized
  }

  return children; // Render child components if authorized
};

export default RoleBasedRoute;
