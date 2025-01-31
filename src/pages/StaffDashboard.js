import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Navbar from "../components/Navbar";
import apiClient from "../api/apiClient";
import { getAuthToken } from "../utils/authUtils";

const StaffDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const token = await getAuthToken();
        const response = await apiClient.get(
          `/appointments?date=${selectedDate.toISOString().split("T")[0]}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Map appointments into FullCalendar event format
        const events = response.data.map((appointment) => ({
          id: appointment.id,
          title: `${appointment.title} (${appointment.client.first_name} ${appointment.client.last_name})`,
          start: `${appointment.date}T${appointment.time}`,
          end: `${appointment.date}T${appointment.time}`, // Add duration
          extendedProps: {
            clientEmail: appointment.client.email,
            clientPhone: appointment.client.phone_number,
          },
        }));
        setAppointments(events);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedDate]);

  // Handle date click on the calendar
  const handleDateClick = (info) => {
    setSelectedDate(new Date(info.date));
  };

  // Handle event click
  const handleEventClick = (info) => {
    const appointmentId = info.event.id;
    alert(`Clicked on appointment: ${appointmentId}`);
    // Optional: Redirect or show modal for detailed actions
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Bookings Calendar</h2>
          {loading ? (
            <p>Loading calendar...</p>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridDay" // Default to timeGridDay for detailed booking view
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={appointments} // Event data from the API
              slotLabelFormat={{
                hour: "numeric",
                minute: "2-digit",
                meridiem: "short", // Short format for AM/PM
              }}
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                meridiem: "short", // Customize event times
              }}
              dateClick={handleDateClick} // Handle date selection
              eventClick={handleEventClick} // Handle event clicks
              height="auto" // Adjust to fit the container
              nowIndicator={true} // Highlight current time
              selectable={true}
              editable={false}
              eventColor="#4CAF50" // Custom event color
              slotMinTime="09:00:00" // Business hours start time (9 AM)
              slotMaxTime="18:00:00" // Business hours end time (6 PM)
              slotDuration="00:30:00" // Slot duration for finer granularity
              allDaySlot={false} // Remove all-day row
              expandRows={true} // Ensures rows fit the page height
              contentHeight="auto" // Adjust the calendar to fit the parent container
              aspectRatio={1.5} // Adjust aspect ratio for better fit
              dayHeaderFormat={{ weekday: 'short' }} // Shorter day names for better readability
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
