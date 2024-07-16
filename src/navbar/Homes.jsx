import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { auth, db } from '../firebaseconfig/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import ProfileForm from '../components/ProfileForm'; // Adjust the path based on your project structure
import Spinner from '../special-setups/Spinner';

const Home = () => {
    const adminEmail = "admin@example.com";

    const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
    const [mainImageUrl, setMainImageUrl] = useState('');
    const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
    const [showMainImageDialog, setShowMainImageDialog] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showProfileDialog, setShowProfileDialog] = useState(false); // State to manage showing the profile dialog
    const [hasProfile, setHasProfile] = useState(false); // State to track if the user has a profile
    const [isLoading, setIsLoading] = useState(true); // State for loading state

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user.email);
                setIsAdmin(user.email === adminEmail);
                checkUserProfile(user.uid); // Check if user has a profile
            } else {
                setCurrentUser(null);
                setIsAdmin(false);
                setHasProfile(false); // Reset profile status when user logs out
            }
        });

        const fetchBackgroundImages = async () => {
            try {
                const docRef = doc(collection(db, 'settings'), 'background');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setBackgroundImageUrl(data.backgroundImageUrl || '');
                    setMainImageUrl(data.mainImageUrl || '');
                } else {
                    setBackgroundImageUrl('');
                    setMainImageUrl('');
                }
            } catch (error) {
                console.error('Error fetching background images:', error);
            } finally {
                setIsLoading(false); // Set loading to false after fetching
            }
        };

        fetchBackgroundImages();

        return unsubscribe;
    }, []);

    const checkUserProfile = async (uid) => {
        try {
            const profileRef = doc(db, 'profiles', uid);
            const profileSnap = await getDoc(profileRef);
            if (profileSnap.exists()) {
                setHasProfile(true);
            } else {
                setHasProfile(false);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleBackgroundUrlSubmit = async () => {
        setBackgroundImageUrl(newImageUrl);
        setShowBackgroundDialog(false);
        setNewImageUrl('');

        const docRef = doc(collection(db, 'settings'), 'background');
        await setDoc(docRef, { backgroundImageUrl: newImageUrl, mainImageUrl }); // Update only backgroundImageUrl
    };

    const handleMainImageUrlSubmit = async () => {
        setMainImageUrl(newImageUrl);
        setShowMainImageDialog(false);
        setNewImageUrl('');

        const docRef = doc(collection(db, 'settings'), 'background');
        await setDoc(docRef, { backgroundImageUrl, mainImageUrl: newImageUrl }); // Update only mainImageUrl
    };

    const openProfileDialog = () => {
        setShowProfileDialog(true);
    };

    if (isLoading) {
        return <Spinner />; // Show spinner while loading
    }

    return (
        <div
            className="flex flex-col items-center justify-start min-h-screen p-4 relative"
            style={{
                backgroundImage: `url(${backgroundImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                filter: 'brightness(90%)',  // slightly reduce brightness
            }}
        >
            {currentUser === adminEmail && (
                <>
                    <button
                        className="relative top-3 left-4 md:left-3 bg-teal-600 text-white mb-4 px-4 py-2 rounded-full shadow-lg hover:bg-teal-700 transition-colors duration-300 z-10"
                        onClick={() => setShowBackgroundDialog(true)}
                    >
                        Change Background
                    </button>
                    <button
                        className="relative top-3 left-4 md:left-3 bg-teal-600 text-white mb-4 px-4 py-2 rounded-full shadow-lg hover:bg-teal-700 transition-colors duration-300 z-10"
                        onClick={() => setShowMainImageDialog(true)}
                    >
                        Change Main Image
                    </button>
                </>
            )}

            <h1 className="text-3xl md:text-4xl hover:bg-teal-600 rounded-full p-3 font-bold text-center mb-8 text-white gradient-background1">CANCER FRIENDS</h1>

            {/* Main Image Changeable */}
            <div className="w-full md:w-3/4 max-w-xl mb-8">
                <img
                    src={mainImageUrl}
                    alt="Main Image"
                    className="mx-auto rounded-lg shadow-lg zoom"
                    style={{ maxWidth: '100%' }}
                />
            </div>

            {/* Profile Button */}
            {currentUser && (
                <>
                    {hasProfile ? (
                        <button
                            className="bg-teal-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-teal-700 transition-colors duration-300 mb-4"
                            onClick={openProfileDialog}
                        >
                            Change Profile
                        </button>
                    ) : (
                        <button
                            className="bg-teal-600 text-white px-4 py-2 rounded-full shadow-2xl hover:bg-black transition-colors duration-300 mb-4 zoom"
                            onClick={openProfileDialog}
                        >
                            Create Profile
                        </button>
                    )}
                </>
            )}

            {/* Profile Creation Form Dialog */}
            {showProfileDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <ProfileForm onClose={() => setShowProfileDialog(false)} />
                    </div>
                </div>
            )}

            {/* Background Carousel */}
            <Carousel className="w-full md:w-3/4 mb-8 " style={{ maxWidth: '600px' }} interval={1000}>
                <Carousel.Item>
                    <img
                        className="d-block w-full rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                        src="https://images.pexels.com/photos/3900468/pexels-photo-3900468.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="First slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-full rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                        src="https://images.pexels.com/photos/5588323/pexels-photo-5588323.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Second slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-full rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                        src="https://images.pexels.com/photos/6984616/pexels-photo-6984616.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Third slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-full rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                        src="https://images.pexels.com/photos/6303604/pexels-photo-6303604.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Fourth slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-full rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                        src="https://images.pexels.com/photos/8385217/pexels-photo-8385217.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Fifth slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-full rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                        src="https://images.pexels.com/photos/5702166/pexels-photo-5702166.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Sixth slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-full rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                        src="https://images.pexels.com/photos/6203418/pexels-photo-6203418.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Sixth slide"
                    />
                </Carousel.Item>
            </Carousel>
            {/* Artwork Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full md:w-3/4">
                <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <img className="object-co w-full h-full" src="https://images.pexels.com/photos/5483025/pexels-photo-5483025.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Artwork" />
                </div>
                <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <img className="object-cover w-full h-full" src="https://images.pexels.com/photos/4276425/pexels-photo-4276425.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Artwork" />
                </div>
                <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <img className="object-cover w-full h-full" src="https://images.pexels.com/photos/9758218/pexels-photo-9758218.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Artwork" />
                </div>
                <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <img className="object-cover w-full h-full" src="https://images.pexels.com/photos/6984608/pexels-photo-6984608.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Artwork" />
                </div>
                <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <img className="object-cover w-full h-full" src="https://images.pexels.com/photos/1704120/pexels-photo-1704120.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Artwork" />
                </div>
                <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <img className="object-cover w-full h-full" src="https://images.pexels.com/photos/4684178/pexels-photo-4684178.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Artwork" />
                </div>
            </div>


            {/* Background Image Dialog */}
            {showBackgroundDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">Change Background Image</h2>
                        <input
                            type="url"
                            className="w-full p-2 mb-4 border rounded"
                            placeholder="Enter Image URL"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                        />
                        <div className="flex justify-between">
                            <button
                                className="bg-teal-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-teal-700 transition-colors duration-300"
                                onClick={handleBackgroundUrlSubmit}
                            >
                                Save
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-300"
                                onClick={() => setShowBackgroundDialog(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Image Dialog */}
            {showMainImageDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">Change Main Image</h2>
                        <input
                            type="url"
                            className="w-full p-2 mb-4 border rounded"
                            placeholder="Enter Image URL"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                        />
                        <div className="flex justify-between">
                            <button
                                className="bg-teal-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-teal-700 transition-colors duration-300"
                                onClick={handleMainImageUrlSubmit}
                            >
                                Save
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-300"
                                onClick={() => setShowMainImageDialog(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
