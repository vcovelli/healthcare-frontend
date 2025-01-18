import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, getUserRole } from "../firebaseConfig";

const RoleBasedRoute = ({ children }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const fetchedRole = await getUserRole(token);
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
    return <p>Loading...</p>;
  }

  if (role === "admin") {
    return <Navigate to="/dashboard/admin" />;
  } else if (role === "staff") {
    return <Navigate to="/dashboard/staff" />;
  } else if (role === "client") {
    return <Navigate to="/dashboard/client" />;
  } else {
    return <p>Unauthorized access</p>;
  }
};

export default RoleBasedRoute;
