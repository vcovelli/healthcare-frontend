import React from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, message, className, overlayClassName }) => {
  if (!isOpen) return null;

  return (
    <div className={`${overlayClassName}`}>
      <div className={`${className} flex flex-col items-center`}>
        <p className="text-lg text-gray-700 text-center mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
