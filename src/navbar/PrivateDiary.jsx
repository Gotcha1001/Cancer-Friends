import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseconfig/firebase'; // Adjust the path as needed
import { doc, getDoc, setDoc } from 'firebase/firestore';
import SubscribeButton from '../special-setups/Subscribe';
import Spinner from '../special-setups/Spinner'; // Adjust the path as needed
import ActualDiary from '../components/ActualDiary'; // Import the ActualDiary component

const PrivateDiary = () => {
    const [backgroundMediaUrl, setBackgroundMediaUrl] = useState('');
    const [isBackgroundVideo, setIsBackgroundVideo] = useState(false);
    const [newMediaUrl, setNewMediaUrl] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setCurrentUser(user);
                await fetchUserSettings(user.uid);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const fetchUserSettings = async (uid) => {
        try {
            const docRef = doc(db, 'userSettings', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setBackgroundMediaUrl(data.backgroundMediaUrl || '');
                setIsBackgroundVideo(data.isBackgroundVideo || false);
            } else {
                setBackgroundMediaUrl('');
                setIsBackgroundVideo(false);
            }
        } catch (error) {
            console.error('Error fetching user settings:', error);
        }
    };

    const handleBackgroundUrlSubmit = async () => {
        if (!currentUser) return;
        const isVideo = newMediaUrl.endsWith('.mp4');
        setBackgroundMediaUrl(newMediaUrl);
        setIsBackgroundVideo(isVideo);

        const docRef = doc(db, 'userSettings', currentUser.uid);
        await setDoc(docRef, {
            backgroundMediaUrl: newMediaUrl,
            isBackgroundVideo: isVideo,
        });
        setNewMediaUrl('');
        setIsFormVisible(false);
        window.location.reload(); // Refresh the page
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="relative flex flex-col items-center min-h-screen bg-gray-100">
            {/* Video or Image Background */}
            {isBackgroundVideo ? (
                <video
                    autoPlay
                    loop
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={backgroundMediaUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <img
                    src={backgroundMediaUrl}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}

            {/* Overlay to darken the video */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Content */}
            <div className="relative z-10 text-white text-center mt-20">
                <button
                    onClick={() => setIsFormVisible(true)}
                    className="mb-4 px-1 py-1 text-xs border border-success  text-white rounded"
                >
                    Change Video Background
                </button>

                {/* Welcome Message Card */}


                <h1 className="text-4xl mb-1 font-serif animate-bounce text-white">How was your day?</h1>

            </div>

            {/* Dialog Form */}
            {isFormVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 md:w-1/3">
                        <h2 className="text-2xl mb-4">Change Background</h2>
                        <input
                            type="text"
                            placeholder="Enter background media URL"
                            value={newMediaUrl}
                            onChange={(e) => setNewMediaUrl(e.target.value)}
                            className="p-4 w-full border border-gray-300 rounded-lg mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsFormVisible(false)}
                                className="p-2 bg-gray-300 text-black rounded-lg mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBackgroundUrlSubmit}
                                className="p-2 bg-blue-500 text-white rounded-lg"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Actual Diary Component */}
            <ActualDiary />
        </div>
    );
};

export default PrivateDiary;
