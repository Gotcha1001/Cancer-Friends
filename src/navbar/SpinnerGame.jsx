import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Wheel from '../components/Wheel';
import UserDialog from '../components/UserDialog';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebaseconfig/firebase';

const SpinnerGame = () => {
    const [items, setItems] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [profileMap, setProfileMap] = useState(new Map());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfilesFromFirebase = async () => {
            try {
                const profilesCollection = collection(db, 'profiles');
                const profileSnapshot = await getDocs(profilesCollection);
                const fetchedProfiles = profileSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Get 9 random profiles
                const getRandomProfiles = (profiles, num) => {
                    const shuffled = profiles.sort(() => 0.5 - Math.random());
                    return shuffled.slice(0, num);
                };

                const selectedProfiles = getRandomProfiles(fetchedProfiles, 9);

                const profileMap = new Map(selectedProfiles.map(profile => {
                    const profileName = profile.name ? profile.name.trim().toLowerCase() : 'unnamed';
                    return [profileName, profile];
                }));

                const profileNames = selectedProfiles.map(profile => profile.name ? profile.name.trim().toLowerCase() : 'unnamed');

                setProfiles(selectedProfiles);
                setItems(profileNames);
                setProfileMap(profileMap);
            } catch (error) {
                console.error('Error fetching profiles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfilesFromFirebase();
    }, []);

    const handleSpinComplete = (rotationAngle) => {
        const numberOfSegments = items.length;
        const normalizedRotation = rotationAngle % 360;
        const itemAngle = 360 / numberOfSegments;
        const selectedIndex = Math.floor((normalizedRotation + itemAngle / 2) / itemAngle) % numberOfSegments;

        console.log(`Rotation angle: ${rotationAngle}`);
        console.log(`Normalized rotation: ${normalizedRotation}`);
        console.log(`Item angle: ${itemAngle}`);
        console.log(`Selected index: ${selectedIndex}`);

        const selectedItemName = items[selectedIndex].trim().toLowerCase();
        console.log(`Selected item name from wheel: ${selectedItemName}`);

        const profile = profileMap.get(selectedItemName);
        console.log('Profile from Map:', profile);

        if (profile) {
            setSelectedProfile(profile);
        } else {
            console.error(`Profile not found for name: ${selectedItemName}`);
        }
    };

    const handleCloseDialog = () => {
        if (selectedProfile) {
            navigate(`/search?q=${encodeURIComponent(selectedProfile.name)}`);
        }
        setSelectedProfile(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center  gradient-background2 px-4">
            <div className="text-center w-full max-w-screen-sm mt-4">
                <h2 className="animate-bounce mt-14 text-2xl font-serif md:text-4xl  font-bold text-gray-400  md:mt-2 lg:mt-2 xl:mt-2">
                    Spin the wheel to find a friend who needs you today
                </h2>
                <p className='mt-4 text-gray-500 text-xs p-8 shadow-[0_0_10px_purple]   rounded-2xl'>
                    Click on the wheel
                </p>
            </div>

            {items.length > 0 ? (
                <Wheel items={items} onSpinComplete={handleSpinComplete} />
            ) : (
                <div>No items available</div>
            )}
            {selectedProfile && (
                <UserDialog user={selectedProfile} onClose={handleCloseDialog} />
            )}
        </div>
    );
}


export default SpinnerGame;
