import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./firebaseConfig"
import { onAuthStateChanged } from "firebase/auth";
import Routes from "./routes/Routes"
import Navbar from "./components/Navbar";

const MainApp = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await fetch("http://127.0.0.1:8000/api/profiles/", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setRole(data.role); // Set the role (admin, staff, client)
          } else {
            console.error("Failed to fetch user role:", response.statusText);
            setRole(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setRole(null); // User is not authenticated
      }
      setLoading(false); // Stop loading once user info is retrieved
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Display a loading state
  }

  return (
    <Router>
      {role && <Navbar role={role} />} {/* Show Navbar if user is authenticated */}
      <Routes role={role} /> {/* Pass the role to Routes for role-based navigation */}
    </Router>
  );
};

export default MainApp;
