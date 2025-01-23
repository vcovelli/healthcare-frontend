import React from "react";
import { deleteAppointment } from "../api/appointmentsAPI";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Import icons
import { formatDateToMMDDYYYY, formatTime24to12 } from "../utils/formatDate";

const AppointmentCard = ({ appointment, onEdit, onDelete }) => {
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
          try {
            await deleteAppointment(appointment.id);
            onDelete(appointment.id); // Notify the parent component to update the state
          } catch (error) {
            console.error("Error deleting appointment:", error);
            alert("Failed to delete the appointment. Please try again.");
          }
        }
      };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
      <h2 className="text-xl font-semibold text-gray-800">Test</h2>
      <p className="text-gray-500">02-01-2025</p>
      <p className="text-gray-500">12:00 PM</p>
      <div className="flex space-x-4 mt-4">
        <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
          <FiEdit />
          <span>Edit</span>
        </button>
        <button className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
          <FiTrash2 />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;
