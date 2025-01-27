import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/AuthContext"; // Using AuthContext for role management

const App = () => {
  const { role, loading } = useAuth(); // Get role and loading state from AuthContext
  const location = useLocation();

  // List of routes where the Navbar should not be displayed
  const noNavbarRoutes = ["/login", "/signup"];

  useEffect(() => {
    console.log("Current Location:", location.pathname);
    console.log("User Role from Context:", role);
    console.log("Loading State:", loading);
  }, [location.pathname, role, loading]);

  if (loading) {
    return <p>Loading...</p>; // Display loading state
  }

  return (
    <div className="p-0 bg-gray-100 min-h-screen">
      {/* Conditionally render Navbar */}
      {!noNavbarRoutes.includes(location.pathname) && role && <Navbar role={role} />}
      <AppRoutes /> {/* Routes handle role-based logic */}
      <Footer />
    </div>
  );
};

export default App;
