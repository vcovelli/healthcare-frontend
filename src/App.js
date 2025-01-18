import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios for API calls
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { fetchAppointments } from "./api/appointmentsAPI"; // Import API calls

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Set business hours
const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 17, // 5 PM (24-hour format)
};

// Helper function to check if a time is avaliable
const isTimeAvailable = (appointments, dateTime) => {
  if (!dateTime) return false; 
  const selectedDate = dateTime.toISOString().split("T")[0]; // Get the selected date (YYYY-MM-DD)
  const formattedTime = dateTime.toTimeString().split(" ")[0]; // Get the time in HH:MM:SS format

  return !appointments.some(
    (appointment) => 
      appointment.date === selectedDate && appointment.time === formattedTime
  );
};

// Format time to AM/PM
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

// Format date to MM-DD-YYYY
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
function Modal({ isOpen, onClose, appointment, onSave, appointments }) {
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
    
    // Check if within business hours
    const hour = dateTime.getHours();
    if (hour < BUSINESS_HOURS.start || hour >= BUSINESS_HOURS.end) {
      setValidationMessage(
        `Please select a time between ${BUSINESS_HOURS.start}:00 and ${BUSINESS_HOURS.end}:00.`
      );
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
            filterTime={(time) => {
              const hour = time.getHours();
              return (
                hour >= BUSINESS_HOURS.start && 
                hour < BUSINESS_HOURS.end &&
                isTimeAvailable(appointments, time) // Also check if the time is not booked
              );  
            }}
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments from backend when component mounts
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const appointmentsData = await fetchAppointments();
        console.log("Appointments loaded:", appointmentsData); // Debug log
        setAppointments(appointmentsData); // Update state with backend data
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    loadAppointments();
  }, []);

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser); // Debug log
      if (currentUser) {
        setUser(currentUser); // User is authenticated
      } else {
        setUser(null); // No user is authenticated
      }
      setLoading(false); // Stop the loader
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  // Show loader or unauthorized message
  if (loading) {
    return <p>Loading...</p>;
  }
  if (!user) {
    return <p>You are not authorized to view this page. Please log in.</p>;
  }

  // Function to create an appointment using the backend
  const createAppointment = async (appointmentData) => {
    try {
      const token = await auth.currentUser.getIdToken(); // Get Firebase ID token
      const { title, date, time } = appointmentData; // Destructure only necessary fields

      const response = await axios.post("http://127.0.0.1:8000/api/appointments/",
      { title, date, time }, // Only send title, date, and time
      {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in header
        },
      }
    );
      console.log("Appointment created:", response.data);

      // Update appointments state with the new appointment
      return response.data;
    } catch (error) {
      console.error("Error creating appointment:", error.response?.data || error.message);
    }
  };

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentAppointment(null);
  };

  // Handle save logic for new and updated appointments
  const handleSave = async (updatedAppointment) => {
    if (!updatedAppointment.id) {
      // Create new appointment using backend
      await createAppointment(updatedAppointment);
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

  // Function to delete an appointment
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        const token = await auth.currentUser.getIdToken(); // Get Firebase token
        await axios.delete(`http://127.0.0.1:8000/api/appointments/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token in the Authorization header
          },
        });
      
      // Remove the deleted appointment from the frontend state
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.id !== id)
      );
      console.log(`Appointment with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting appointment:", error.response?.data || error.message);
    }
  };
};
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">My Appointments</h1>
      <div className="space-y-4">
      {/* Create Appointment Button */}
      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={() => setModalOpen(true)}
      >
        Create Appointment
      </button>
      {/* Display Appointments */}
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
              onClick={() => {
                setCurrentAppointment(appointment);
                setModalOpen(true);
              }}
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
      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        appointment={currentAppointment}
        onSave={handleSave}
        appointments={appointments}
      />
    </div>
  );
};

export default App;
