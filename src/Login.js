import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // For success message
  const navigate = useNavigate(); // To redirect after login

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage("Login successful! Redirecting...");

      // Clear any previous errors
      setError("");

      // Redirect to the main app page after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.message);
      setSuccessMessage(""); // Clear any previous success messages
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
