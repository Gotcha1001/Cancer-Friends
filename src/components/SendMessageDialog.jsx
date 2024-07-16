import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig/firebase';
import { getAuth } from 'firebase/auth';
import React, { useState } from 'react';

const SendMessageDialog = ({ profileId, onClose }) => {
    const [message, setMessage] = useState('');
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
                    timestamp: new Date().toISOString()
                };

                await addDoc(collection(db, 'messages'), messageData);

                setMessage('');
                onClose();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleCancel = () => {
        onClose(); // Close the dialog
    };

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md gradient-background2">
                <button className="absolute top-0 right-0 p-4 cursor-pointer" onClick={handleCancel}>
                    &#x2715;
                </button>
                <h2 className="text-2xl font-semibold mb-4 text-white zoom  ">Send Message</h2>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    rows={6} // Adjust the number of rows to make it larger
                />
                <div className="flex justify-end">
                    <button
                        onClick={handleCancel}
                        className="bg-gray-300 text-black px-4 py-2 rounded-md mr-4 hover:bg-gray-400 transition-colors duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleMessageSend}
                        className="bg-teal-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-teal-700 transition-colors duration-300"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendMessageDialog;
