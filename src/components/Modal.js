import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isTimeAvailable } from "../utils/appointmentUtils";

// Set business hours
const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 17, // 5 PM (24-hour format)
};

// Modal Component
const Modal = ({ isOpen, onClose, appointment, onSave, appointments }) => {
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
        title,
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
  };
  export default Modal;