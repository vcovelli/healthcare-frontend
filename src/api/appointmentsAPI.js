import axios from "axios";
import { auth } from "../firebaseConfig";

// Function to create an appointment
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

// Function to fetch all appointments for the logged-in user
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

// Function to delete an appointment by ID
export const deleteAppointment = async (id) => {
  try {
    const token = await auth.currentUser.getIdToken(); // Get Firebase token
    const response = await axios.delete(`http://127.0.0.1:8000/api/appointments/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token
      },
    });
    return response.data; // Return success response
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

// Function to update an appointment by ID
export const updateAppointment = async (id, updatedData) => {
  try {
    const token = await auth.currentUser.getIdToken(); // Get Firebase token
    const response = await axios.put(`http://127.0.0.1:8000/api/appointments/${id}/`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token
      },
    });
    return response.data; // Return updated appointment data
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};