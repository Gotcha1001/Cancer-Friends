import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Messages from "../components/Messages";

const NavMessages = () => {
    const [profileId, setProfileId] = useState(null);
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            setProfileId(currentUser.uid);
        } else {
            // Handle case when user is not logged in
            navigate("/login");
        }
    }, [currentUser, navigate]);

    const handleNavigateToProfile = () => {
        if (currentUser) {
            navigate(`/profile/${currentUser.uid}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 ">
            <header className="bg-teal-600 text-white p-4 rounded-lg shadow-md mb-4 flex items-center justify-between">
                <h1 className="text-3xl font-semibold animate-bounce ">Messages</h1>
                <button
                    onClick={handleNavigateToProfile}
                    className="bg-blue-500 text-white p-2 rounded-md shadow-md"
                >
                    Go to Profile
                </button>
            </header>

            <main className="bg-white p-0 rounded-lg shadow-neon">
                {profileId ? (
                    <Messages profileId={profileId} />
                ) : (
                    <p>Loading messages...</p>
                )}
            </main>
        </div>
    );
};

export default NavMessages;
