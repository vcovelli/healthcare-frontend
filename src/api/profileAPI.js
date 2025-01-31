import apiClient from '../api/apiClient';
import { getAuthToken } from '../utils/authUtils';

export const updateProfile = async (profileData) => {
  const token = await getAuthToken();

  try {
    const response = await apiClient.put('/profile/', profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Profile updated successfully:', response.data);
    alert('Profile updated successfully!');
    return response.data; // Return the updated profile if needed
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message);
    alert('Failed to update profile. Please try again.');
    throw error; // Throw error to handle it where this function is called
  }
};
