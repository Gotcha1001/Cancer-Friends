import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { auth, db } from "../firebaseconfig/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import ProfileForm from "../components/ProfileForm"; // Adjust the path based on your project structure
import Spinner from "../special-setups/Spinner";

const Home = () => {
  const adminEmail = "admin@example.com";

  const [backgroundMediaUrl, setBackgroundMediaUrl] = useState(""); // URL of the background media
  const [isVideoBackground, setIsVideoBackground] = useState(false); // Boolean to check if the background is a video
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
  const [showMainImageDialog, setShowMainImageDialog] = useState(false);
  const [newMediaUrl, setNewMediaUrl] = useState(""); // Temporary state for the new URL input by the admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false); // State to manage showing the profile dialog
  const [hasProfile, setHasProfile] = useState(false); // State to track if the user has a profile
  const [isLoading, setIsLoading] = useState(true); // State for loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
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

    const fetchBackgroundMedia = async () => {
      try {
        const docRef = doc(collection(db, "settings"), "background");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBackgroundMediaUrl(data.backgroundMediaUrl || "");
          setMainImageUrl(data.mainImageUrl || "");
          setIsVideoBackground(data.isVideoBackground || false); // Check if background is a video
        } else {
          setBackgroundMediaUrl("");
          setMainImageUrl("");
          setIsVideoBackground(false);
        }
      } catch (error) {
        console.error("Error fetching background media:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchBackgroundMedia();

    return unsubscribe;
  }, []);

  const checkUserProfile = async (uid) => {
    try {
      const profileRef = doc(db, "profiles", uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleBackgroundUrlSubmit = async () => {
    const isVideo = newMediaUrl.endsWith(".mp4");
    setBackgroundMediaUrl(newMediaUrl);
    setIsVideoBackground(isVideo);
    setShowBackgroundDialog(false);
    setNewMediaUrl("");

    const docRef = doc(collection(db, "settings"), "background");
    await setDoc(docRef, {
      backgroundMediaUrl: newMediaUrl,
      mainImageUrl,
      isVideoBackground: isVideo
    }); // Update background media URL and type
  };

  const handleMainImageUrlSubmit = async () => {
    setMainImageUrl(newMediaUrl);
    setShowMainImageDialog(false);
    setNewMediaUrl("");

    const docRef = doc(collection(db, "settings"), "background");
    await setDoc(docRef, { backgroundMediaUrl, mainImageUrl: newMediaUrl }); // Update only mainImageUrl
  };

  const openProfileDialog = () => {
    setShowProfileDialog(true);
  };

  if (isLoading) {
    return <Spinner />; // Show spinner while loading
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start p-4">
      {isVideoBackground ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={backgroundMediaUrl}
          autoPlay
          loop
          muted
        />
      ) : (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${backgroundMediaUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            filter: "brightness(90%)", // slightly reduce brightness
          }}
        />
      )}
      <div className="relative z-10 flex flex-col items-center justify-start w-full h-full">
        {currentUser === adminEmail && (
          <>
            <button
              className="relative left-4 top-3 z-10 mb-4 rounded-full bg-teal-600 px-4 py-2 text-white shadow-lg transition-colors duration-300 hover:bg-teal-700 md:left-3"
              onClick={() => setShowBackgroundDialog(true)}
            >
              Change Background
            </button>
            <button
              className="relative left-4 top-3 z-10 mb-4 rounded-full bg-teal-600 px-4 py-2 text-white shadow-lg transition-colors duration-300 hover:bg-teal-700 md:left-3"
              onClick={() => setShowMainImageDialog(true)}
            >
              Change Main Image
            </button>
          </>
        )}

        <h1 className="gradient-background1 mb-8 rounded-full p-3 text-center text-3xl font-bold text-white hover:bg-teal-600 md:text-4xl">
          CANCER FRIENDS
        </h1>

        {/* Main Image Changeable */}
        <div className="mb-8 w-full max-w-xl md:w-3/4">
          <img
            src={mainImageUrl}
            alt="Main Image"
            className="zoom mx-auto rounded-lg shadow-lg"
            style={{ maxWidth: "100%" }}
          />
        </div>

        {/* Profile Button */}
        {currentUser && (
          <>
            {hasProfile ? (
              <button
                className=" animate-bounce mb-4 rounded-full bg-teal-600 px-4 py-2 text-white shadow-lg transition-colors duration-300 hover:bg-teal-700"
                onClick={openProfileDialog}
              >
                Change Profile
              </button>
            ) : (
              <button
                className="zoom mb-4 rounded-full bg-teal-600 px-4 py-2 text-white shadow-2xl transition-colors duration-300 hover:bg-black"
                onClick={openProfileDialog}
              >
                Create Profile
              </button>
            )}
          </>
        )}

        {/* Profile Creation Form Dialog */}
        {showProfileDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <ProfileForm onClose={() => setShowProfileDialog(false)} />
            </div>
          </div>
        )}

        {/* Background Carousel */}
        <Carousel
          className="mb-8 w-full md:w-3/4"
          style={{ maxWidth: "600px" }}
          interval={1000}
        >
          <Carousel.Item>
            <img
              className="d-block w-full transform rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              src="https://images.pexels.com/photos/3900468/pexels-photo-3900468.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-full transform rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              src="https://images.pexels.com/photos/5588323/pexels-photo-5588323.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Second slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-full transform rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              src="https://images.pexels.com/photos/6984616/pexels-photo-6984616.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Third slide"
            />
          </Carousel.Item>
        </Carousel>

        {/* Artwork Grid */}
        <div className="mt-4 grid w-full grid-cols-1 gap-4 md:w-3/4 md:grid-cols-2 lg:grid-cols-3">
          <div className="h-64 w-full transform overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            <img
              className="object-co h-full w-full"
              src="https://images.pexels.com/photos/5483025/pexels-photo-5483025.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Artwork"
            />
          </div>
          <div className="h-64 w-full transform overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            <img
              className="h-full w-full object-cover"
              src="https://images.pexels.com/photos/4276425/pexels-photo-4276425.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Artwork"
            />
          </div>
          <div className="h-64 w-full transform overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            <img
              className="h-full w-full object-cover"
              src="https://images.pexels.com/photos/9758218/pexels-photo-9758218.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Artwork"
            />
          </div>
          <div className="h-64 w-full transform overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            <img
              className="h-full w-full object-cover"
              src="https://images.pexels.com/photos/6984608/pexels-photo-6984608.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Artwork"
            />
          </div>
          <div className="h-64 w-full transform overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            <img
              className="h-full w-full object-cover"
              src="https://images.pexels.com/photos/1704120/pexels-photo-1704120.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Artwork"
            />
          </div>
          <div className="h-64 w-full transform overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            <img
              className="h-full w-full object-cover"
              src="https://images.pexels.com/photos/4684178/pexels-photo-4684178.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Artwork"
            />
          </div>
        </div>

        {/* Background Change Dialog */}
        {showBackgroundDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold">Change Background</h2>
              <input
                type="text"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
                placeholder="Enter image or video URL"
                className="mb-4 w-full rounded border border-gray-300 px-3 py-2"
              />
              <div className="flex justify-end">
                <button
                  className="mr-2 rounded bg-gray-300 px-4 py-2"
                  onClick={() => setShowBackgroundDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
                  onClick={handleBackgroundUrlSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Image Change Dialog */}
        {showMainImageDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold">Change Main Image</h2>
              <input
                type="text"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
                placeholder="Enter image URL"
                className="mb-4 w-full rounded border border-gray-300 px-3 py-2"
              />
              <div className="flex justify-end">
                <button
                  className="mr-2 rounded bg-gray-300 px-4 py-2"
                  onClick={() => setShowMainImageDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
                  onClick={handleMainImageUrlSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
