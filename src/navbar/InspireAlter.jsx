import React, { useState, useEffect } from "react";
import { db, storage, Timestamp } from "../firebaseconfig/firebase";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import Spinner from "../special-setups/Spinner"; // Import Spinner component

export default function InspireAlter() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Number of posts per page
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // New state for image URL
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false); // New state to track if uploading
  const [updateMethod, setUpdateMethod] = useState(null); // "url" or "file"

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "inspire"));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(), // Convert Firestore Timestamp to Date
        }));
        // Sort posts by date in descending order (latest first)
        postsData.sort((a, b) => b.date - a.date);
        setPosts(postsData);
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts.");
      }
    };

    fetchPosts();
  }, []);

  const handleUpdateClick = (post) => {
    setSelectedPost(post);
    setImageUrl(post.imgUrl); // Initialize imageUrl with the current post's image URL
    setUpdateMethod(null); // Reset the update method
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (post) => {
    try {
      if (post.imagePath) { // Use the storage path to delete the image
        const imgRef = ref(storage, post.imagePath);
        await deleteObject(imgRef);
      }
      // Delete post from Firestore
      await deleteDoc(doc(db, "inspire", post.id));
      setPosts(posts.filter((p) => p.id !== post.id));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUpdateMethod('file'); // Set update method to file
  };

  const handleImageUrlChange = (event) => {
    setImageUrl(event.target.value);
    setUpdateMethod('url'); // Set update method to URL
  };

  const handleImageUpdate = async (event) => {
    event.preventDefault();

    if (updateMethod === 'file' && file) {
      // Start the upload process
      setUploading(true);
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload failed", error);
          setError("Failed to upload image.");
          setUploading(false);
        },
        async () => {
          const newImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          const newImagePath = `images/${file.name}`; // Store the path instead of the full URL
          await updatePost(selectedPost.id, selectedPost.date, selectedPost.content, newImageUrl, newImagePath, selectedPost.likes, selectedPost.postedBy);
        }
      );
    } else if (updateMethod === 'url' && imageUrl.trim() !== "") {
      await updatePost(selectedPost.id, selectedPost.date, selectedPost.content, imageUrl, null, selectedPost.likes, selectedPost.postedBy);
    } else {
      alert("Please select an image URL or upload a file, not both.");
    }
  };

  const updatePost = async (id, date, content, imgUrl, imagePath, likes, postedBy) => {
    try {
      const postRef = doc(db, "inspire", id);
      await updateDoc(postRef, {
        date: Timestamp.fromDate(new Date(date)), // Convert date to Timestamp
        content,
        imgUrl,
        imagePath, // Save the storage path for later reference
        likes,
        postedBy,
      });
      setIsDialogOpen(false);
      setFile(null);
      setImageUrl(""); // Clear the image URL state
      setUploadProgress(0);
      setUploading(false); // Reset uploading state
      window.location.reload(); // Refresh the page after update
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(posts.length / postsPerPage))
    );
  const prevPage = () =>
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-r from-black to-white p-4">
      <h1 className="my-8 mt-16 text-4xl font-bold text-white">
        Manage Inspiration Posts
      </h1>
      <div className="inspire-posts-list mt-1 w-full max-w-2xl">
        {currentPosts.length > 0 ? (
          currentPosts.map((post, index) => (
            <div
              key={index}
              className="mb-4 rounded-lg bg-gray-800 p-6 text-white shadow-lg"
            >
              <h2 className="mb-4 text-2xl font-bold">{post.content}</h2>
              <p className="mb-4">
                <strong>Date:</strong>{" "}
                {post.date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="mb-4">
                <strong>Posted By:</strong> {post.postedBy}
              </p>
              {post.imgUrl && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={post.imgUrl}
                    alt="Post"
                    className="h-auto w-full rounded-lg"
                  />
                </div>
              )}

              <button
                className="mr-2 rounded bg-teal-500 px-4 py-2 text-white hover:bg-teal-700"
                onClick={() => handleUpdateClick(post)}
              >
                Update
              </button>
              <button
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700"
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
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold">Update Post</h2>
            <form onSubmit={handleImageUpdate}>
              <div className="mb-4">
                <label
                  htmlFor="date"
                  className="mb-2 block font-bold text-gray-700"
                >
                  Date:
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={
                    new Date(selectedPost.date).toISOString().split("T")[0]
                  }
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="content"
                  className="mb-2 block font-bold text-gray-700"
                >
                  Content:
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={selectedPost.content}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="imgUrl"
                  className="mb-2 block font-bold text-gray-700"
                >
                  Image URL:
                </label>
                <input
                  type="text"
                  id="imgUrl"
                  value={imageUrl}
                  onChange={(e) => {
                    setUpdateMethod('url');
                    handleImageUrlChange(e);
                  }}
                  disabled={updateMethod === 'file'}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="file"
                  className="mb-2 block font-bold text-gray-700"
                >
                  Choose file to upload:
                </label>
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={(e) => {
                    setUpdateMethod('file');
                    handleFileChange(e);
                  }}
                  disabled={updateMethod === 'url'}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>

              <div className="mb-4">
                {uploading && (
                  <div className="text-center text-gray-600">
                    {`Uploading: ${uploadProgress.toFixed(0)}%`}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-500"
                  } rounded px-4 py-2 text-white hover:bg-teal-700`}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Update Post"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setUpdateMethod(null);
                  setIsDialogOpen(false);
                }}
                className="ml-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="pagination mt-8">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="mr-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(posts.length / postsPerPage)}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
          className="ml-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
