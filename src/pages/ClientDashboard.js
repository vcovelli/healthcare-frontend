import React from "react";
import App from "../App"; // Assuming the existing appointment handling is here

const ClientDashboard = () => {
  return (
    <div>
      <h1>Client Dashboard</h1>
      <App /> {/* Reuse the existing App component for clients */}
    </div>
  );
};

export default ClientDashboard;
