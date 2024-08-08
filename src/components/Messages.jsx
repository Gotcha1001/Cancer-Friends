import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseconfig/firebase";
import SendMessageDialog from "./SendMessageDialog";

const Messages = ({ profileId }) => {
  const [messages, setMessages] = useState([]);
  const [showSendMessageDialog, setShowSendMessageDialog] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!profileId) {
          console.error("Profile ID is undefined");
          return;
        }

        const q = query(
          collection(db, "messages"),
          where("receiverId", "==", profileId),
        );
        const querySnapshot = await getDocs(q);
        const messagesData = [];

        for (const docSnap of querySnapshot.docs) {
          const messageData = docSnap.data();
          const senderProfileRef = doc(db, "profiles", messageData.senderId);
          const senderProfileSnap = await getDoc(senderProfileRef);

          if (senderProfileSnap.exists()) {
            const senderProfile = senderProfileSnap.data();
            const message = {
              id: docSnap.id,
              content: messageData.content,
              timestamp: messageData.timestamp,
              senderId: messageData.senderId,
              senderName: senderProfile.name,
              hasReplied: messageData.hasReplied || false,
            };
            messagesData.push(message);
          }
        }

        // Sort messages by timestamp in descending order
        messagesData.sort((a, b) => b.timestamp - a.timestamp);

        setMessages(messagesData);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [profileId]);

  const openSendMessageDialog = (senderId) => {
    setSelectedProfileId(senderId);
    setShowSendMessageDialog(true);
  };

  const closeSendMessageDialog = () => {
    setShowSendMessageDialog(false);
    setSelectedProfileId(null);
  };

  const handleReply = async (messageId, senderId) => {
    try {
      const messageRef = doc(db, "messages", messageId);
      await updateDoc(messageRef, { hasReplied: true });

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, hasReplied: true } : msg,
        ),
      );
      openSendMessageDialog(senderId); // Open dialog after updating the state
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleDelete = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteDoc(doc(db, "messages", messageId));
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== messageId),
        );
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  return (
    <div className="gradient-background2 rounded-lg p-4 text-center shadow-lg">
      <h1 className="mb-4 text-2xl font-semibold">Messages</h1>
      <div className="max-h-96 overflow-auto">
        <ul className="divide-y divide-gray-300">
          {messages.map((message) => (
            <li key={message.id} className="relative py-4">
              <p className="text-gray-800">{message.content}</p>
              <p className="mt-1 text-sm text-gray-500">
                {new Date(message.timestamp).toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                From: {message.senderName}
              </p>
              {!message.hasReplied && (
                <button
                  className="mt-2 rounded-md bg-teal-600 px-4 py-2 text-white shadow-lg transition-colors duration-300 hover:bg-teal-700"
                  onClick={() => handleReply(message.id, message.senderId)}
                >
                  Reply
                </button>
              )}
              <button
                className="absolute right-0 top-0 mt-2 rounded-full bg-red-600 px-2 py-1 text-white shadow-lg transition-colors duration-300 hover:bg-red-700"
                onClick={() => handleDelete(message.id)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
      {showSendMessageDialog && selectedProfileId && (
        <SendMessageDialog
          profileId={selectedProfileId}
          onClose={closeSendMessageDialog}
        />
      )}
    </div>
  );
};

export default Messages;
