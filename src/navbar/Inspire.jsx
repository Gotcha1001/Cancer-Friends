import React, { useState } from "react";
import { db, Timestamp } from "../firebaseconfig/firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function Inspire() {
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [content, setContent] = useState("");
  const [likes, setLikes] = useState(0);
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !imageUrl) {
      setMessage("Please select an image to upload or provide an image URL.");
      return;
    }

    try {
      // Convert the selected date string to a JavaScript Date object
      const selectedDate = new Date(date);
      // Convert the Date object to a Firestore Timestamp
      const dateTimestamp = Timestamp.fromDate(selectedDate);

      let downloadURL = imageUrl;

      if (file) {
        // Upload file to Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Upload failed", error);
            setMessage("Failed to upload image.");
          },
          async () => {
            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            await addDoc(collection(db, "inspire"), {
              date: dateTimestamp,
              imgUrl: downloadURL,
              postedBy,
              content,
              likes,
            });

            setMessage("Post added successfully!");
            setDate("");
            setFile(null);
            setImageUrl("");
            setPostedBy("");
            setContent("");
            setLikes(0);
            setUploadProgress(0);
            navigate("/inspire");
          }
        );
      } else {
        await addDoc(collection(db, "inspire"), {
          date: dateTimestamp,
          imgUrl: downloadURL,
          postedBy,
          content,
          likes,
        });

        setMessage("Post added successfully!");
        setDate("");
        setFile(null);
        setImageUrl("");
        setPostedBy("");
        setContent("");
        setLikes(0);
        setUploadProgress(0);
        navigate("/inspire");
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      setMessage("Failed to add post.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="gradient-background m-4 mx-auto w-full max-w-lg rounded-lg bg-white p-8 shadow-md"
    >
      <h2 className="mb-4 text-2xl font-bold">Add New Inspire Post</h2>
      {message && (
        <p
          className={`mb-4 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}
        >
          {message}
        </p>
      )}
      <div className="mb-4">
        <label className="mb-2 block font-semibold text-gray-700">Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block font-semibold text-gray-700">Image:</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={imageUrl !== ""}
        />
        {uploadProgress > 0 && (
          <progress value={uploadProgress} max="100" className="mt-2 w-full" />
        )}
      </div>
      <div className="mb-4">
        <label className="mb-2 block font-semibold text-gray-700">Or Image URL:</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={file !== null}
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block font-semibold text-gray-700">Posted By:</label>
        <input
          type="text"
          value={postedBy}
          onChange={(e) => setPostedBy(e.target.value)}
          placeholder="Posted By"
          required
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block font-semibold text-gray-700">Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
          className="h-40 w-full resize-none whitespace-pre-wrap rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
      >
        Add Post
      </button>
    </form>
  );
}
