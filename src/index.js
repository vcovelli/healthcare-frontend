import React from "react";
import ReactDOM from "react-dom/client"; // React 18 import
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/output.css"; // Tailwind CSS
import './styles/styles.css';
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ClientDashboard from "./pages/ClientDashboard"; // Import ClientDashboard
import PrivateRoute from "./routes/PrivateRoute"; // Import PrivateRoute
import NotFound from "./pages/NotFound";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} /> {/* Directly test ClientDashboard */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <App />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />  
      </Routes>
    </Router>
  </React.StrictMode>
);
