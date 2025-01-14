import React, { useState } from "react";

// Modal Component
function Modal({ isOpen, onClose, appointment, onSave }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    const updatedAppointment = {
      ...appointment,
      title: e.target.title.value, // Access the value using the "name" attribute
      date: e.target.date.value,
      time: e.target.time.value,
    };
    onSave(updatedAppointment); // Call the onSave function passed from the parent component
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Appointment</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-gray-600">Title</label>
          <input
            name="title"
            type="text"
            defaultValue={appointment?.title || ""}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <label className="block mb-2 text-gray-600">Date</label>
          <input
            name="date"
            type="date"
            defaultValue={appointment?.date || ""}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <label className="block mb-2 text-gray-600">Time</label>
          <input
            name="time"
            type="time"
            defaultValue={appointment?.time || ""}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

// App Component
function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  const [appointments, setAppointments] = useState([
    { id: 1, title: "Dentist Appointment", date: "2025-01-15", time: "10:00 AM" },
    { id: 2, title: "Team Meeting", date: "2025-01-16", time: "2:00 PM" },
  ]);

  const openModal = (appointment) => {
    setCurrentAppointment(appointment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentAppointment(null);
  };

  const handleSave = (updatedAppointment) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === updatedAppointment.id ? updatedAppointment : appointment
      )
    );
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.id !== id)
      );
    }
  };
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">My Appointments</h1>
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="p-4 bg-white rounded shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-700">{appointment.title}</h2>
            <p className="text-gray-600">{appointment.date}</p>
            <p className="text-gray-600">{appointment.time}</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => openModal(appointment)}
            >
              Edit
            </button>
            <button
               className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
               onClick={() => handleDelete(appointment.id)}
            >
              Delete
            </button>

          </div>
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        appointment={currentAppointment}
        onSave={handleSave}
      />
    </div>
  );
}

export default App;
