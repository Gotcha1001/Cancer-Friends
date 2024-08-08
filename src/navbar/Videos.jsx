import React, { useState, useEffect } from "react";
import { db } from "../firebaseconfig/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import VideoEmbed from "../special-setups/VideoEmbed";
import Pagination from "../special-setups/Pagination"; // Adjust the path to your Pagination component
import Spinner from "../special-setups/Spinner"; // Assuming you have a Spinner component

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage] = useState(5); // Number of videos per page

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "videos"));
        const fetchedVideos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort videos by date in descending order
        fetchedVideos.sort((a, b) => b.date.seconds - a.date.seconds);

        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching videos: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Function to persist current page in URL query params
  const updatePageQueryParam = (page) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", page);
    window.history.pushState({ path: url.href }, "", url.href);
  };

  // Function to get current page from URL query params on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page")) || 1;
    setCurrentPage(page);
  }, []);

  // Effect to scroll to the top when currentPage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleLike = async (videoId, currentLikes) => {
    try {
      const videoDoc = doc(db, "videos", videoId);
      await updateDoc(videoDoc, { likes: currentLikes + 1 });

      // Update the state to reflect the new likes count
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === videoId ? { ...video, likes: currentLikes + 1 } : video,
        ),
      );
    } catch (error) {
      console.error("Error liking video: ", error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  // Pagination logic
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

  const nextPage = () => {
    const nextPageNumber = currentPage + 1;
    setCurrentPage(nextPageNumber);
    updatePageQueryParam(nextPageNumber);
  };

  const prevPage = () => {
    const prevPageNumber = currentPage - 1;
    setCurrentPage(prevPageNumber);
    updatePageQueryParam(prevPageNumber);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="zoom horizontal-rotate mb-4 mt-3 text-center text-2xl font-bold text-white">
        All Videos
      </h2>
      {videos.length === 0 ? (
        <p className="text-white">No videos found.</p>
      ) : (
        <div>
          <ul className="divide-gray-200">
            {currentVideos.map((video) => (
              <li key={video.id} className="py-4">
                <div className="gradient-background2 overflow-hidden rounded-lg shadow-neon">
                  <VideoEmbed
                    videoUrl={video.videoUrl}
                    className="rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Posted by: {video.postedBy}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(video.date.seconds * 1000).toLocaleDateString()}
                    </p>
                    <p className="centered-content mt-2 text-gray-300">{video.content}</p>
                    <div className="mt-4 flex items-center">
                      <button
                        onClick={() => handleLike(video.id, video.likes)}
                        className="zoom rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
                      >
                        Like
                      </button>
                      <span className="ml-2 text-white">
                        {video.likes} Likes
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Pagination
            itemsPerPage={videosPerPage}
            totalItems={videos.length}
            currentPage={currentPage}
            nextPage={nextPage}
            prevPage={prevPage}
          />
        </div>
      )}
    </div>
  );
};

export default Videos;
