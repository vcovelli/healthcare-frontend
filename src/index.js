import React from "react";
import ReactDOM from "react-dom/client"; // React 18 import
import { BrowserRouter as Router } from "react-router-dom";
import "./styles/output.css"; // Tailwind CSS
import "./styles/styles.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // Authentication context
import { AppointmentsProvider } from "./context/AppointmentsContext"; // Appointments context

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppointmentsProvider>
        <Router>
          <App />
        </Router>
      </AppointmentsProvider>
    </AuthProvider>
  </React.StrictMode>
);
