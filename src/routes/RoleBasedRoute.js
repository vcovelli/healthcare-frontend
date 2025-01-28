import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { role, loading } = useAuth(); // Access role and loading state from AuthContext

  // Fetch role from localStorage if not already in context
  const storedRole = localStorage.getItem("userRole");
  const userRole = role || storedRole;

  // Show a loading spinner while fetching the role
  if (loading) return <p>Loading...</p>;

  // Check if user's role matches allowed roles
  if (!allowedRoles.includes(userRole)) {
    console.warn(`Unauthorized access attempt. Role: ${userRole}`);
    return <Navigate to="/" />; // Redirect to home if unauthorized
  }

    // Render children if authorized
    return children;
};

export default RoleBasedRoute;