import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AdminDashboard from "../pages/AdminDashboard";
import StaffDashboard from "../pages/StaffDashboard";
import ClientDashboard from "../pages/ClientDashboard";
import UserManagement from "../page/UserManagement";
import PrivateRoute from "./PrivateRoute";
import RoleBasedRoute from "./RoleBasedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected and Role-based routes */}
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
            <RoleBasedRoute allowedRoles={["staff"]}>
              <StaffDashboard />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      {/* Debugging: Fallback route */}
      <Route path="*" element={<h1>Route Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
