import { auth } from "../api/firebaseConfig";

export const getAuthToken = async () => {
  try {
    const token = await auth.currentUser?.getIdToken(true); // Force token refresh
    if (!token) {
      throw new Error("User not authenticated or token unavailable.");
    }
    return token;
  } catch (error) {
    console.error("Error fetching Firebase token:", error.message);
    throw error;
  }
};
