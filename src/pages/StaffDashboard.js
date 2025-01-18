import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebaseConfig";

const StaffDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get(
          "http://127.0.0.1:8000/api/appointments/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div>
      <h1>Staff Dashboard</h1>
      <h2>Your Assigned Appointments</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            {appointment.title} - {appointment.date} at {appointment.time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StaffDashboard;
