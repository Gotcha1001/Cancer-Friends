import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig/firebase';
import SendMessageDialog from './SendMessageDialog';

const Messages = ({ profileId }) => {
    const [messages, setMessages] = useState([]);
    const [showSendMessageDialog, setShowSendMessageDialog] = useState(false);
    const [selectedProfileId, setSelectedProfileId] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (!profileId) {
                    console.error('Profile ID is undefined');
                    return;
                }

                const q = query(collection(db, 'messages'), where('receiverId', '==', profileId));
                const querySnapshot = await getDocs(q);
                const messagesData = [];

                for (const docSnap of querySnapshot.docs) {
                    const messageData = docSnap.data();
                    const senderProfileRef = doc(db, 'profiles', messageData.senderId);
                    const senderProfileSnap = await getDoc(senderProfileRef);

                    if (senderProfileSnap.exists()) {
                        const senderProfile = senderProfileSnap.data();
                        const message = {
                            id: docSnap.id,
                            content: messageData.content,
                            timestamp: messageData.timestamp,
                            senderId: messageData.senderId,
                            senderName: senderProfile.name,
                            hasReplied: messageData.hasReplied || false
                        };
                        messagesData.push(message);
                    }
                }

                setMessages(messagesData);
            } catch (error) {
                console.error('Error fetching messages:', error);
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
            const messageRef = doc(db, 'messages', messageId);
            await updateDoc(messageRef, { hasReplied: true });

            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === messageId ? { ...msg, hasReplied: true } : msg
                )
            );
            openSendMessageDialog(senderId); // Open dialog after updating the state
        } catch (error) {
            console.error('Error updating message:', error);
        }
    };

    const handleDelete = async (messageId) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                await deleteDoc(doc(db, 'messages', messageId));
                setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    };

    return (
        <div className="gradient-background2 p-4 text-center rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-4">Messages</h1>
            <div className="overflow-auto max-h-96">
                <ul className="divide-y divide-gray-300">
                    {messages.map((message) => (
                        <li key={message.id} className="py-4 relative">
                            <p className="text-gray-800">{message.content}</p>
                            <p className="text-sm text-gray-500 mt-1">{new Date(message.timestamp).toLocaleString()}</p>
                            <p className="text-sm text-gray-500 mt-1">From: {message.senderName}</p>
                            {!message.hasReplied && (
                                <button
                                    className="bg-teal-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-teal-700 transition-colors duration-300 mt-2"
                                    onClick={() => handleReply(message.id, message.senderId)}
                                >
                                    Reply
                                </button>
                            )}
                            <button
                                className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-300 mt-2"
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
