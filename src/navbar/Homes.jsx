import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { auth, db } from "../firebaseconfig/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import ProfileForm from "../components/ProfileForm"; // Adjust the path based on your project structure
import Spinner from "../special-setups/Spinner";

const Home = () => {
  const adminEmail = "admin@example.com";

  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
  const [showMainImageDialog, setShowMainImageDialog] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
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

    const fetchBackgroundImages = async () => {
      try {
        const docRef = doc(collection(db, "settings"), "background");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBackgroundImageUrl(data.backgroundImageUrl || "");
          setMainImageUrl(data.mainImageUrl || "");
        } else {
          setBackgroundImageUrl("");
          setMainImageUrl("");
        }
      } catch (error) {
        console.error("Error fetching background images:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchBackgroundImages();

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
    setBackgroundImageUrl(newImageUrl);
    setShowBackgroundDialog(false);
    setNewImageUrl("");

    const docRef = doc(collection(db, "settings"), "background");
    await setDoc(docRef, { backgroundImageUrl: newImageUrl, mainImageUrl }); // Update only backgroundImageUrl
  };

  const handleMainImageUrlSubmit = async () => {
    setMainImageUrl(newImageUrl);
    setShowMainImageDialog(false);
    setNewImageUrl("");

    const docRef = doc(collection(db, "settings"), "background");
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
      className="relative flex min-h-screen flex-col items-center justify-start p-4"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        filter: "brightness(90%)", // slightly reduce brightness
      }}
    >
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
              className="mb-4 rounded-full bg-teal-600 px-4 py-2 text-white shadow-lg transition-colors duration-300 hover:bg-teal-700"
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
        <Carousel.Item>
          <img
            className="d-block w-full transform rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            src="https://images.pexels.com/photos/6303604/pexels-photo-6303604.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Fourth slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-full transform rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            src="https://images.pexels.com/photos/8385217/pexels-photo-8385217.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Fifth slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-full transform rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            src="https://images.pexels.com/photos/5702166/pexels-photo-5702166.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Sixth slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-full transform rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            src="https://images.pexels.com/photos/6203418/pexels-photo-6203418.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Sixth slide"
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

      {/* Background Image Dialog */}
      {showBackgroundDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold">
              Change Background Image
            </h2>
            <input
              type="url"
              className="mb-4 w-full rounded border p-2"
              placeholder="Enter Image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                className="rounded-full bg-teal-600 px-4 py-2 text-white shadow-lg transition-colors duration-300 hover:bg-teal-700"
                onClick={handleBackgroundUrlSubmit}
              >
                Save
              </button>
              <button
                className="rounded-full bg-red-600 px-4 py-2 text-white shadow-lg transition-colors duration-300 hover:bg-red-700"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold">Change Main Image</h2>
            <input
              type="url"
              className="mb-4 w-full rounded border p-2"
              placeholder="Enter Image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                className="rounded-full bg-teal-600 px-4 py-2 text-white shadow-lg transition-colors duration-300 hover:bg-teal-700"
                onClick={handleMainImageUrlSubmit}
              >
                Save
              </button>
              <button
                className="rounded-full bg-red-600 px-4 py-2 text-white shadow-lg transition-colors duration-300 hover:bg-red-700"
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
