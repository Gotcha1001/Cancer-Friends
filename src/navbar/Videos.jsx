import React, { useState, useEffect } from 'react';
import { db } from '../firebaseconfig/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import VideoEmbed from '../special-setups/VideoEmbed';
import Pagination from '../special-setups/Pagination'; // Adjust the path to your Pagination component
import Spinner from '../special-setups/Spinner'; // Assuming you have a Spinner component

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [videosPerPage] = useState(5); // Number of videos per page

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'videos'));
                const fetchedVideos = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setVideos(fetchedVideos);
            } catch (error) {
                console.error('Error fetching videos: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    // Function to persist current page in URL query params
    const updatePageQueryParam = (page) => {
        const url = new URL(window.location.href);
        url.searchParams.set('page', page);
        window.history.pushState({ path: url.href }, '', url.href);
    };

    // Function to get current page from URL query params on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = parseInt(urlParams.get('page')) || 1;
        setCurrentPage(page);
    }, []);

    // Effect to scroll to the top when currentPage changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const handleLike = async (videoId, currentLikes) => {
        try {
            const videoDoc = doc(db, 'videos', videoId);
            await updateDoc(videoDoc, { likes: currentLikes + 1 });

            // Update the state to reflect the new likes count
            setVideos((prevVideos) =>
                prevVideos.map((video) =>
                    video.id === videoId ? { ...video, likes: currentLikes + 1 } : video
                )
            );
        } catch (error) {
            console.error('Error liking video: ', error);
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
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-white text-center mt-3 zoom horizontal-rotate">All Videos</h2>
            {videos.length === 0 ? (
                <p className="text-white">No videos found.</p>
            ) : (
                <div>
                    <ul className="divide-gray-200">
                        {currentVideos.map((video) => (
                            <li key={video.id} className="py-4">
                                <div className="gradient-background2 rounded-lg shadow-lg overflow-hidden">
                                    <VideoEmbed videoUrl={video.videoUrl} className="rounded-t-lg" />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-white mb-2">{video.title}</h3>
                                        <p className="text-sm text-gray-500">Posted by: {video.postedBy}</p>
                                        <p className="text-gray-300 mt-2">{video.content}</p>
                                        <div className="flex items-center mt-4">
                                            <button
                                                onClick={() => handleLike(video.id, video.likes)}
                                                className="py-2 px-4 bg-blue-500 zoom text-white rounded-md hover:bg-blue-600 transition duration-300"
                                            >
                                                Like
                                            </button>
                                            <span className="ml-2 text-white">{video.likes} Likes</span>
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
