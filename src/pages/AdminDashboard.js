import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../api/firebaseConfig";

const AdminDashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await auth.currentUser.getIdToken();

        // Fetch profiles
        const profileResponse = await axios.get(
          "http://127.0.0.1:8000/api/profiles/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfiles(profileResponse.data);

        // Fetch appointments
        const appointmentResponse = await axios.get(
          "http://127.0.0.1:8000/api/appointments/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(appointmentResponse.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Manage Users</h2>
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id}>
            {profile.user.email} - {profile.role}
          </li>
        ))}
      </ul>

      <h2>All Appointments</h2>
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

export default AdminDashboard;
