import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../firebaseconfig/firebase';
import { getAuth } from 'firebase/auth';
import { ref, deleteObject } from 'firebase/storage';
import DailyPostForm from '../components/DailyPostForm';
import Messages from '../components/Messages';
import Modal from '../components/Modal';
import Spinner from '../special-setups/Spinner';
import ProfileForm from '../components/ProfileForm'; // Import ProfileForm component
import { useNavigate } from 'react-router-dom';


const Profile = () => {
    const { profileId: routeProfileId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [dailyPosts, setDailyPosts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [showMessagesModal, setShowMessagesModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);




    const auth = getAuth();
    const currentUser = auth.currentUser;
    const profileId = routeProfileId || currentUser?.uid;

    const fetchProfile = async () => {
        setLoadingProfile(true);
        try {
            if (!profileId) {
                setFetchError('No Profile Yet! Go to the Home page to create your profile.');
                setLoadingProfile(false);
                return;
            }

            const profileRef = doc(db, 'profiles', profileId);
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                setProfile({ id: profileSnap.id, ...profileSnap.data() });
                fetchDailyPosts(profileSnap.id);
                fetchMessages(profileSnap.id); // Fetch messages for this profile
            } else {
                setFetchError('No Profile Yet! Go to the Home page to create your profile.');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setFetchError('Error fetching profile');
        } finally {
            setLoadingProfile(false);
        }
    };

    const fetchDailyPosts = async (profileId) => {
        try {
            const dailyPostsRef = collection(db, 'daily-posts');
            const q = query(dailyPostsRef, where('profileId', '==', profileId));
            const querySnapshot = await getDocs(q);

            let posts = [];
            querySnapshot.forEach((doc) => {
                // Initialize likes from the database, if present
                posts.push({ id: doc.id, ...doc.data(), likes: doc.data().likes || 0 });
            });

            setDailyPosts(posts);
        } catch (error) {
            console.error('Error fetching daily posts:', error);
        }
    };


    const fetchMessages = async (profileId) => {
        try {
            // Implement your logic to fetch messages here
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        if (profileId) {
            fetchProfile();
        }
    }, [profileId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('#options-menu')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showDropdown]);


    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handlePostSubmit = async () => {
        await fetchDailyPosts(profile.id);
        handleCloseDialog();
    };




    const handleDeletePost = async (postId, imgUrl) => {
        try {
            // Delete post document from Firestore
            await deleteDoc(doc(db, 'daily-posts', postId));

            // Delete image from Firebase Storage if imgUrl exists
            if (imgUrl) {
                const storageRef = ref(storage, imgUrl);
                await deleteObject(storageRef);
            }

            // Refetch daily posts after deletion
            await fetchDailyPosts(profile.id);
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleShowMessagesModal = () => {
        setShowMessagesModal(true);
    };

    const handleCloseMessagesModal = () => {
        setShowMessagesModal(false);
    };

    const handleLikePost = async (postId) => {
        try {
            const postRef = doc(db, 'daily-posts', postId);
            const postSnap = await getDoc(postRef);

            if (postSnap.exists()) {
                const currentLikes = postSnap.data().likes || 0;
                await updateDoc(postRef, {
                    likes: currentLikes + 1,
                });

                // Update local state to reflect the change
                setDailyPosts((prevState) =>
                    prevState.map((post) =>
                        post.id === postId ? { ...post, likes: currentLikes + 1 } : post
                    )
                );
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };






    const togglePrivacy = async () => {
        if (profile) {
            const updatedPrivacy = !profile.isPublic;
            try {
                await updateDoc(doc(db, 'profiles', profile.id), { isPublic: updatedPrivacy });
                setProfile({ ...profile, isPublic: updatedPrivacy });
            } catch (error) {
                console.error('Error updating privacy setting:', error);
            }
        }
    };



    if (loadingProfile) {
        return <Spinner />;
    }

    if (profile && !profile.isPublic && currentUser.uid !== profile.id) {
        return (
            <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center gradient-background3">
                <div className="text-center">
                    <img
                        src="/Gamingpic.jpg"  // Replace with your private profile image URL
                        alt="Private Profile"
                        className="mx-auto mb-8 w-48 h-48 object-cover rounded-full"
                    />
                    <p className="text-xl font-bold text-stone-200">
                        {profile.name} has a private profile. However, you may message them.
                    </p>
                    <Link to="/" className="text-blue-500 hover:text-blue-700 block mt-4">
                        Go to Home Page
                    </Link>
                </div>
            </div>
        );
    }

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };


    return (
        <div className="container mx-auto mt-10 mb-10 flex flex-col md:flex-row">
            {fetchError ? (
                <div className="p-4 text-center w-full">
                    <p className="text-2xl">{fetchError}</p>
                    <Link to="/" className="text-blue-500 hover:text-blue-700 underline mt-4 block">Go to Home Page</Link>
                </div>
            ) : profile ? (
                <>
                    <div className="flex-auto p-4 md:w-1/3">
                        <div className="bg-purple-950 p-4 text-white text-center rounded-lg shadow-lg gradient-background2">
                            <h2 className="text-2xl font-semibold">{profile.name}</h2>
                            <img
                                src={profile.profileImageUrl || '/default-profile-image.png'}
                                alt="Profile"
                                className="rounded-lg w-48 h-48 object-cover my-4 mx-auto"
                            />
                            <p className="gradient-background3 text-white rounded-lg p-3">{profile.bio}</p>
                            {currentUser && currentUser.uid === profile.id && (
                                <div className="relative inline-block text-left mt-4">
                                    <button
                                        onClick={handleDropdownToggle}
                                        type="button"
                                        className="inline-flex items-center justify-center w-full rounded-md shadow-lg px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 transition-colors duration-300"
                                        id="options-menu"
                                        aria-haspopup="true"
                                        aria-expanded="true"
                                    >
                                        Actions
                                        <svg
                                            className="-mr-1 ml-2 h-5 w-5 hidden" // Hide the arrow for now, to be toggled
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                                            />
                                        </svg>
                                    </button>

                                    {showDropdown && (
                                        <div
                                            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="options-menu"
                                        >
                                            <div className="py-1">
                                                <button
                                                    onClick={handleOpenDialog}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                >
                                                    New Daily Post
                                                </button>
                                                <button
                                                    onClick={handleShowMessagesModal}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                >
                                                    {showMessagesModal ? 'Hide Messages' : 'Show Messages'}
                                                </button>
                                                <button
                                                    onClick={togglePrivacy}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                >
                                                    {profile.isPublic ? 'Make Private' : 'Make Public'}
                                                </button>

                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}




                        </div>
                    </div>
                    <div className="flex-auto p-4 md:w-1/3">
                        <h3 className="text-xl font-extrabold mb-2 zoom text-white text-center gradient-background2 rounded-md p-4 ">Daily Posts</h3>
                        <ul>
                            {dailyPosts.map((post) => (
                                <li
                                    key={post.id}
                                    className="mb-4 gradient-background3 p-4 rounded-md shadow-lg relative max-w-sm mx-auto md:max-w-full text-white"
                                >
                                    {currentUser && currentUser.uid === profile.id && (
                                        <button
                                            onClick={() => handleDeletePost(post.id, post.imgUrl)}
                                            className="absolute top-2 right-2 group"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-red-600 group-hover:text-red-700"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    className="group-hover:fill-red-600"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M3 6h18M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m4 0v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6h12z"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                    {post.imgUrl && (
                                        <img
                                            src={post.imgUrl}
                                            alt="Post"
                                            className="w-full h-40 object-contain rounded-md mb-4 mx-auto"
                                        />
                                    )}
                                    <p style={{ whiteSpace: 'pre-line' }}>{post.content}</p>
                                    <p className="text-xs text-gray-500 mt-3">
                                        {new Date(post.date.seconds * 1000).toLocaleDateString()}
                                    </p>
                                    <div className="flex justify-between items-center mt-4">
                                        <button
                                            onClick={() => handleLikePost(post.id)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Likes {post.likes}
                                        </button>

                                    </div>
                                </li>
                            ))}

                        </ul>
                    </div>

                    {showMessagesModal && (
                        <Modal onClose={handleCloseMessagesModal}>
                            <div className="p-4">
                                <h2 className="text-2xl font-semibold mb-2">Messages</h2>
                                <Messages profileId={profile.id} messages={messages} />
                            </div>
                        </Modal>
                    )}

                    {dialogOpen && (
                        <Modal onClose={handleCloseDialog}>
                            <DailyPostForm profileId={profile.id} onSubmit={handlePostSubmit} onCancel={handleCloseDialog} />
                        </Modal>
                    )}



                </>
            ) : (
                <p className="text-2xl">Loading profile...</p>
            )}
        </div>
    );
};

export default Profile;