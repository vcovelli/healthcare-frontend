import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./MainApp";
import Login from "./Login";
import Signup from "./Signup";

const MainApp = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<App />} />
    </Routes>
  </Router>
);

export default MainApp;
