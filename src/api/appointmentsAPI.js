import axios from "axios";
import { auth } from "../firebaseConfig";

export const createAppointment = async (appointmentData) => {
  try {
    const token = await auth.currentUser.getIdToken(); // Get Firebase token
    const response = await axios.post("http://127.0.0.1:8000/api/appointments/", appointmentData, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token
      },
    });
    return response.data; // Return created appointment data
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export const fetchAppointments = async () => {
  try {
    const token = await auth.currentUser.getIdToken(); // Get Firebase token
    const response = await axios.get("http://127.0.0.1:8000/api/appointments/", {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token
      },
    });
    return response.data; // Return appointments data
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};
