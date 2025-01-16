import React, { useEffect, useState } from "react";

// Modal Component
function Modal({ isOpen, onClose, appointment, onSave }) {
  const [validationMessage, setValidationMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the form from reloading the page

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    const inputDate = new Date(e.target.date.value);
    inputDate.setHours(0, 0, 0, 0); // Normalize input date to midnight

    // Validate for past dates
    if (inputDate < today) {
      alert("Please select a future date and time.");
      return;
    }

    // Validate for past times if the date is today
    if (inputDate.getTime() === today.getTime()) {
      const currentTime = new Date();
      const [inputHours, inputMinutes] = e.target.time.value.split(":").map(Number);
      if (
        inputHours < currentTime.getHours() ||
        (inputHours === currentTime.getHours() && inputMinutes < currentTime.getMinutes())
      ) {
        setValidationMessage("Please select a future time for today.");
        return;
      }
    }

    setValidationMessage(""); // Clear any previous message
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
            min={new Date().toISOString().split("T")[0]} // Disable past dates
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          {validationMessage && (
            <p className="text-red-500 text-sm-mb-4">{validationMessage}</p>
          )}
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

  const [appointments, setAppointments] = useState(() => {
    const savedAppointments = localStorage.getItem("appointments");
    return savedAppointments ? JSON.parse(savedAppointments) : [
      { id: 1, title: "Dentist Appointment", date: "2025-01-15", time: "10:00 AM" },
      { id: 2, title: "Team Meeting", date: "2025-01-16", time: "2:00 PM" },
    ];
  });

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const openModal = (appointment) => {
    setCurrentAppointment(appointment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentAppointment(null);
  };

  const handleSave = (updatedAppointment) => {
    if (!updatedAppointment.id) {
      // Create new appointment
      const newAppointment = {
        ...updatedAppointment,
        id: Date.now(), // Generate a unique ID
      };
      setAppointments((prevAppointments) => [...prevAppointments, newAppointment]);
    } else {
      // Update existing appointment
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === updatedAppointment.id ? updatedAppointment : appointment
        )
      );
    }  
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
      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={() => openModal({ id: null, title: "", date: "", time: "" })}
      >
        Create Appointment
      </button>

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
