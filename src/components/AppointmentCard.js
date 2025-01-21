import React from "react";
import { deleteAppointment } from "../api/appointmentsAPI";
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
    <div className="p-4 bg-white rounded shadow hover:shadow-lg transition">
        <h2 className="text-xl font-semibold text-gray-700">{appointment.title}</h2>
        <p className="text-gray-600">
            {appointment.date ? formatDateToMMDDYYYY(appointment.date) : "No Date"}
        </p>
        <p className="text-gray-600">
            {appointment.time ? formatTime24to12(appointment.time) : "No Time"}
        </p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
          onClick={() => onEdit(appointment)}
        >
          Edit
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => onDelete(appointment.id)}
        >
          Delete
        </button>
    </div>
  );
};

export default AppointmentCard;
