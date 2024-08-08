import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import fetchProfiles from "../components/fetchProfiles"; // Adjust the import path as necessary
import SendMessageDialog from "../components/SendMessageDialog";

const UserProfileSearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("q");
  const [searchResults, setSearchResults] = useState([]);
  const [showDialog, setShowDialog] = useState(false); // State to control dialog visibility
  const [selectedProfile, setSelectedProfile] = useState(null); // State to store selected profile

  useEffect(() => {
    const fetchAndSetProfiles = async () => {
      try {
        const profiles = await fetchProfiles(searchTerm);
        setSearchResults(profiles);
      } catch (error) {
        console.error("Error searching profiles:", error);
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
      <h2 className="mb-4 text-2xl font-bold text-black ">
        Search Results for "{searchTerm}"
      </h2>

      {/* Add a small image before the search results */}
      <div className="flex justify-center mb-6 zoom">
        <img
          src="https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/Gamingpic.jpg?raw=true" // Replace with your image path
          alt="Search Results"
          className="w-24 h-24 object-cover rounded-full shadow-[0_0_40px_purple]"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {searchResults.length > 0 ? (
          searchResults.map((profile) => (
            <div key={profile.id}>
              <Link to={`/profile/${profile.id}`}>
                <div className="gradient-background3 mb-3 ml-4 rounded-md   p-1 text-white shadow-sky">
                  <h3 className="mb-2 text-lg font-bold">{profile.name}</h3>
                  {/* Display additional profile details as needed */}
                </div>
              </Link>
              <button
                className="gradient-background2 zoom focus:shadow-outline mb-5 ml-4 rounded px-2 py-2 font-bold text-white hover:bg-purple-900 focus:outline-none shadow-neon"
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
