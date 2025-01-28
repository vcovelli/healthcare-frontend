import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";
import { getAuthToken } from "../utils/authUtils";

const AdminDashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAuthToken();

        // Fetch profiles
        const profileResponse = await apiClient.get(
          "/profiles/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched Profiles:", profileResponse.data); // Debugging
        setProfiles(Array.isArray(profileResponse.data) ? profileResponse.data : []); // Fallback to an empty array

        // Fetch appointments
        const appointmentResponse = await apiClient.get(
          "/appointments/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(Array.isArray(appointmentResponse.data) ? appointmentResponse.data : []); // Fallback to an empty array
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setError("Failed to fetch data. Please try again.");
      }
    };

    fetchData();
  }, []);

  const handleDeleteProfile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;
    try {
      const token = await getAuthToken();
      await apiClient.delete(`/profiles/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfiles((prev) => prev.filter((profile) => profile.id !== id));
      alert("Profile deleted successfully!");
    } catch (error) {
      console.error("Error deleting profile:", error.message || error.response);
      alert("Failed to delete profile. Please try again.");
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      const token = await getAuthToken();
      await apiClient.delete(`/appointments/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      alert("Appointment deleted successfully!");
    } catch (error) {
      console.error("Error deleting appointment:", error.message || error.response);
      alert("Failed to delete appointment. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-6 mt-20">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          Admin Dashboard
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Manage Users Section */}
        <CollapsibleSection title="Manage Users">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id} className="border-b">
                  <td className="p-4">{profile.user.email}</td>
                  <td className="p-4">{profile.role}</td>
                  <td className="p-4 text-center">
                    <button
                      className="bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleDeleteProfile(profile.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsibleSection>

        {/* Appointments Section */}
        <CollapsibleSection title="All Appointments">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Time</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b">
                  <td className="p-4">{appointment.title}</td>
                  <td className="p-4">{appointment.date}</td>
                  <td className="p-4">{appointment.time}</td>
                  <td className="p-4 text-center">
                    <button
                      className="bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsibleSection>
      </div>
    </div>
  );
};

const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-8">
      <button
        className="w-full bg-blue-500 text-white px-4 py-2 rounded flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span>{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default AdminDashboard;
