import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formatTime24to12 = (time24) => {
  if (!time24 || typeof time24 !== "string" || !time24.includes(":")) {
    console.error("Invalid time:", time24);
    return "Invalid time"; // Fallback for undefined or empty time
  }  

  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const formatDateToMMDDYYYY = (dateString) => {
  if (!dateString) return "Invalid Date"; // Fallback for invalid dates

  const date = new Date(dateString); // Parse the date string into a Date object
  if (isNaN(date)) return "Invalid Date";

  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const day = date.getUTCDate().toString().padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${month}-${day}-${year}`;
};

// Modal Component
function Modal({ isOpen, onClose, appointment, onSave }) {
  const [validationMessage, setValidationMessage] = useState("");
  const [dateTime, setDateTime] = useState(
    appointment?.date && appointment?.time
      ? new Date(`${appointment.date}T${appointment.time}`)
      : new Date()
  );

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the form from reloading the page

    // Ensure a title is provided
    const title = e.target.title?.value.trim();
    if (!title) {
      setValidationMessage("Title is required.");
      return;
    }

    if (!dateTime || dateTime <= new Date()) {
      setValidationMessage("Please select a valid future date and time.");
      return;
    }
    
    const updatedAppointment = {
      ...appointment,
      title: e.target.title?.value.trim() || "", // Use the trimmed title value
      date: dateTime.toISOString().split("T")[0], // Format as YYYY-MM-DD
      time: dateTime.toTimeString().split(" ")[0], // Format as HH:MM:SS
    };

    setValidationMessage(""); // Clear validation message 
    onSave(updatedAppointment); // Save the appointment
  };

  if (!isOpen) return null;

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
          <label className="block mb-2 text-gray-600">Date and Time</label>
          <DatePicker
            selected={dateTime}
            onChange={(date) => setDateTime(date)}
            showTimeSelect
            dateFormat="MM/dd/yyyy h:mm aa"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            minDate={new Date()} // Prevent past dates
          />
          {validationMessage && (
            <p className="text-red-500 text-sm-mb-4">{validationMessage}</p>
          )}
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
        {appointments.filter((appointment) => appointment.date && appointment.time).map((appointment) => (
          <div
            key={appointment.id}
            className="p-4 bg-white rounded shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-700">{appointment.title}</h2>
            <p className="text-gray-600">
              {appointment.date ? formatDateToMMDDYYYY(appointment.date) : "No Date"}
            </p>
            <p className="text-gray-600">{formatTime24to12(appointment.time)}</p>
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
