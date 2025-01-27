import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../api/firebaseConfig";
import Navbar from "../components/Navbar";
import DatePicker from "react-datepicker"; // Install react-datepicker
import "react-datepicker/dist/react-datepicker.css";

const StaffDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get(
          `http://127.0.0.1:8000/api/appointments?date=${selectedDate.toISOString().split("T")[0]}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Sort appointments chronologically
        const sortedAppointments = response.data.sort((a, b) =>
          new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
        );
        setAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Staff Dashboard</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Choose a Date</h2>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="border border-gray-300 rounded px-4 py-2"
          />
        </div>
        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments for the selected day.</p>
        ) : (
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Appointments</h2>
            <ul className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <li key={appointment.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">{appointment.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleDateString()} at{" "}
                        {appointment.time}
                      </p>
                    </div>
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                      Cancel
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
