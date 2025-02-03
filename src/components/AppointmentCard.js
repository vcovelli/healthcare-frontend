import React from "react";
import { deleteAppointment } from "../api/appointmentsAPI";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Import icons
import { formatDateToMMDDYYYY, formatTime24to12 } from "../utils/formatDate";
import ConfirmModal from "../components/ConfirmModal";



const AppointmentCard = ({ appointment, onEdit, onDelete }) => {
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

    const handleDeleteClick = (appointment) => {
      setActionToConfirm(() => () => handleDeleteAppointment(appointment.id));
      setConfirmModalOpen(true);
    
      // Store appointment details for the modal
      setModalMessage(`Are you sure you want to delete the appointment "${appointment.title}" on ${formatDateToMMDDYYYY(appointment.date)}?`);
  };
  
  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);
      console.log(`Appointment ${appointmentId} deleted.`);
      // Notify parent component to refresh or update state
      onDelete(appointmentId);
    } catch (error) {
      console.error("Error deleting appointment:", error);
    } finally {
      setConfirmModalOpen(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      {/* Appointment Title */}
      <h2 className="text-xl font-semibold text-gray-800">
        {appointment.title}
      </h2>

      {/* Appointment Date */}
      <p className="text-gray-500">
        {formatDateToMMDDYYYY(appointment.date)}
      </p>

      {/* Appointment Time */}
      <p className="text-gray-500">
        {formatTime24to12(appointment.time)}
      </p>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-4">
        <button
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          onClick={() => onEdit(appointment)} // Trigger the onEdit function
        >
          <FiEdit />
          <span>Edit</span>
        </button>
        <button
          className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          onClick={() => handleDeleteClick(appointment)} // Trigger the delete function
        >
          <FiTrash2 />
          <span>Delete</span>
        </button>
      </div>
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => {
          if (actionToConfirm) actionToConfirm();
        }}
        message={modalMessage}
        className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 mx-auto z-50"
        overlayClassName="fixed inset-0 bg-black/70 flex items-center justify-center z-40"
      />
    </div>
  );
};

export default AppointmentCard;
