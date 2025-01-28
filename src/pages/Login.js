import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../api/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import { getAuthToken } from "../utils/authUtils";

const Login = () => {
  const { setRole } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // For success message
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // To redirect after login

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password); // Sign in the user with Firebase Authentication
      const user = userCredential.user; // Get the logged-in user from the userCredential

      if (!user.emailVerified) { // Check the updated email verification status
        throw new Error("Email not verified.");
      }

      const token = await getAuthToken(); // Force refresh the ID token to get the latest email verification status
      localStorage.setItem("authToken", token);
      console.log("Firebase Token:", token);

      
      const response = await apiClient.post("/auth/login/", {
        email,
        password,
      });

      // Extract role from the backend response
      const { role } = response.data; // Get the role from the response
      setRole(role); // Update the role in AuthContext
      // Store role in localStorage or a state management solution
      localStorage.setItem("userRole", role);

      // Debug: Log the role received from backend**
      console.log("Role from backend:", role);

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "client") {
        navigate("/client-dashboard");
      } else if (role === "staff") {
        navigate("/staff-dashboard");
      } else {
        throw new Error("Unexpected user role. Please contact support.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please try again.";
      console.error("Error during login:", errorMessage);
      setError(errorMessage)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-sm mb-4">{successMessage}</p>
        )}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Log In
        </button>
        <div className="text-center mt-4">
          <p className="text-sm italic">Don't have an account?</p>
          <Link
            to="/signup"
            className="text-sm text-blue-500 underline hover:text-blue-700"
          >
            Sign up here.
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
