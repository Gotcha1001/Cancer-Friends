import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import fetchProfiles from '../components/fetchProfiles'; // Adjust the import path as necessary
import SendMessageDialog from '../components/SendMessageDialog';

const UserProfileSearchResults = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('q');
    const [searchResults, setSearchResults] = useState([]);
    const [showDialog, setShowDialog] = useState(false); // State to control dialog visibility
    const [selectedProfile, setSelectedProfile] = useState(null); // State to store selected profile

    useEffect(() => {
        const fetchAndSetProfiles = async () => {
            try {
                const profiles = await fetchProfiles(searchTerm);
                setSearchResults(profiles);
            } catch (error) {
                console.error('Error searching profiles:', error);
            }
        };

        if (searchTerm) {
            fetchAndSetProfiles();
        }
    }, [searchTerm]);

    // Function to handle messaging
    const handleMessaging = (profile) => {
        setSelectedProfile(profile); // Store selected profile
        setShowDialog(true); // Show dialog
    };

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Search Results for "{searchTerm}"</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {searchResults.length > 0 ? (
                    searchResults.map(profile => (
                        <div key={profile.id}>
                            <Link to={`/profile/${profile.id}`}>
                                <div className="gradient-background3 text-white p-1 border  border-white rounded-md shadow ml-4  mb-3">

                                    <h3 className="text-lg font-bold mb-2">{profile.name}</h3>
                                    {/* Display additional profile details as needed */}
                                </div>
                            </Link>
                            <button
                                className="gradient-background2 ml-4 hover:bg-purple-900 zoom text-white font-bold py-2 mb-2 px-2 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => handleMessaging(profile)}
                            >
                                Message
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No profiles found.</p>
                )}
            </div>

            {/* Conditional rendering of SendMessageDialog */}
            {showDialog && selectedProfile && (
                <SendMessageDialog
                    profileId={selectedProfile.id}
                    onClose={() => setShowDialog(false)} // Pass a function to close the dialog
                />
            )}
        </div>
    );
};

export default UserProfileSearchResults;
