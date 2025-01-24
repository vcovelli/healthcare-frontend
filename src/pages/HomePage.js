import React from "react";
import { Link } from "react-router-dom";

const HomePage = ({ user, appointments = [] }) => {
  // Filter the next 1–3 upcoming appointments
  const upcomingAppointments = appointments.slice(0, 3);

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-800 m-6 text-center">
        Welcome, {user?.displayName || "User"}!
      </h1>
      <p className="text-lg text-gray-600 text-center mb-12">
        Manage your healthcare appointments with ease.
      </p>

      {/* Upcoming Appointments Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Upcoming Appointments
        </h2>
        {upcomingAppointments.length > 0 ? (
          <ul className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <li key={appointment.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{appointment.title}</p>
                  <p className="text-gray-500">{appointment.date} at {appointment.time}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">You have no upcoming appointments.</p>
        )}
      </div>

      {/* Quick Links */}
      <div className="flex justify-center space-x-4">
        <Link
          to="/client-dashboard"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go to Client Dashboard
        </Link>
        <Link
          to="/staff-dashboard"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Go to Staff Dashboard
        </Link>
        <Link
          to="/admin-dashboard"
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Go to Admin Dashboard
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
