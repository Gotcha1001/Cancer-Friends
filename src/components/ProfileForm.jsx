import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db } from "../firebaseconfig/firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ProfileForm = ({ onClose }) => {
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [nameLowercase, setNameLowercase] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const fetchProfileData = async () => {
        try {
          const profileRef = doc(db, "profiles", user.uid);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            const data = profileSnap.data();
            setName(data.name || "");
            setBio(data.bio || "");
            setProfileImageUrl(data.profileImageUrl || "");
          } else {
            console.log("No profile found for current user");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };

      fetchProfileData();
    }
  }, []);

  // Function to set name and nameLowercase
  const setNameAndLowercase = (value) => {
    const lowercaseValue = value.toLowerCase();
    setName(value);
    setNameLowercase(lowercaseValue);
  };

  const handleProfileSubmit = async () => {
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const storage = getStorage();
        let downloadURL = profileImageUrl;

        // Delete previous profile image if exists
        if (profileImage && profileImageUrl) {
          const oldImageRef = ref(storage, profileImageUrl);
          await deleteObject(oldImageRef);
        }

        // Upload new profile image
        if (profileImage) {
          const storageRef = ref(
            storage,
            `images/${user.uid}/${profileImage.name}`,
          );
          const uploadTask = uploadBytesResumable(storageRef, profileImage);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error("Upload failed", error);
              setLoading(false);
            },
            async () => {
              downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setProfileImageUrl(downloadURL);

              // Update profile data in Firestore with name and name_lowercase
              await setDoc(doc(db, "profiles", user.uid), {
                bio,
                name,
                name_lowercase: nameLowercase, // Update name_lowercase
                profileImageUrl: downloadURL,
                isPublic: true // Add this line to set isPublic to true
              });

              setLoading(false);
              onClose(); // Close the form after successful submission
              navigate("/profile"); // Navigate to profile page
            },
          );
        } else {
          // Update profile without changing the image
          await setDoc(doc(db, "profiles", user.uid), {
            bio,
            name,
            name_lowercase: nameLowercase, // Update name_lowercase
            profileImageUrl: downloadURL,
          });

          setLoading(false);
          onClose(); // Close the form after successful submission
          navigate("/profile"); // Navigate to profile page
        }
      } catch (error) {
        console.error("Error submitting profile:", error);
        setLoading(false);
      }
    } else {
      console.error("User is not authenticated");
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Edit Profile</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setNameAndLowercase(e.target.value)} // Update name and name_lowercase
          className="mb-4 w-full rounded-md border border-gray-300 p-2"
          placeholder="Name"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mb-4 w-full rounded-md border border-gray-300 p-2"
          placeholder="Bio"
        />
        <input
          type="file"
          onChange={handleImageChange}
          className="mb-4 w-full rounded-md border border-gray-300 p-2"
        />
        {profileImageUrl && (
          <img
            src={profileImageUrl}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover"
          />
        )}
        {loading && (
          <div className="mb-4 text-center text-teal-600">
            Uploading...
            <div className="mt-2 h-4 w-full rounded-full bg-gray-200">
              <div
                className="h-4 rounded-full bg-teal-600"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <button
            className="mr-2 rounded-full bg-teal-600 px-4 py-2 text-white shadow-lg transition-colors duration-300 hover:bg-teal-700"
            onClick={handleProfileSubmit}
            disabled={loading}
          >
            {profileImageUrl ? "Change Profile" : "Upload Profile"}
          </button>
          <button
            className="rounded-full bg-red-600 px-4 py-2 text-white shadow-lg transition-colors duration-300 hover:bg-red-700"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
