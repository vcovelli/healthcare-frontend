import React, { useState, useEffect } from 'react';
import { FiPlus } from "react-icons/fi";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import 'tippy.js/dist/tippy.css';
import tippy from 'tippy.js';
import Modal from 'react-modal';
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import ConfirmModal from "../components/ConfirmModal";
import { saveAppointment,
  fetchAppointments,
  updateAppointment,
  deleteAppointment
} from '../api/appointmentsAPI.js';
import { formatTime24to12,
  formatDateToMMDDYYYY,
  formatDateToYYYYMMDD,
  convertTimeTo24Hour
} from "../utils/formatDate";
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
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const token = getAuthToken();
        if (!token) throw new Error("You must log in to view appointments.");

        const result = await fetchAppointments();
        console.log("Raw Appointments Data:", result);

        const formattedAppointments = result.map((appt) => ({
          ...appt,
          date: formatDateToMMDDYYYY(appt.appointment_date), // Convert to display format
        }));
        console.log("Formatted Appointments Data:", formattedAppointments);

        setAppointmentList(formattedAppointments);
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
    setTitle('');

    // Ensure the page doesn't scroll after closing the modal
    document.activeElement?.blur();

    // Prevent scrolling behavior
    window.scrollTo({
      top: window.pageYOffset, // Maintain the current scroll position
      behavior: "auto",
    });
  };

  const handleEditAppointment = (appointment) => {
    if (!appointment) {
      console.error("Error: No appointment data provided.");
      return;
    }
  
    if (!appointment.id) {
      console.warn("Warning: Appointment ID is missing but trying to edit:", appointment);
      // Allow editing even if ID is missing (but warn)
    }
  
    console.log("Editing Appointment ID:", appointment.id || "MISSING");
    console.log("Raw Appointment Data:", appointment);
  
    // Ensure the date is formatted as "YYYY-MM-DD"
    const formattedDate = appointment.appointment_date
      ? appointment.appointment_date.split("T")[0] // Extract YYYY-MM-DD
      : "";
  
    // Ensure time is correctly formatted
    let formattedTime = "";
    if (appointment.time) {
      try {
        formattedTime = formatTime24to12(appointment.time);
        console.log("Formatted Time:", formattedTime);
      } catch (error) {
        console.error("Error formatting time:", error);
      }
    } else {
      console.warn("Invalid time found:", appointment.time);
    }
  
    // Set states
    setCurrentAppointment(appointment);
    setSelectedDate(formattedDate);
    setSelectedTime(formattedTime);
    setTitle(appointment.title);
    setIsModalOpen(true);
  };
  
  const saveEditedAppointment = async () => {
    if (!currentAppointment || !currentAppointment.id) {
      console.error("Error: Appointment ID is missing", currentAppointment);
      alert("Error: Appointment ID is missing.");
      return;
    }
  
    const updatedDetails = {
      id: currentAppointment.id,
      title: title.trim(),
      appointment_date: selectedDate, 
      time: convertTimeTo24Hour(selectedTime),
    };
  
    console.log("Updated Details Payload:", updatedDetails);
  
    try {
      await updateAppointment(currentAppointment.id, updatedDetails);
      console.log("Appointment updated successfully");
  
      // **Reload the latest appointment list after updating**
      const updatedAppointments = await fetchAppointments();
      setAppointmentList(updatedAppointments); // **Directly updating state from the backend response**
  
      setTimeout(() => {
        closeModal();
      }, 100); // Small delay to ensure UI updates before closing
    } catch (error) {
      console.error("Error updating appointment:", error.message || error.response);
      alert("Failed to update appointment. Please try again.");
    }
  };
  
  
  const handleDeleteRequest = (appointment) => {
    setAppointmentToDelete(appointment);
    setModalMessage(
      `Are you sure you want to delete the appointment "${appointment.title}" scheduled for ${formatDateToMMDDYYYY(
        appointment.date
      )} at ${formatTime24to12(appointment.time)}?`
    );
    setDeleteConfirmModal(true);
  };  
  
  const confirmDelete = async () => {
    if (!appointmentToDelete) return;
    
    try {
      await deleteAppointment(appointmentToDelete.id);
      console.log("Appointment deleted:", appointmentToDelete);
    
      // Remove deleted appointment from the state
      setAppointmentList((prev) => 
        prev.filter((appt) => appt.id !== appointmentToDelete.id)
      );
    } catch (error) {
      console.error("Error deleting appointment:", error.message || error.response);
    } finally {
      setDeleteConfirmModal(false);
      setAppointmentToDelete(null);
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
      appointment_date: formatDateToYYYYMMDD(selectedDate), // Convert to backend format
      time: convertTimeTo24Hour(selectedTime), // Ensure 24-hour format for time
    };
  
    try {
      const result = await saveAppointment(appointmentDetails);
      console.log('Appointment saved successfully:', result);
  
      if (!result || !result.id) {
        console.error("Error: Appointment was created but has no ID", result);
        alert("Error: The new appointment did not receive an ID.");
        return;
      }
  
      const formattedAppointment = {
        ...result,
        date: formatDateToMMDDYYYY(result.appointment_date), // Ensure correct format for UI
      };
  
      console.log("Adding new appointment to state:", formattedAppointment);
  
      // **Force UI Update by using a new array reference**
      setAppointmentList((prev) => [...prev, formattedAppointment]);
  
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

    const newAppointment = {
      title: title,
      appointment_date: selectedDate,
      time: selectedTime,
    };
    console.log("New appointment:", newAppointment);

    handleSaveAppointment(); // Call the save function
  };

  const getAvailableTimeSlots = () => {
    const [startHour, endHour] = businessHours; // e.g., [9, 17] for 9:00 AM to 5:00 PM
    const allSlots = Array.from({ length: (endHour - startHour) * 2 }, (_, i) => {
      const hour = startHour + Math.floor(i / 2);
      const minutes = i % 2 === 0 ? "00" : "30";
      return `${hour % 12 === 0 ? 12 : hour % 12}:${minutes} ${hour < 12 ? "AM" : "PM"}`;
    });
  
    // Get booked slots for the selected date
    const bookedSlots = appointmentList
      .filter((appt) => formatDateToMMDDYYYY(appt.appointment_date) === selectedDate)
      .map((appt) => formatTime24to12(appt.time));
  
    // Mark booked slots
    return allSlots.map((slot) => ({
      time: slot,
      isBooked: bookedSlots.includes(slot),
    }));
  };

  const getISODateTime = (date, time) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const dateObject = new Date(date);
    dateObject.setHours(hours, minutes, seconds || 0); // Set hours, minutes, and seconds
    return dateObject.toISOString(); // Convert to ISO string
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
            events={
              [...appointmentList] // Create a copy to avoid mutating state
                .sort((a, b) => {
                  const timeA = new Date(getISODateTime(a.appointment_date, convertTimeTo24Hour(a.time))).getTime();
                  const timeB = new Date(getISODateTime(b.appointment_date, convertTimeTo24Hour(b.time))).getTime();
                  return timeA - timeB; // Sort by datetime (date + time)
                })
                .map((appt) => ({
                  id: appt.id,
                  title: appt.title,
                  start: getISODateTime(appt.appointment_date, convertTimeTo24Hour(appt.time)), // Use combined ISO datetime
                  extendedProps: {
                    time: formatTime24to12(appt.time), // Format time to 12-hour format
                  },
                }))
            }
            dateClick={(info) => {
              if (info.dateStr >= today) openModal(info.dateStr); // For new appointments
            }}
            eventClick={(info) => {
              const { id, title, start, extendedProps } = info.event;
              handleEditAppointment({
                id,
                title,
                appointment_date: start.toISOString(),
                time: extendedProps.time, // Use the time stored in extendedProps
              });
            }}
            eventContent={(eventInfo) => {
              // Dynamically trim the title based on the available width
              const trimTitle = (text, maxLength) =>
                text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

              const titleMaxLength = 10; // Default value, can be adjusted dynamically
              return (
              <div>
                <div className="text-sm font-bold">{trimTitle(eventInfo.event.title, titleMaxLength)}</div>
                <div className="text-xs text-gray-200">
                  {eventInfo.event.extendedProps.time}
                </div>
              </div>
              );
            }}
            eventDidMount={(info) => {
              tippy(info.el, {
                content: `${info.event.title}<br>${info.event.extendedProps.time}`, // Tooltip content
                allowHTML: true, // Allow HTML for line breaks
                theme: 'custom', // Custom theme name (you can set more themes if needed)
                placement: "top", // Tooltip placement
                animation: "scale", // Tooltip animation
                duration: [200, 0], // Animation duration [show, hide]
              });
            }}
            dayCellClassNames={({ date }) => {
              const dateStr = date.toISOString().split("T")[0];
              return dateStr === today
                ? "bg-blue-100 text-blue-700 font-bold"
                : dateStr < today
                ? "bg-gray-300 cursor-not-allowed"
                : "cursor-pointer hover:bg-blue-200 transition";
            }}
            eventClassNames="fc-event"
          />
          </div>

          {/* Appointments Section */}
          <div className="lg:w-5/12 bg-gray-100 shadow-lg rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Appointments
            </h2>
            <div className="space-y-4">
              {appointmentList.length > 0 ? (
                [...appointmentList]
                .sort((a, b) => {
                  const dateTimeA = new Date(`${a.appointment_date.substring(0, 10)}T${a.time}`).getTime();
                  const dateTimeB = new Date(`${b.appointment_date.substring(0, 10)}T${b.time}`).getTime();
                  return dateTimeA - dateTimeB; // Sort in ascending order
                })
                .map((appt, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                  >
                    <h3 className="text-base font-medium text-gray-900">{appt.title}</h3>
                    <p className="text-sm text-gray-500">{formatDateToMMDDYYYY(appt.appointment_date)}</p>
                    <p className="text-sm text-gray-500">@: {formatTime24to12(appt.time)}</p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEditAppointment(appt)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(appt)}
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
                  value={selectedDate || ''} // Ensure the value is either a valid date or an empty string
                  onChange={(e) => {
                    const newDate = e.target.value; // This will already be in yyyy-MM-dd format
                    console.log("Selected new date:", newDate);
                    setSelectedDate(newDate); // Update state directly with the new date
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
                  <option
                    key={index}
                    value={slot.time}
                    disabled={slot.isBooked}
                    className={`${
                      slot.isBooked ? "text-gray-400 line-through cursor-not-allowed" : "text-black"
                    }`}
                  >
                    {slot.time}
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

      {/* Confirmation Modal for Deleting Appointments */}
      <ConfirmModal
          isOpen={deleteConfirmModal}
          onClose={() => setDeleteConfirmModal(false)}
          onConfirm={confirmDelete}
          message={
            <>
              <p className="text-lg font-semibold text-gray-800">Are you sure you want to delete this appointment?</p>
              <div className="mt-4">
                <p><span className="font-bold">Title:</span> {appointmentToDelete?.title}</p>
                <p><span className="font-bold">Date:</span> {appointmentToDelete ? formatDateToMMDDYYYY(appointmentToDelete.date) : 'Invalid Date'}</p>
                <p><span className="font-bold">Time:</span> {appointmentToDelete ? formatTime24to12(appointmentToDelete.time) : 'Invalid Time'}</p>
              </div>
            </>
          }
          className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 mx-auto z-50"
          overlayClassName="fixed inset-0 bg-black/70 flex items-center justify-center z-40"
        />
    </div>
  );
};

export default ClientDashboard;
