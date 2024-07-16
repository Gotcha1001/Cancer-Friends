import React, { useState, useEffect } from 'react';
import { db, storage, Timestamp } from '../firebaseconfig/firebase';
import { collection, query, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import Spinner from '../special-setups/Spinner'; // Import Spinner component

export default function InspireAlter() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5); // Number of posts per page
    const [selectedPost, setSelectedPost] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const q = query(collection(db, 'inspire'));
                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date.toDate() // Convert Firestore Timestamp to Date
                }));
                // Sort posts by date in descending order (latest first)
                postsData.sort((a, b) => b.date - a.date);
                setPosts(postsData);
                setLoading(false); // Set loading to false once data is fetched
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError('Failed to load posts.');
            }
        };

        fetchPosts();
    }, []);

    const handleUpdateClick = (post) => {
        setSelectedPost(post);
        setIsDialogOpen(true);
    };

    const handleDeleteClick = async (post) => {
        try {
            if (post.imgUrl) {
                // Delete image from storage
                const imgRef = ref(storage, post.imgUrl);
                await deleteObject(imgRef);
            }
            // Delete post from Firestore
            await deleteDoc(doc(db, 'inspire', post.id));
            setPosts(posts.filter(p => p.id !== post.id));
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        const { id, date, content, imgUrl, likes, postedBy } = selectedPost;
        try {
            const postRef = doc(db, 'inspire', id);
            await updateDoc(postRef, {
                date: Timestamp.fromDate(new Date(date)), // Convert date to Timestamp
                content,
                imgUrl,
                likes,
                postedBy
            });
            setIsDialogOpen(false);
            window.location.reload(); // Refresh the page after update
        } catch (err) {
            console.error('Error updating post:', err);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSelectedPost(prevPost => ({
            ...prevPost,
            [name]: value
        }));
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(posts.length / postsPerPage)));
    const prevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-black to-white p-4">
            <h1 className="text-4xl font-bold text-white my-8 mt-16">Manage Inspiration Posts</h1>
            <div className="inspire-posts-list w-full max-w-2xl mt-1">
                {currentPosts.length > 0 ? (
                    currentPosts.map((post, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 text-white rounded-lg shadow-lg p-6 mb-4"
                        >
                            <h2 className="text-2xl font-bold mb-4">{post.content}</h2>
                            <p className="mb-4"><strong>Date:</strong> {post.date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <p className="mb-4"><strong>Posted By:</strong> {post.postedBy}</p>
                            {post.imgUrl && (
                                <div className="mb-4 flex justify-center">
                                    <img src={post.imgUrl} alt="Post" className="w-full h-auto rounded-lg" />
                                </div>
                            )}

                            <button
                                className="bg-teal-500 hover:bg-teal-700 text-white py-2 px-4 rounded mr-2"
                                onClick={() => handleUpdateClick(post)}
                            >
                                Update
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                                onClick={() => handleDeleteClick(post)}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No inspiration posts available.</p>
                )}
            </div>

            {isDialogOpen && selectedPost && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Update Post</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label htmlFor="date" className="block text-gray-700 font-bold mb-2">Date:</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={new Date(selectedPost.date).toISOString().split('T')[0]}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Content:</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={selectedPost.content}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded whitespace-pre-wrap"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="imgUrl" className="block text-gray-700 font-bold mb-2">Image URL:</label>
                                <input
                                    type="text"
                                    id="imgUrl"
                                    name="imgUrl"
                                    value={selectedPost.imgUrl}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                {selectedPost.imgUrl && (
                                    <div className="mt-4 flex justify-center">
                                        <img src={selectedPost.imgUrl} alt="Post" className="w-32 h-auto rounded-lg" />
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="likes" className="block text-gray-700 font-bold mb-2">Likes:</label>
                                <input
                                    type="number"
                                    id="likes"
                                    name="likes"
                                    value={selectedPost.likes}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="postedBy" className="block text-gray-700 font-bold mb-2">Posted By:</label>
                                <input
                                    type="text"
                                    id="postedBy"
                                    name="postedBy"
                                    value={selectedPost.postedBy}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded mr-2"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-teal-500 hover:bg-teal-700 text-white py-2 px-4 rounded"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {!isDialogOpen && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={prevPage}
                        className={`bg-teal-400 hover:bg-teal-500 text-white py-2 px-4 rounded mr-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <div className="flex">
                        {[...Array(Math.ceil(posts.length / postsPerPage)).keys()].map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => paginate(pageNumber + 1)}
                                className={`bg-teal-500 hover:bg-teal-700 text-white py-2 px-4 rounded mx-2 ${currentPage === pageNumber + 1 ? 'bg-teal-700' : ''}`}
                            >
                                {pageNumber + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={nextPage}
                        className={`bg-teal-400 hover:bg-teal-500 text-white py-2 px-4 rounded ${currentPage === Math.ceil(posts.length / postsPerPage) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
