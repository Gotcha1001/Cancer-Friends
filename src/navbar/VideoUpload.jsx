import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseconfig/firebase";
import { addDoc, collection } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

const VideoUpload = () => {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "videos"), {
        title,
        videoUrl,
        content,
        date: Timestamp.now(),
        postedBy: auth.currentUser.email,
        embeddable: true, // Assuming all uploaded videos are embeddable
        likes: 0, // Initial likes count
      });

      setTitle("");
      setVideoUrl("");
      setContent("");
      setError(null);

      alert("Video uploaded successfully!");
      navigate("/videos"); // Redirect to the videos page
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Implement cancellation logic here, if needed
    navigate("/videos"); // Redirect to videos page on cancel
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="gradient-background1 mx-auto mb-3 mt-4 w-full max-w-lg rounded-lg bg-white p-8 shadow-md"
    >
      <h2 className="mb-4 text-2xl font-bold text-white">Upload Video</h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <div className="mb-4">
        <label className="mb-2 block font-semibold text-white">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block font-semibold text-white">
          Video URL:
        </label>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block font-semibold text-white">Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="h-40 w-full resize-none whitespace-pre-wrap rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-md bg-gray-500 px-4 py-2 text-white transition duration-300 hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </form>
  );
};

export default VideoUpload;
