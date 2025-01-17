import React from "react";
import ReactDOM from "react-dom/client"; // React 18 import
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./output.css"; // Tailwind CSS
import App from "./App";
import Login from "./Login";
import Signup from "./Signup";
import PrivateRoute from "./PrivateRoute"; // Import PrivateRoute

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <App />
            </PrivateRoute>
          }
        />  
      </Routes>
    </Router>
  </React.StrictMode>
);
