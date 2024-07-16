import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseconfig/firebase';
import { collection, doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import VideoEmbed from '../special-setups/VideoEmbed'; // Import your VideoEmbed component

const VideoAlter = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'videos'));
                const fetchedVideos = querySnapshot.docs.map(doc => ({
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

    const handleEdit = (video) => {
        setSelectedVideo(video);
        setModalOpen(true);
    };

    const handleDelete = async (videoId) => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            try {
                await deleteDoc(doc(db, 'videos', videoId));
                setVideos(videos.filter(video => video.id !== videoId));
                alert('Video deleted successfully!');
            } catch (error) {
                console.error('Error deleting video: ', error);
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
            await updateDoc(doc(db, 'videos', selectedVideo.id), selectedVideo);
            setModalOpen(false);
            alert('Video updated successfully!');
        } catch (error) {
            console.error('Error updating video: ', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Manage Videos</h2>
            {videos.length === 0 ? (
                <p className="text-white text-center">No videos found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                            <VideoEmbed videoUrl={video.videoUrl} />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-white mb-2">{video.title}</h3>
                                <p className="text-gray-400 text-sm">Posted by: {video.postedBy}</p>
                                <p className="text-gray-400 text-sm">Likes: {video.likes}</p>
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => handleEdit(video)}
                                        className="py-1 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(video.id)}
                                        className="py-1 px-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
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
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto">
                        <h2 className="text-2xl font-bold mb-4">Edit Video</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Title:</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={selectedVideo.title}
                                    onChange={(e) => setSelectedVideo({ ...selectedVideo, title: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Content:</label>
                                <textarea
                                    name="content"
                                    value={selectedVideo.content}
                                    onChange={(e) => setSelectedVideo({ ...selectedVideo, content: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Date:</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={selectedVideo.date}
                                    onChange={(e) => setSelectedVideo({ ...selectedVideo, date: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Video URL:</label>
                                <input
                                    type="text"
                                    name="videoUrl"
                                    value={selectedVideo.videoUrl}
                                    onChange={(e) => setSelectedVideo({ ...selectedVideo, videoUrl: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Posted By:</label>
                                <input
                                    type="text"
                                    name="postedBy"
                                    value={selectedVideo.postedBy}
                                    onChange={(e) => setSelectedVideo({ ...selectedVideo, postedBy: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Likes:</label>
                                <input
                                    type="number"
                                    name="likes"
                                    value={selectedVideo.likes}
                                    onChange={(e) => setSelectedVideo({ ...selectedVideo, likes: parseInt(e.target.value) })}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
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
