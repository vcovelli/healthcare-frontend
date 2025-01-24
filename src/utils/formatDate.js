// Format time to AM/PM
export const formatTime24to12 = (time24) => {
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
export const formatDateToMMDDYYYY = (dateString) => {
  if (!dateString) return "Invalid Date"; // Fallback for invalid dates
  
  const date = new Date(dateString); // Parse the date string into a Date object
  if (isNaN(date)) return "Invalid Date";
  
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const day = date.getUTCDate().toString().padStart(2, "0");
  const year = date.getUTCFullYear();
  
  return `${month}-${day}-${year}`;
};

// Convert DD-MM-YYYY to YYYY-MM-DD
export const formatDateToYYYYMMDD = (dateString) => {
  const [day, month, year] = dateString.split("-");
  if (!day || !month || !year) return null; // Invalid format
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null; // Ensure numeric
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

export const convertTimeTo24Hour = (time12h) => {
  if (!time12h || typeof time12h !== "string") {
    // Already in 24-hour format, return as is
    console.error("Invalid time input:", time12h);
    return time12h;
  }

  // Otherwise, handle AM/PM conversion
  const [time, modifier] = time12h.split(' '); // Split into time and AM/PM
  let [hours, minutes] = time.split(':').map(Number); // Split hours and minutes

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  // Return in HH:MM:SS format
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
};
  