import React, { useEffect, useState } from "react";

const formatDateToMMDDYYYY = (dateString) => {
  if (!dateString || typeof dateString !== "string") {
    console.error("Invalid date string:", dateString);
    return "Invalid Date"; // Fallback for invalid dates
  }

  const date = new Date(dateString); // Parse the date string into a Date object
  if (isNaN(date.getTime())) {
    console.error("Unable to parse date", dateString);
    return "Invalid Date";
  }

  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
};

// Helper function to format time
function formatTime24to12(time24) {
  if (!time24 || typeof time24 !== "string" || !time24.includes(":")) {
    return "Invalid time"; // Fallback for undefined or empty time
  }  
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

// Modal Component
function Modal({ isOpen, onClose, appointment, onSave }) {
  const [validationMessage, setValidationMessage] = useState("");
  const currentHour = new Date().getHours();
  const dynamicMessage =
    currentHour >= 18 // Example: Closing time is 6 PM (18:00)
      ? "Sorry, bookings for today are closed. Please book for tomorrow."
      : "Please select a date at least 24 hours in the future.";

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the form from reloading the page

    // Retrieve values from the form
    const title = e.target.title?.value.trim() || ""; // Default to an empty string if undefined
    const date = e.target.date?.value || ""; // Default to an empty string if undefined
    const time = e.target.time?.value || ""; // Default to an empty string if undefined

    // Check if fields are empty
    if (!title || !date || !time) {
      setValidationMessage("All fields are required. Please complete the form.");
      return;
    }

    // Ensure valid date format
    const inputDate = new Date(date);
    if (isNaN(inputDate.getTime())) {
      setValidationMessage("Please enter a valid date.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight
    inputDate.setHours(0, 0, 0, 0); // Normalize input date to midnight

    // Validate for past dates
    if (inputDate < today) {
      alert("Please select a future date.");
      return;
    }

    // Validate for same-day future times
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

    const formattedDate = formatDateToMMDDYYYY(date);

    // Clear validation message if everything is valid
    setValidationMessage("");
    const updatedAppointment = {
      ...appointment,
      title: e.target.title.value, // Access the value using the "name" attribute
      date: formattedDate, // Use formatted date
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
          <p className="text-gray-500 text-sm italic mb-4 text-center whitespace-normal px-4">
            {dynamicMessage}
          </p>
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

        {appointments
          .filter((appointment) => {
            return appointment.date && appointment.time && new Date(appointment.date).toString() !== "Invalid Date";
          })
          .map((appointment) => (
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
