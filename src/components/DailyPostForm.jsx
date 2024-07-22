import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { db, storage } from "../firebaseconfig/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const DailyPostForm = ({ profileId, onSubmit, onCancel }) => {
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImgUrl(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (user && profileId) {
      try {
        let imageUrl = "";

        if (imgUrl) {
          const storageRef = ref(
            storage,
            `daily-posts/${user.uid}/${imgUrl.name}`,
          );
          const uploadTask = uploadBytesResumable(storageRef, imgUrl);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error("Upload failed", error);
              setUploading(false);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              savePost(imageUrl);
            },
          );
        } else {
          savePost(imageUrl);
        }
      } catch (error) {
        console.error("Error adding daily post:", error);
        setUploading(false);
      }
    }
  };

  const savePost = async (imageUrl) => {
    try {
      await addDoc(collection(db, "daily-posts"), {
        date: serverTimestamp(),
        imgUrl: imageUrl,
        content,
        profileId,
      });
      setContent("");
      setImgUrl(null);
      onSubmit({ content });
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mb-4 w-full rounded-md border border-gray-300 p-2"
        placeholder="What's on your mind?"
        required
      />
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 w-full rounded-md border border-gray-300 p-2"
      />
      {uploading && (
        <div className="relative pt-1">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <span className="inline-block rounded-full bg-teal-200 px-2 py-1 text-xs font-semibold uppercase text-teal-600">
                Uploading...
              </span>
            </div>
            <div className="text-right">
              <span className="inline-block text-xs font-semibold text-teal-600">
                {`${uploadProgress.toFixed(0)}%`}
              </span>
            </div>
          </div>
          <div className="mb-4 flex h-2 overflow-hidden rounded bg-teal-200 text-xs">
            <div
              style={{ width: `${uploadProgress}%` }}
              className="flex flex-col justify-center whitespace-nowrap bg-teal-500 text-center text-white shadow-none"
            ></div>
          </div>
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="mr-2 rounded-full bg-teal-600 px-4 py-2 text-white shadow-lg transition-colors duration-300 hover:bg-teal-700"
          disabled={uploading}
        >
          {uploading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
};

export default DailyPostForm;
