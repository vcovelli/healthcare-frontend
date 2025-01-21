import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";
import StaffDashboard from "../pages/StaffDashboard";
import ClientDashboard from "../pages/ClientDashboard";
import UserManagement from "../page/UserManagement";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

const AppRoutes = ({ role }) => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {role === "admin" && <Route path="/admin" element={<AdminDashboard />} />}
      {role === "staff" && <Route path="/staff" element={<StaffDashboard />} />}
      {role === "client" && <Route path="/client" element={<ClientDashboard />} />}
      <Route path="/" element={<Navigate to={role ? `/${role}` : "/login"} />} />
    </Routes>
  );
};

export default AppRoutes;
