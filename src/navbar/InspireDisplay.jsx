import React, { useEffect, useState } from "react";
import { db, storage } from "../firebaseconfig/firebase";
import { collection, query, getDocs, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import Spinner from "../special-setups/Spinner";


export default function InspireDisplay() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "inspire"));
        const querySnapshot = await getDocs(q);
        let postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: new Date(doc.data().date.seconds * 1000),
        }));

        for (let post of postsData) {
          if (post.imgUrl && post.imgUrl.startsWith("gs://")) {
            const imgRef = ref(storage, post.imgUrl);
            post.imgUrl = await getDownloadURL(imgRef);
          } else if (!post.imgUrl || post.imgUrl === "placeholder-url") {
            // Handle blank or placeholder URLs
            post.imgUrl = null;
          }
        }

        postsData.sort((a, b) => b.date - a.date);

        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId, currentLikes) => {
    try {
      const postRef = doc(db, "inspire", postId);
      const newLikes = currentLikes + 1;

      await updateDoc(postRef, {
        likes: newLikes,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: newLikes } : post,
        ),
      );
    } catch (err) {
      console.error("Error updating likes:", err);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const nextPage = () =>
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  const prevPage = () =>
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

  useEffect(() => {
    console.log("Scrolling to top due to page change:", currentPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner />
        <p>Loading Inspirations... Please wait.</p>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-r from-black to-white p-4">
      <h1 className="my-8 mt-16 text-4xl font-bold text-white zoom">
        Inspiration Quotes
      </h1>
      <div className="inspire-posts-list mt-1 w-full max-w-2xl">
        {currentPosts.length > 0 ? (
          currentPosts.map((post, index) => (
            <div
              key={index}
              className="inspire-post-item mb-4 transform rounded-lg gradient-background2 p-6 shadow-lg transition hover:scale-105"
            >
              <p className="mb-2 text-2xl font-bold text-white text-center">
                Date Posted:{" "}
                {post.date.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              {post.imgUrl ? (
                <div className="mb-4 flex h-96 w-full items-center justify-center overflow-hidden rounded">
                  <img
                    src={post.imgUrl}
                    alt="Post Image"
                    className="zoom h-full w-full transform object-contain transition hover:scale-110"
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-96 w-full items-center justify-center overflow-hidden rounded bg-gray-200">
                  <p className="text-gray-500">No Image Available</p>
                </div>
              )}
              <p className="mb-2 text-xl font-semibold text-indigo-500 text-center">
                Posted By: {post.postedBy}
              </p>
              <p className=" centered-content mb-4 text-lg text-white">{post.content}</p>
              <button
                onClick={() => handleLike(post.id, post.likes)}
                className="zoom rounded-md bg-blue-700 px-4 py-2 text-white shadow-md transition duration-300 hover:bg-blue-600"
              >
                Like ({post.likes})
              </button>
            </div>
          ))
        ) : (
          <p className="text-2xl text-white">
            No inspirational quotes to display.
          </p>
        )}
      </div>
      <div className="mt-8 flex justify-center">
        <button
          onClick={prevPage}
          className={`relative mx-1 flex items-center rounded-md px-4 py-2 shadow-md transition duration-300 ${currentPage === 1
            ? "bg-teal-500 text-gray-500 cursor-not-allowed"
            : "bg-teal-500 text-white hover:bg-teal-600"
            }`}
          disabled={currentPage === 1}
        >
          <span className="ml-2">Previous</span>
        </button>

        <span className="mx-1 rounded-md bg-black px-4 py-2 text-white shadow-md">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={nextPage}
          className={`relative mx-1 flex items-center rounded-md px-4 py-2 shadow-md transition duration-300 ${currentPage === totalPages
            ? "bg-teal-500 text-gray-500 cursor-not-allowed"
            : "bg-teal-500 text-white hover:bg-teal-600"
            }`}
          disabled={currentPage === totalPages}
        >
          <span className="mr-2">Next</span>
        </button>
      </div>

    </div>
  );
}
