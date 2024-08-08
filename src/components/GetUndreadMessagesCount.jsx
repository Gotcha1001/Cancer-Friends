// src/components/GetUnreadMessagesCount.jsx
import { getFirestore, collection, query, where, getCountFromServer } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const getUnreadMessagesCount = async () => {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;

    if (!user) return 0;

    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, where("receiverId", "==", user.uid), where("hasReplied", "==", false));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};
