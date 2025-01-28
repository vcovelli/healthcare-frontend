import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../api/firebaseConfig";

const Navbar = () => {
  const { role } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false); // For main menu
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

    // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      localStorage.clear();
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/home" className="text-2xl font-bold hover:text-gray-200">
          Healthcare Scheduler
        </Link>

        {/* Hamburger Menu */}
        <div ref={dropdownRef} className="relative">
          <button
            className="text-white focus:outline-none"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50"
              role="menu"
              aria-label="User menu"
            >
              {/* Role-specific Links */}
              {role === "client" && (
                <Link
                  to="/client-dashboard"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={() => setMenuOpen(false)}
                  role="menuitem"
                >
                  Client Dashboard
                </Link>
              )}
              {role === "staff" && (
                <Link
                  to="/staff-dashboard"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={() => setMenuOpen(false)}
                  role="menuitem"
                >
                  Staff Dashboard
                </Link>
              )}
              {role === "admin" && (
                <>
                  <Link
                    to="/admin-dashboard"
                    className="block px-4 py-2 hover:bg-gray-200"
                    onClick={() => setMenuOpen(false)}
                    role="menuitem"
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/staff-dashboard"
                    className="block px-4 py-2 hover:bg-gray-200"
                    onClick={() => setMenuOpen(false)}
                    role="menuitem"
                  >
                    Staff Dashboard
                  </Link>
                  <Link
                    to="/client-dashboard"
                    className="block px-4 py-2 hover:bg-gray-200"
                    onClick={() => setMenuOpen(false)}
                    role="menuitem"
                  >
                    Client Dashboard
                  </Link>
                </>
              )}
              <div className="border-t border-gray-200"></div>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                role="menuitem"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;