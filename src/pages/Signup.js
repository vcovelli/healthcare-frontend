import React, { useState } from "react";
import { createUserWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";
import { auth } from "../api/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client"); // Default role is "client"
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // To store success message
  const navigate = useNavigate(); // For navigation

  const handleSignup = async () => {
    
    try {
      // Ensure the current user is logged out
      await signOut(auth);

      // Create the user in Firebase
      console.log("Signing up user in Firebase...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      console.log("Verification email sent to:", user.email);

      // Notify the user to verify their email
      setSuccessMessage("Signup successful! Please check your email to verify your account.");

      // Check if email is verified
      //if (!user.emailVerified) {
      //  console.error("Email not verified");
      //  setError("Please verify your email before signing up.");
      //  return;
      //}

      // Send data to backend
      //console.log("Preparing to send request to backend...");
      //await axios.post(
      //  "http://127.0.0.1:8000/api/profiles/create/", 
      //{ role, email, password }, 
      //{
      //  headers: {
      //    Authorization: `Bearer ${token}`, // Add token to headers
      //  },
      //}
    //);
    console.log("Request sent successfully!");
      
      // Redirect to Login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Error during signup:", err.message);
      setError(err.message);
      setSuccessMessage(""); // Clear success message on error
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent form default action
          handleSignup(); // Call your async signup logic
        }}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
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
        <label className="block mb-2 text-gray-600">Select Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        >
          <option value="client">Client</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-sm mb-4">
            {successMessage}{" "}
            <Link
              to="/login"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Click here to log in.
            </Link>
          </p>
        )}              
        <button type="submit"
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Sign Up
        </button>
        <div className="text-center mt-4">
          <p className="text-sm italic">Already have an account?</p>
          <Link
            to="/login"
            className="text-sm text-blue-500 underline hover:text-blue-700"
          >
            Log in here.
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
