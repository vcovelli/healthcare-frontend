import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, getUserRole } from "../firebaseConfig";

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
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold hover:underline">
          Healthcare Scheduler
        </Link>
        <div className="flex space-x-6">
          {role === "admin" && (
            <Link to="/admin" className="hover:underline">
              Admin Dashboard
            </Link>
          )}
          {role === "staff" && (
            <Link to="/staff" className="hover:underline">
              Staff Dashboard
            </Link>
          )}
          {role === "client" && (
            <Link to="/client" className="hover:underline">
              Client Dashboard
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
