import React from "react";
import ReactDOM from "react-dom/client"; // React 18 import
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/output.css"; // Tailwind CSS
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./routes/PrivateRoute"; // Import PrivateRoute

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
