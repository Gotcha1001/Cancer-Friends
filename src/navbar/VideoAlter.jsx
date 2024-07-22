import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseconfig/firebase";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import VideoEmbed from "../special-setups/VideoEmbed"; // Import your VideoEmbed component

const VideoAlter = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "videos"));
        const fetchedVideos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching videos: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setModalOpen(true);
  };

  const handleDelete = async (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteDoc(doc(db, "videos", videoId));
        setVideos(videos.filter((video) => video.id !== videoId));
        alert("Video deleted successfully!");
      } catch (error) {
        console.error("Error deleting video: ", error);
      }
    }
  };

  const handleModalClose = () => {
    setSelectedVideo(null);
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "videos", selectedVideo.id), selectedVideo);
      setModalOpen(false);
      alert("Video updated successfully!");
    } catch (error) {
      console.error("Error updating video: ", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h2 className="mb-8 text-center text-3xl font-bold text-white">
        Manage Videos
      </h2>
      {videos.length === 0 ? (
        <p className="text-center text-white">No videos found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {videos.map((video) => (
            <div
              key={video.id}
              className="overflow-hidden rounded-lg bg-gray-800 shadow-lg"
            >
              <VideoEmbed videoUrl={video.videoUrl} />
              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-400">
                  Posted by: {video.postedBy}
                </p>
                <p className="text-sm text-gray-400">Likes: {video.likes}</p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleEdit(video)}
                    className="mr-2 rounded-md bg-blue-500 px-3 py-1 text-white transition duration-300 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="rounded-md bg-red-500 px-3 py-1 text-white transition duration-300 hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="mx-auto w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-4 text-2xl font-bold">Edit Video</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block font-semibold text-gray-700">
                  Title:
                </label>
                <input
                  type="text"
                  name="title"
                  value={selectedVideo.title}
                  onChange={(e) =>
                    setSelectedVideo({
                      ...selectedVideo,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-semibold text-gray-700">
                  Content:
                </label>
                <textarea
                  name="content"
                  value={selectedVideo.content}
                  onChange={(e) =>
                    setSelectedVideo({
                      ...selectedVideo,
                      content: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-semibold text-gray-700">
                  Date:
                </label>
                <input
                  type="date"
                  name="date"
                  value={selectedVideo.date}
                  onChange={(e) =>
                    setSelectedVideo({ ...selectedVideo, date: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-semibold text-gray-700">
                  Video URL:
                </label>
                <input
                  type="text"
                  name="videoUrl"
                  value={selectedVideo.videoUrl}
                  onChange={(e) =>
                    setSelectedVideo({
                      ...selectedVideo,
                      videoUrl: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-semibold text-gray-700">
                  Posted By:
                </label>
                <input
                  type="text"
                  name="postedBy"
                  value={selectedVideo.postedBy}
                  onChange={(e) =>
                    setSelectedVideo({
                      ...selectedVideo,
                      postedBy: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-semibold text-gray-700">
                  Likes:
                </label>
                <input
                  type="number"
                  name="likes"
                  value={selectedVideo.likes}
                  onChange={(e) =>
                    setSelectedVideo({
                      ...selectedVideo,
                      likes: parseInt(e.target.value),
                    })
                  }
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="mr-2 rounded-md bg-red-500 px-4 py-2 text-white transition duration-300 hover:bg-red-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoAlter;
