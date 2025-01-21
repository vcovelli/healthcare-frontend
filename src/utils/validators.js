// Helper function to check if a time is avaliable
export const isTimeAvailable = (appointments, dateTime) => {
  if (!dateTime) return false; 
  const selectedDate = dateTime.toISOString().split("T")[0]; // Get the selected date (YYYY-MM-DD)
  const formattedTime = dateTime.toTimeString().split(" ")[0]; // Get the time in HH:MM:SS format

  return !appointments.some(
    (appointment) => 
      appointment.date === selectedDate && appointment.time === formattedTime
  );
};