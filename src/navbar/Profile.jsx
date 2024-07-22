import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "../firebaseconfig/firebase";
import { getAuth } from "firebase/auth";
import DailyPostForm from "../components/DailyPostForm";
import Messages from "../components/Messages";
import Modal from "../components/Modal";
import Spinner from "../special-setups/Spinner";
import quotes from "../quotes";
import Pagination from "../special-setups/Pagination";

import ProfileForm from "../components/ProfileForm";

import { ref, deleteObject } from "firebase/storage";


import { PostContext } from "../App";

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
  const [currentQuote, setCurrentQuote] = useState(""); // State for the current quote
  const [showQuoteModal, setShowQuoteModal] = useState(false); // State for the quote modal


  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(2); // Number of posts per page


  const { sharedPosts, setSharedPosts } = useContext(PostContext); //usecontext state

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const profileId = routeProfileId || currentUser?.uid;


  const navigate = useNavigate(); // Add this line

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      if (!profileId) {
        setFetchError(
          "No Profile Yet! Go to the Home page to create your profile.",
        );
        setLoadingProfile(false);
        return;
      }

      const profileRef = doc(db, "profiles", profileId);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        setProfile({ id: profileSnap.id, ...profileSnap.data() });
        fetchDailyPosts(profileSnap.id);
        fetchMessages(profileSnap.id); // Fetch messages for this profile
      } else {
        setFetchError(
          "No Profile Yet! Go to the Home page to create your profile.",
        );
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setFetchError("Error fetching profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchDailyPosts = async (profileId) => {
    try {
      const dailyPostsRef = collection(db, "daily-posts");
      const q = query(dailyPostsRef, where("profileId", "==", profileId));
      const querySnapshot = await getDocs(q);

      let posts = [];
      querySnapshot.forEach((doc) => {
        // Initialize likes from the database, if present
        posts.push({ id: doc.id, ...doc.data(), likes: doc.data().likes || 0 });
      });

      // Sort posts by date in descending order
      posts.sort((a, b) => b.date.seconds - a.date.seconds); // Assuming date is stored as a timestamp

      setDailyPosts(posts);
    } catch (error) {
      console.error("Error fetching daily posts:", error);
    }
  };


  //////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  const getRandomQuote = () => {
    // Use the imported quotes array instead of the hardcoded positiveQuotes array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
    setShowQuoteModal(true); // Open the quote modal
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  const fetchMessages = async (profileId) => {
    try {
      // Implement your logic to fetch messages here
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Redirect if routeProfileId is not equal to the current profileId
  useEffect(() => {
    if (profileId && routeProfileId !== profileId) {
      navigate(`/profile/${profileId}`);
    }
  }, [routeProfileId, profileId, navigate]);


  useEffect(() => {
    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest("#options-menu")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  const handleSharePost = async (post) => {
    try {
      const sharedPostRef = doc(collection(db, "shared-posts"));
      await setDoc(sharedPostRef, { ...post, sharedPostId: sharedPostRef.id });

      // Update the 'shared' field in the daily-posts collection
      await updateDoc(doc(db, "daily-posts", post.id), { shared: true });

      setSharedPosts((prevPosts) => [
        ...prevPosts,
        { ...post, id: sharedPostRef.id },
      ]);
      setDailyPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === post.id ? { ...p, shared: true } : p)),
      );

      console.log("Post shared successfully!");
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

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

  const handleDeletePost = async (dailyPostId) => {
    try {
      // Delete user-specific post from daily-posts collection
      await deleteDoc(doc(db, "daily-posts", dailyPostId));

      // Delete the corresponding post from shared-posts collection, if it exists
      const sharedPostsRef = collection(db, "shared-posts");
      const q = query(sharedPostsRef, where("dailyPostId", "==", dailyPostId));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      console.log("User post and shared post deleted successfully!");

      // Refetch daily posts after deletion
      await fetchDailyPosts(profile.id);
    } catch (error) {
      console.error("Error deleting post:", error);
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
      // Update likes in 'daily-posts' collection
      const postRef = doc(db, "daily-posts", postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const currentLikes = postSnap.data().likes || 0;
        await updateDoc(postRef, {
          likes: currentLikes + 1,
        });

        // Update local state to reflect the change
        setDailyPosts((prevState) =>
          prevState.map((post) =>
            post.id === postId ? { ...post, likes: currentLikes + 1 } : post,
          ),
        );

        // Check if the post has been shared and update its likes in 'shared-posts' collection
        const sharedPost = sharedPosts.find(
          (post) => post.dailyPostId === postId,
        );
        if (sharedPost) {
          const sharedPostRef = doc(db, "shared-posts", sharedPost.id);
          await updateDoc(sharedPostRef, {
            likes: currentLikes + 1,
          });

          // Update local state to reflect the change in shared-posts
          setSharedPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === sharedPost.id
                ? { ...post, likes: currentLikes + 1 }
                : post,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const togglePrivacy = async () => {
    if (profile) {
      const updatedPrivacy = !profile.isPublic;
      try {
        await updateDoc(doc(db, "profiles", profile.id), {
          isPublic: updatedPrivacy,
        });
        setProfile({ ...profile, isPublic: updatedPrivacy });
      } catch (error) {
        console.error("Error updating privacy setting:", error);
      }
    }
  };

  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = dailyPosts.slice(indexOfFirstPost, indexOfLastPost);

  const nextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(dailyPosts.length / postsPerPage)));
  const prevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

  useEffect(() => {
    console.log("Scrolling to top due to page change:", currentPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  if (loadingProfile) {
    return (
      <div className="text-center">
        <Spinner />
        <p>Loading profile... Please wait.</p>
      </div>
    );
  }

  if (profile && !profile.isPublic && currentUser.uid !== profile.id) {
    return (
      <div className="gradient-background3 fixed left-0 top-0 flex h-screen w-screen items-center justify-center ">
        <div className="text-center ">
          <img
            src="/Gamingpic.jpg" // Replace with your private profile image URL
            alt="Private Profile"
            className="mx-auto mb-8 h-48 w-48 rounded-full object-cover"
          />
          <p className="text-xl font-bold text-stone-200">
            {profile.name} has a private profile. However, you may message them.
          </p>
          <Link to="/" className="mt-4 block text-blue-500 hover:text-blue-700">
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
    <div className="container mx-auto mb-10 mt-10 flex flex-col md:flex-row ">
      {fetchError ? (
        <div className="w-full p-4 text-center">
          <p className="text-2xl">{fetchError}</p>
          <Link
            to="/"
            className="mt-4 block text-blue-500 underline hover:text-blue-700"
          >
            Go to Home Page
          </Link>
        </div>
      ) : profile ? (
        <>


          <div className="flex flex-col md:flex-row w-full">
            {/* Profile Section */}
            <div className="flex-auto p-4 md:w-1/3 ">
              <div className=" gradient-background2 rounded-lg bg-purple-950 p-4 text-center text-white shadow-lg">
                <h2 className="text-2xl font-semibold ">{profile.name}</h2>
                <img
                  src={profile.profileImageUrl || "/default-profile-image.png"}
                  alt="Profile"
                  className="mx-auto my-4 h-48 w-48 rounded-lg object-cover"
                />
                <p className="gradient-background3 rounded-lg p-3 text-white">
                  {profile.bio}
                </p>
                {currentUser && currentUser.uid === profile.id && (
                  <div className="relative mt-4 inline-block text-left">
                    <button
                      onClick={handleDropdownToggle}
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-white shadow-lg transition-colors duration-300 hover:bg-teal-700"
                      id="options-menu"
                      aria-haspopup="true"
                      aria-expanded="true"
                    >
                      Actions
                      <svg
                        className="-mr-1 ml-2 hidden h-5 w-5" // Hide the arrow for now, to be toggled
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
                        className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <div className="py-1">
                          <button
                            onClick={handleOpenDialog}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          >
                            New Daily Post
                          </button>
                          <button
                            onClick={handleShowMessagesModal}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {showMessagesModal
                              ? "Hide Messages"
                              : "Show Messages"}
                          </button>
                          <button
                            onClick={togglePrivacy}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {profile.isPublic ? "Make Private" : "Make Public"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Daily Posts Section */}
            <div className="flex-auto p-4 md:w-2/3 ">
              <div className="flex flex-col md:flex-row w-full">
                <button
                  onClick={getRandomQuote} // Function to get a new quote
                  className="mb-4 w-full md:w-auto mx-auto md:mx-0  bg-black p-3  hover:bg-fuchsia-900 horizontal-spin  text-purple-700  font-serif rounded"
                >
                  Get New Quote
                </button>
              </div>
              <h3 className="zoom bg-black mb-2 rounded-md p-2 text-center font-sans text-xl font-extrabold text-white hover:font-serif ">
                Daily Posts
              </h3>
              <ul>
                {currentPosts.map((post) => (
                  <li
                    key={post.id}
                    className="gradient-background3 relative mx-auto mb-4 max-w-sm rounded-md p-4 text-white shadow-lg md:max-w-full"
                  >
                    {currentUser && currentUser.uid === profile.id && (
                      <button
                        onClick={() => handleDeletePost(post.id, post.imgUrl)} // Pass postId here
                        className="group absolute right-2 top-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-purple-600 group-hover:text-purple-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            className="group-hover:fill-purple-800"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 6h18M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m4 0v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6h12z"
                          />
                        </svg>
                      </button>
                    )}
                    {post.imgUrl && (
                      <div className="daily-post-image-container mx-auto " >
                        <img
                          src={post.imgUrl}
                          alt="Post"
                          className="daily-post-image mt-2"
                        />
                      </div>
                    )}
                    <p className="centered-content">{post.content}</p> {/* Apply the CSS class */}
                    <p className="mt-3 text-xs text-gray-500">
                      {new Date(post.date.seconds * 1000).toLocaleDateString()}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="rounded bg-transparent text-red-500 hover:text-red-700 zoom"
                      >
                        ❤️ {post.likes}
                      </button>
                      {currentUser && !post.shared && (
                        <button
                          onClick={() => handleSharePost(post)}
                          className="ml-4 rounded-md bg-teal-600 px-3 py-1 text-white"
                        >
                          Share
                        </button>
                      )}
                    </div>
                  </li>
                ))}
                <Pagination
                  postsPerPage={postsPerPage}
                  totalPosts={dailyPosts.length}
                  paginate={(pageNumber) => setCurrentPage(pageNumber)}
                  nextPage={nextPage}
                  prevPage={prevPage}
                  currentPage={currentPage}
                />
              </ul>
            </div>




          </div>

          {/* Modals */}
          {showMessagesModal && (
            <Modal onClose={handleCloseMessagesModal}>
              <div className="p-4">
                <h2 className="mb-2 text-2xl font-semibold">Messages</h2>
                <Messages profileId={profile.id} messages={messages} />
              </div>
            </Modal>
          )}

          {dialogOpen && (
            <Modal onClose={handleCloseDialog}>
              <DailyPostForm
                profileId={profile.id}
                onSubmit={handlePostSubmit}
                onCancel={handleCloseDialog}
              />
            </Modal>
          )}
        </>
      ) : (
        <p className="text-2xl">Loading profile...</p>
      )}


      {showQuoteModal && (
        <Modal onClose={() => setShowQuoteModal(false)}>
          <div className="p-4 gradient-background3 rounded-lg">
            <h2 className="text-lg font-bold text-center text-gray-500 zoom">Positive Quote</h2>
            <p className="mt-2 text-center text-white">{currentQuote}</p>

          </div>
        </Modal>
      )}

      {/* Message Modal 
      {showMessagesModal && (
        <Modal onClose={handleCloseMessagesModal}>
          <Messages />
        </Modal>
      )}*/}

      {/* Dialog for adding daily posts 
      {dialogOpen && (
        <Modal onClose={handleCloseDialog}>
          <DailyPostForm onSubmit={handlePostSubmit} />
        </Modal>
      )}*/}


    </div>
  );
};

export default Profile;
