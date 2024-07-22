import React from "react";

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-0 top-0 p-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          &#x2715;
        </button>
        {children}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 shadow-lg transition-colors duration-300 hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
