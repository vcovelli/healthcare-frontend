import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AdminDashboard from "../pages/AdminDashboard";
import StaffDashboard from "../pages/StaffDashboard";
import ClientDashboard from "../pages/ClientDashboard";
import UserManagement from "../pages/UserManagement"; // Fixed typo in the import
import NotFound from "../pages/NotFound"; // Import a fallback 404 page
import PrivateRoute from "./PrivateRoute";
import RoleBasedRoute from "./RoleBasedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/client-dashboard"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={["client"]}>
              <ClientDashboard />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/staff-dashboard"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={["staff", "admin"]}>
              <StaffDashboard />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/user-management"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={["admin"]}>
              <UserManagement />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
