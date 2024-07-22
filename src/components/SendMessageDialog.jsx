import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseconfig/firebase";
import { getAuth } from "firebase/auth";
import React, { useState } from "react";

const SendMessageDialog = ({ profileId, onClose }) => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const handleMessageSend = async () => {
    try {
      if (currentUser) {
        const messageData = {
          senderId: currentUser.uid,
          receiverId: profileId,
          content: message,
          timestamp: new Date().toISOString(),
        };

        await addDoc(collection(db, "messages"), messageData);

        setMessage("");
        onClose();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCancel = () => {
    onClose(); // Close the dialog
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="gradient-background2 w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <button
          className="absolute right-0 top-0 cursor-pointer p-4"
          onClick={handleCancel}
        >
          &#x2715;
        </button>
        <h2 className="zoom mb-4 text-2xl font-semibold text-white">
          Send Message
        </h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="mb-4 w-full rounded border border-gray-300 p-2"
          rows={6} // Adjust the number of rows to make it larger
        />
        <div className="flex justify-end">
          <button
            onClick={handleCancel}
            className="mr-4 rounded-md bg-gray-300 px-4 py-2 text-black transition-colors duration-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleMessageSend}
            className="rounded-md bg-teal-600 px-4 py-2 text-white shadow-lg transition-colors duration-300 hover:bg-teal-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessageDialog;
