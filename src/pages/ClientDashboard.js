import React from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi"; // Import icons
import App from "../App";

const ClientDashboard = ({ onCreateAppointment, onEdit, onDelete, appointments = [] }) => {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        My Appointments
      </h1>

      {/* Create Appointment Button */}
      <div className="flex justify-end mb-6">
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          onClick={onCreateAppointment}
        >
          <FiPlus />
          <span>Create Appointment</span>
        </button>
      </div>

      {/* Appointments List */}
      <div className="grid gap-6">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-lg font-semibold text-gray-800">{appointment.title}</h2>
              <p className="text-gray-500">{appointment.date}</p>
              <p className="text-gray-500">{appointment.time}</p>
              <div className="flex space-x-4 mt-4">
                <button
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  onClick={() => onEdit(appointment)}
                >
                  <FiEdit />
                  <span>Edit</span>
                </button>
                <button
                  className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  onClick={() => onDelete(appointment.id)}
                >
                  <FiTrash2 />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No appointments found. Click{" "}
            <span className="text-blue-500 font-bold cursor-pointer" onClick={onCreateAppointment}>
              Create Appointment
            </span>{" "}
            to add one!
          </p>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
