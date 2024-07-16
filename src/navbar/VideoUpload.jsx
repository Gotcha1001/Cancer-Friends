import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebaseconfig/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const VideoUpload = () => {
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, 'videos'), {
                title,
                videoUrl,
                content,
                date: Timestamp.now(),
                postedBy: auth.currentUser.email,
                embeddable: true, // Assuming all uploaded videos are embeddable
                likes: 0 // Initial likes count
            });

            setTitle('');
            setVideoUrl('');
            setContent('');
            setError(null);

            alert('Video uploaded successfully!');
            navigate('/videos'); // Redirect to the videos page
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Implement cancellation logic here, if needed
        navigate('/videos'); // Redirect to videos page on cancel
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto gradient-background1 mt-4 mb-3">
            <h2 className="text-2xl font-bold mb-4 text-white">Upload Video</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
                <label className="block font-semibold mb-2 text-white">Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label className="block font-semibold mb-2 text-white">Video URL:</label>
                <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label className="block font-semibold mb-2 text-white">Content:</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-40 resize-none whitespace-pre-wrap"
                ></textarea>
            </div>
            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
        </form>
    );
};

export default VideoUpload;
