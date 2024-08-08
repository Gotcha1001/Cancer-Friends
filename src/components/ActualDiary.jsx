import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseconfig/firebase'; // Adjust the path as needed
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import Pagination from '../special-setups/Pagination'; // Adjust the path as needed

const ActualDiary = () => {
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [newEntry, setNewEntry] = useState({ date: new Date(), day: '', content: '', imageUrl: '' });
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Adjust as needed

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
                fetchDiaryEntries(user.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchDiaryEntries = (uid) => {
        const diaryRef = collection(db, 'diary');
        const q = query(diaryRef, where('userUID', '==', uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const entries = [];
            querySnapshot.forEach((doc) => {
                entries.push({ id: doc.id, ...doc.data() });
            });
            setDiaryEntries(entries);
        });

        return () => unsubscribe();
    };

    const handleDialogSubmit = async () => {
        if (!currentUser) return;
        await addDoc(collection(db, 'diary'), {
            ...newEntry,
            date: new Date(),
            userUID: currentUser.uid,
        });
        setNewEntry({ date: new Date(), day: '', content: '', imageUrl: '' });
        setIsDialogVisible(false);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'diary', id));
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    // Pagination logic
    const totalItems = diaryEntries.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentEntries = diaryEntries.slice(startIndex, startIndex + itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="relative z-10 text-center mt-1">
            <h2 className="text-2xl gradient-background2  text-white  rounded-lg p-3 font-serif">Your Diary Entries</h2>
            <button
                onClick={() => setIsDialogVisible(true)}
                className="mt-2 p-1 bg-opacity-25 bg-gray-400 text-white rounded"
            >
                Add New Entry
            </button>

            {/* Diary Entries List */}
            <div className="mt-4">
                {currentEntries.length > 0 ? (
                    <ul>
                        {currentEntries.map((entry) => (
                            <li key={entry.id} className="relative mb-4 border p-7 rounded text-white mx-auto  neon-sky hover:bg-black">


                                {/* Delete Icon */}
                                <button
                                    onClick={() => handleDelete(entry.id)}
                                    className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3a1 1 0 00-1 1v1a1 1 0 001 1h1v12a1 1 0 001 1h12a1 1 0 001-1V5h1a1 1 0 001-1V4a1 1 0 00-1-1h-2V3a1 1 0 00-1-1H6zM5 4V3a1 1 0 011-1h10a1 1 0 011 1v1h-8a1 1 0 00-1 1v1H5V5a1 1 0 00-1-1H3V4a1 1 0 011-1h1zm4 2h4v12H9V6zm5 10h-2v-1h2v1zm-3-3h-2v-1h2v1zm3 2h-2v-1h2v1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <p><strong>Date:</strong> {new Date(entry.date.seconds * 1000).toLocaleDateString()}</p>
                                <p><strong>Day:</strong> {entry.day}</p>
                                <p><strong>Content:</strong></p>
                                <p className="whitespace-pre-wrap">{entry.content}</p>
                                {entry.imageUrl && (
                                    <div className="flex justify-center mt-2">
                                        <img
                                            src={entry.imageUrl}
                                            alt="Diary"
                                            className="max-w-xs max-h-77 object-contain rounded-lg"
                                        />
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No diary entries yet.</p>
                )}
            </div>

            {/* Pagination Component */}
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                currentPage={currentPage}
                nextPage={nextPage}
                prevPage={prevPage}
            />

            {/* Dialog Form */}
            {isDialogVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 md:w-1/2">
                        <h2 className="text-2xl mb-4">New Diary Entry</h2>
                        <input
                            type="text"
                            placeholder="Day"
                            value={newEntry.day}
                            onChange={(e) => setNewEntry({ ...newEntry, day: e.target.value })}
                            className="p-4 w-full border border-gray-300 rounded-lg mb-4"
                        />
                        <textarea
                            placeholder="Content"
                            value={newEntry.content}
                            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                            className="p-4 w-full border border-gray-300 rounded-lg mb-4 h-40"
                        />
                        <input
                            type="text"
                            placeholder="Image URL (optional)"
                            value={newEntry.imageUrl}
                            onChange={(e) => setNewEntry({ ...newEntry, imageUrl: e.target.value })}
                            className="p-4 w-full border border-gray-300 rounded-lg mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsDialogVisible(false)}
                                className="p-2 bg-gray-300 text-black rounded-lg mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDialogSubmit}
                                className="p-2 bg-green-500 text-white rounded-lg"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActualDiary;
