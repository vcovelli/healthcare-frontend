import React, { useState, useEffect } from 'react';
import { FiPlus } from "react-icons/fi";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from 'react-modal';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { saveAppointment, fetchAppointments, updateAppointment, deleteAppointment } from '../api/appointmentsAPI.js';
import { formatTime24to12, formatDateToMMDDYYYY, convertTimeTo24Hour } from "../utils/formatDate";
import { getAuthToken } from "../utils/authUtils";

Modal.setAppElement('#root');

const ClientDashboard = ({ appointments = [], onCreateAppointment, businessHours = [9, 17] }) => {
  const [appointmentList, setAppointmentList] = useState([]);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const token = getAuthToken();
        if (!token) throw new Error("You must log in to view appointments.");

        const result = await fetchAppointments();
        setAppointmentList(result);
        console.log("Appointments loaded:", result);
      } catch (err) {
        console.error("Error loading appointments:", err.message);
        setError(err.message);
      }
    };

    loadAppointments();
  }, []);

  const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD

  const openModal = (date) => {
    console.log("Date clicked on calendar:", date);
    setCurrentAppointment(null); // Clear currentAppointment for new appointments
    setSelectedDate(formatDateToMMDDYYYY(date)); // Set the selected date for the modal formatted to MM-DD-YYYY
    setSelectedTime(''); // Clear selected time
    setTitle(''); // Clear title
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedTime('');

    // Ensure the page doesn't scroll after closing the modal
    document.activeElement?.blur();
  };

  const handleEditAppointment = (appointment) => {
    setCurrentAppointment(appointment); // Track the current appointment being edited
    setSelectedDate(formatDateToMMDDYYYY(appointment.date));  // Pre-fill the title in the modal
    setSelectedTime(formatTime24to12(appointment.time));  // Pre-fill the date in the modal
    setTitle(appointment.title);        // Pre-fill the time in the moda
    setIsModalOpen(true); // Open the modal
  };
  
  const saveEditedAppointment = async () => {
    if (!currentAppointment) return;
  
    const updatedDetails = {
      id: currentAppointment.id, // Use the appointment ID for updating
      title: title.trim(),
      date: new Date(selectedDate).toISOString().split("T")[0], // Convert back to YYYY-MM-DD
      time: convertTimeTo24Hour(selectedTime), // Convert to 24-hour format
    };

    console.log("Updated Details:", updatedDetails); // Debug payload
  
    try {
      const result = await updateAppointment(currentAppointment.id, updatedDetails);
      console.log("Appointment updated:", result);
  
      // Update the state with the edited appointment
      setAppointmentList((prev) =>
        prev.map((appt) =>
          appt.id === currentAppointment.id ? { ...appt, ...updatedDetails } : appt
        )
      );
  
      closeModal();
    } catch (error) {
      console.error("Error updating appointment:", error.message || error.response);
      alert("Failed to update appointment. Please try again.");
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
  
    try {
      await deleteAppointment(id);
      console.log("Appointment deleted:", id);
  
      // Remove the deleted appointment from the state
      setAppointmentList((prev) => prev.filter((appt) => appt.id !== id));
    } catch (error) {
      console.error("Error deleting appointment:", error.message || error.response);
      alert("Failed to delete appointment. Please try again.");
    }
  };

  const handleSaveAppointment = async () => {
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time:", selectedTime);
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time.');
      return;
    }

    const appointmentDetails = {
      title: title.trim(),
      date: new Date(selectedDate).toISOString().split("T")[0], // Ensure YYYY-MM-DD format
      time: convertTimeTo24Hour(selectedTime), // Ensure 24-hour format for time
  };

    try {
      const result = await saveAppointment(appointmentDetails);
      console.log('Appointment saved successfully:', result);
      alert('Appointment saved successfully!');
      setAppointmentList((prev) => [...prev, result]); // Add the new appointment to the local state
      closeModal(); // Close the modal after saving
    } catch (error) {
      console.error('Error saving appointment:', error.message || error.response);
      alert('Failed to save appointment. Please try again.');
    }
  };

  const handleConfirmAppointment = () => {
    if (!selectedTime) {
      alert("Please select a time!");
      return;
    }

    const newAppointment = { date: selectedDate, time: selectedTime };
    console.log("New appointment:", newAppointment);

    handleSaveAppointment(); // Call the save function
  };

  const getAvailableTimeSlots = () => {
    const [startHour, endHour] = businessHours; // e.g., [9, 17] for 9:00 AM to 5:00 PM
    const allSlots = Array.from({ length: (endHour - startHour) * 2 }, (_, i) => {
      const hour = startHour + Math.floor(i / 2);
      const minutes = i % 2 === 0 ? "00" : "30";
      const time = `${hour % 12 === 0 ? 12 : hour % 12}:${minutes} ${
        hour < 12 ? "AM" : "PM"
      }`;
      return time;
    });

    const bookedSlots = appointments
      .filter((appt) => appt.date === selectedDate)
      .map((appt) => appt.time);

    return allSlots.filter((slot) => !bookedSlots.includes(slot));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Header title="Welcome Back!" subtitle="Manage your appointments with ease." />

      <main className="container mx-auto px-4 py-2">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          My Appointments
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar Section */}
          <div className="lg:w-7/12 bg-white shadow-lg rounded-xl p-5">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              height="450px"
              contentHeight="auto"
              events={appointmentList.map((appt) => ({
                id: appt.id,
                title: appt.title,
                start: appt.date,
                time: appt.time, // Pass time for editing
                extendedProps: { ...appt }, // Pass all details for editing
              }))}
              dateClick={(info) => {
                if (info.dateStr >= today) openModal(info.dateStr); // For new appointments
              }}
              eventClick={(info) => handleEditAppointment(info.event.extendedProps)} // For existing appointments
              eventClassNames="fc-event" // Assign the class explicitly if needed
              dayCellClassNames={({ date }) => {
                const dateStr = date.toISOString().split("T")[0];
                return dateStr < today
                  ? "bg-gray-300 cursor-not-allowed"
                  : "cursor-pointer hover:bg-blue-200 transition";
              }}
            />
          </div>

          {/* Appointments Section */}
          <div className="lg:w-5/12 bg-gray-100 shadow-lg rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Appointments
            </h2>
            <div className="space-y-4">
              {appointmentList.length > 0 ? (
                appointmentList.map((appt, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                  >
                    <h3 className="text-base font-medium text-gray-900">{appt.title}</h3>
                    <p className="text-sm text-gray-500">{formatDateToMMDDYYYY(appt.date)}</p>
                    <p className="text-sm text-gray-500">@: {formatTime24to12(appt.time)}</p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEditAppointment(appt)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAppointment(appt.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No appointments found.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-8 mx-auto z-50"
        overlayClassName="fixed inset-0 bg-black/70 flex items-center justify-center z-40"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {currentAppointment ? "Edit Appointment" : "Create Appointment"}
          </h2>
          <p className="text-gray-600 mb-4">
            Selected Date: <span className="font-semibold">{selectedDate}</span>
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              currentAppointment ? saveEditedAppointment() : handleConfirmAppointment();
            }}
            className="space-y-6 text-left"
          >
            {/* Title Field */}
            <label className="block">
                <span className="text-gray-700">Title:</span>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 text-gray-700"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </label>

            {/* Date Field */}
            {currentAppointment && (
              <label className="block">
                <span className="text-gray-700">Date:</span>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 text-gray-700"
                  value={selectedDate} // Bind to selectedDate state
                  onChange={(e) => {
                    const newDate = e.target.value; // Format to MM-DD-YYYY
                    setSelectedDate(newDate); // Update state
                  }}
                  min={new Date().toISOString().split("T")[0]} // Restrict to today or future dates
                  required
                />
              </label>
            )}
            
            {/* Time Field */}
            <label className="block">
              <span className="text-gray-700">Time:</span>
              <select
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 text-gray-700"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a time
                </option>
                {getAvailableTimeSlots().map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                {currentAppointment ? "Save Changes" : "Confirm"}
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow hover:bg-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default ClientDashboard;
