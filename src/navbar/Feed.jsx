import React, { useContext, useEffect, useState } from "react";
import {
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  doc as firestoreDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseconfig/firebase"; // Adjust the import path as per your project structure
import { getAuth } from "firebase/auth";
import { PostContext } from "../App";
import Pagination from "../special-setups/Pagination";


const Feed = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Number of posts per page


  const { sharedPosts, setSharedPosts } = useContext(PostContext);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const isAdmin = currentUser?.email === "admin@example.com"; // Replace with your admin check logic

  useEffect(() => {
    fetchSharedPosts(); // Initial fetch when component mounts
  }, []);

  const fetchSharedPosts = async () => {
    try {
      const sharedPostsRef = collection(db, "shared-posts");
      const querySnapshot = await getDocs(sharedPostsRef);

      let posts = [];
      for (const doc of querySnapshot.docs) {
        const postData = doc.data();
        const profileId = postData.profileId;

        // Fetch the user's name from the profiles collection
        const profileRef = firestoreDoc(db, "profiles", profileId);
        const profileDoc = await getDoc(profileRef);

        if (profileDoc.exists()) {
          const profileData = profileDoc.data();
          const postWithProfile = {
            id: doc.id,
            ...postData,
            name: profileData.name, // Add the name to the post data
          };
          posts.push(postWithProfile);
        }
      }

      // Sort posts by date in descending order
      posts.sort((a, b) => b.date.seconds - a.date.seconds);

      setSharedPosts(posts);
      console.log("Fetched shared posts successfully:", posts);
    } catch (error) {
      console.error("Error fetching shared posts:", error);
    }
  };

  // Handler functions for delete and like functionality (unchanged from your original code)

  const handleDeletePost = async (sharedPostId) => {
    try {
      console.log("Deleting post with sharedPostId:", sharedPostId);

      // Check admin status
      if (!isAdmin) {
        console.error("Unauthorized: Only admins can delete posts.");
        return;
      }

      // Query for the document with the specific sharedPostId
      const sharedPostsRef = collection(db, "shared-posts");
      const q = query(
        sharedPostsRef,
        where("sharedPostId", "==", sharedPostId),
      ); // Use 'query' here

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        console.log("Deleting post document:", doc.id);
        await deleteDoc(doc.ref);
      });

      console.log("Post deleted successfully!");

      // Optimistically update the UI
      setSharedPosts((prevPosts) =>
        prevPosts.filter((post) => post.sharedPostId !== sharedPostId),
      );
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      // Find the post in sharedPosts array
      const postToUpdate = sharedPosts.find(
        (post) => post.sharedPostId === postId,
      );
      if (!postToUpdate) {
        console.error(
          `Post with sharedPostId ${postId} not found in sharedPosts array`,
          sharedPosts,
        );
        return;
      }

      // Reference the specific document using firestoreDoc()
      const sharedPostRef = firestoreDoc(db, "shared-posts", postId);
      if (!sharedPostRef) {
        console.error(
          `Firestore document reference not found for postId ${postId}`,
        );
        return;
      }

      await updateDoc(sharedPostRef, {
        likes: (postToUpdate.likes || 0) + 1,
      });

      // Optimistically update local state to reflect the change
      setSharedPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.sharedPostId === postId
            ? { ...post, likes: (post.likes || 0) + 1 }
            : post,
        ),
      );

      // Check if the post has a corresponding daily-post and update its likes in 'daily-posts' collection
      const dailyPostId = postToUpdate.dailyPostId;
      if (dailyPostId) {
        const dailyPostRef = firestoreDoc(db, "daily-posts", dailyPostId);
        const dailyPostSnap = await getDoc(dailyPostRef);

        if (dailyPostSnap.exists()) {
          const currentLikes = dailyPostSnap.data().likes || 0;
          await updateDoc(dailyPostRef, {
            likes: currentLikes + 1,
          });
        }
      }

      console.log("Post liked successfully!");
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sharedPosts.slice(indexOfFirstPost, indexOfLastPost);



  const nextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(sharedPosts.length / postsPerPage)));
  const prevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));


  useEffect(() => {
    console.log("Scrolling to top due to page change:", currentPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);



  return (
    <div className="container mx-auto mb-10 mt-10 flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto rounded-xl p-4">
        <div className="gradient-background mx-auto rounded-md p-4">
          <h3 className="zoom mb-4 rounded-md p-3 text-center text-2xl font-extrabold text-white hover:bg-black">
            Shared Posts
          </h3>
          {sharedPosts.length > 0 ? (
            currentPosts.map((post, index) => (
              <div
                key={`${post.id}-${index}`}
                className="post-container gradient-background2 mb-6 rounded-lg p-4 shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-lg font-semibold">{post.title}</h4>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeletePost(post.sharedPostId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
                {post.imgUrl && (
                  <div className="daily-post-image-container mb-4">
                    <img src={post.imgUrl} alt={post.title} />
                  </div>
                )}
                <p className="centered-content mt-2 text-white hover:bg-purple-900 p-2 rounded-md">
                  Content: {post.content}
                </p>
                <p className="mt-2 text-white text-sm font-thin font-sans">
                  By : {post.name}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => handleLikePost(post.sharedPostId)}
                    className="rounded bg-transparent text-red-500 hover:text-red-700 zoom"
                  >
                    ❤️ {post.likes}
                  </button>
                  <p className="text-xs text-white hover:bg-purple-700 p-2 rounded-lg">
                    {new Date(post.date.seconds * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))


          ) : (
            <p className="text-center">No shared posts yet</p>
          )}
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={sharedPosts.length}
            paginate={(pageNumber) => setCurrentPage(pageNumber)}
            nextPage={nextPage}
            prevPage={prevPage}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Feed;