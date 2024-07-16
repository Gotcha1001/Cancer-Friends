import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebaseconfig/firebase';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import Spinner from '../special-setups/Spinner';

export default function InspireDisplay() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const q = query(collection(db, 'inspire'));
                const querySnapshot = await getDocs(q);
                let postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: new Date(doc.data().date.seconds * 1000)
                }));

                for (let post of postsData) {
                    if (post.imgUrl && post.imgUrl.startsWith('gs://')) {
                        const imgRef = ref(storage, post.imgUrl);
                        post.imgUrl = await getDownloadURL(imgRef);
                    } else if (!post.imgUrl || post.imgUrl === 'placeholder-url') {
                        // Handle blank or placeholder URLs
                        post.imgUrl = null;
                    }
                }

                postsData.sort((a, b) => b.date - a.date);

                setPosts(postsData);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError('Failed to load posts.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleLike = async (postId, currentLikes) => {
        try {
            const postRef = doc(db, 'inspire', postId);
            const newLikes = currentLikes + 1;

            await updateDoc(postRef, {
                likes: newLikes
            });

            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId ? { ...post, likes: newLikes } : post
                )
            );
        } catch (err) {
            console.error('Error updating likes:', err);
        }
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const nextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(posts.length / postsPerPage)));
    const prevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const totalPages = Math.ceil(posts.length / postsPerPage);

    const generatePageNumbers = () => {
        const pageNumbers = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                // Display first 5 pages
                for (let i = 1; i <= 5; i++) {
                    pageNumbers.push(i);
                }
            } else if (currentPage > totalPages - 2) {
                // Display last 5 pages
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                // Display pages around current page
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pageNumbers.push(i);
                }
            }
        }

        return pageNumbers;
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-black to-white p-4">
            <h1 className="text-4xl font-bold text-white my-8 mt-16">Inspiration Quotes</h1>
            <div className="inspire-posts-list w-full max-w-2xl mt-1">
                {currentPosts.length > 0 ? (
                    currentPosts.map((post, index) => (
                        <div
                            key={index}
                            className="inspire-post-item mb-4 p-6 bg-slate-950 rounded-lg shadow-lg transition transform hover:scale-105"
                        >
                            <p className="text-2xl font-bold mb-2 text-white">
                                Date Posted: {post.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            {post.imgUrl ? (
                                <div className="w-full h-96 mb-4 rounded overflow-hidden flex justify-center items-center">
                                    <img src={post.imgUrl} alt="Post Image" className="w-full h-full object-contain transition transform hover:scale-110 zoom" />
                                </div>
                            ) : (
                                <div className="w-full h-96 mb-4 rounded overflow-hidden flex justify-center items-center bg-gray-200">
                                    <p className="text-gray-500">No Image Available</p>
                                </div>
                            )}
                            <p className="text-xl font-semibold mb-2 text-white">Posted By: {post.postedBy}</p>
                            <p className="text-lg mb-4 text-white">{post.content}</p>
                            <button
                                onClick={() => handleLike(post.id, post.likes)}
                                className="bg-blue-700 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300 zoom"
                            >
                                Like ({post.likes})
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-white text-2xl">No inspirational quotes to display.</p>
                )}
            </div>
            <div className="flex justify-center mt-8">
                <button
                    onClick={prevPage}
                    className="mx-1 bg-teal-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {generatePageNumbers().map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`mx-1 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300 ${currentPage === pageNumber ? 'bg-blue-600' : ''}`}
                    >
                        {pageNumber}
                    </button>
                ))}
                <button
                    onClick={nextPage}
                    className="mx-1 bg-teal-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                    disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
