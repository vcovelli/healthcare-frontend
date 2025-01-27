import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { role, loading } = useAuth();

  // Show a loading spinner while fetching the role
  if (loading) return <p>Loading...</p>;

  // Check if user's role matches allowed roles
  if (!allowedRoles.includes(role)) {
    console.warn(`Unauthorized access attempt. Role: ${role}`);
    return <Navigate to="/" />;
  }

    return children;
};

export default RoleBasedRoute;