import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db, storage } from '../firebaseconfig/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const DailyPostForm = ({ profileId, onSubmit, onCancel }) => {
    const [content, setContent] = useState('');
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
                let imageUrl = '';

                if (imgUrl) {
                    const storageRef = ref(storage, `daily-posts/${user.uid}/${imgUrl.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, imgUrl);

                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setUploadProgress(progress);
                        },
                        (error) => {
                            console.error('Upload failed', error);
                            setUploading(false);
                        },
                        async () => {
                            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            savePost(imageUrl);
                        }
                    );
                } else {
                    savePost(imageUrl);
                }
            } catch (error) {
                console.error('Error adding daily post:', error);
                setUploading(false);
            }
        }
    };

    const savePost = async (imageUrl) => {
        try {
            await addDoc(collection(db, 'daily-posts'), {
                date: serverTimestamp(),
                imgUrl: imageUrl,
                content,
                profileId,
            });
            setContent('');
            setImgUrl(null);
            onSubmit({ content });
        } catch (error) {
            console.error('Error saving post:', error);
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
                className="border border-gray-300 p-2 w-full mb-4 rounded-md"
                placeholder="What's on your mind?"
                required
            />
            <input
                type="file"
                onChange={handleFileChange}
                className="border border-gray-300 p-2 w-full mb-4 rounded-md"
            />
            {uploading && (
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                                Uploading...
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-teal-600">
                                {`${uploadProgress.toFixed(0)}%`}
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
                        <div
                            style={{ width: `${uploadProgress}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                        ></div>
                    </div>
                </div>
            )}
            <div className="flex justify-end mt-4">
                <button
                    type="submit"
                    className="bg-teal-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-teal-700 transition-colors duration-300 mr-2"
                    disabled={uploading}
                >
                    {uploading ? 'Posting...' : 'Post'}
                </button>

            </div>
        </form>
    );
};

export default DailyPostForm;
