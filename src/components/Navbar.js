import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, getUserRole } from "../api/firebaseConfig";

const Navbar = ({ initialRole }) => {
  const [role, setRole] = useState(initialRole || null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const userRole = await getUserRole(token);
        setRole(userRole);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };
    fetchRole();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-2xl font-bold hover:text-gray-200">
          Healthcare Scheduler
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            to="/client-dashboard"
            className="text-sm font-medium hover:text-gray-200"
          >
            Client Dashboard
          </Link>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-sm px-4 py-2 rounded-md hover:bg-red-600 transition-transform transform hover:scale-105"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
