import axios from "axios";
import { auth } from "./firebaseConfig";

// Function to create an appointment
export const createAppointment = async (appointmentData) => {
  try {
    const token = await auth.currentUser.getIdToken(); // Get Firebase token
    console.log("Auth Token (Create):", token);

    const response = await axios.post("http://127.0.0.1:8000/api/appointments/", appointmentData, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token
      },
    });
    return response.data; // Return created appointment data
  } catch (error) {
    console.error("Error creating appointment:", error.response?.data || error.message);
    throw error; // Rethrow the error for handling in the calling function
  }
};

// Function to fetch all appointments for the logged-in user
export const fetchAppointments = async () => {
  try {
    const token = localStorage.getItem("authToken") || (await auth.currentUser?.getIdToken());
    console.log("Auth Token (Fetch):", token);

    if (!token) {
      throw new Error("Token is required to fetch appointments.");
    }

    const response = await axios.get("http://127.0.0.1:8000/api/appointments/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return fetched appointments
  } catch (error) {
    console.error("Error fetching appointments:", error.message || error.response);
    throw error; // Rethrow the error for handling in the calling function
  }
};

// Function to delete an appointment by ID
export const deleteAppointment = async (id) => {
  try {
    const token = await auth.currentUser.getIdToken(); // Get Firebase token
    console.log("Auth Token (Delete):", token);
    console.log("Deleting Appointment ID:", id);

    const response = await axios.delete(`http://127.0.0.1:8000/api/appointments/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token
      },
    });
    return response.data; // Return success response
  } catch (error) {
    console.error("Error deleting appointment:", error.response?.data || error.message);
    throw error; // Rethrow the error for handling in the calling function
  }
};

// Function to update an appointment by ID
export const updateAppointment = async (id, updatedData) => {
  try {
    const token = await auth.currentUser.getIdToken(); // Get Firebase token
    console.log("Auth Token (Update):", token);

    const response = await axios.put(`http://127.0.0.1:8000/api/appointments/${id}/`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token
      },
    });
    return response.data; // Return updated appointment data
  } catch (error) {
    console.error("Error updating appointment:", error.response?.data || error.message);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export const saveAppointment = async (appointmentDetails) => {
  if (appointmentDetails.id) {
    // Update existing appointment
    return await updateAppointment(appointmentDetails.id, appointmentDetails);
  } else {
    // Create a new appointment
    return await createAppointment(appointmentDetails);
  }
};
