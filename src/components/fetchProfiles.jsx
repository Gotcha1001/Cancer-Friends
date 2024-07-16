import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../firebaseconfig/firebase'; // Adjust the import path as necessary

const fetchProfiles = async (searchTerm) => {
    try {
        const normalizedSearchTerm = searchTerm.trim().toLowerCase(); // Normalize search term to lowercase

        // Query profiles where name_lowercase matches the normalized search term
        const q = query(
            collection(db, "profiles"),
            where("name_lowercase", ">=", normalizedSearchTerm),
            where("name_lowercase", "<=", normalizedSearchTerm + '\uf8ff')
        );

        const querySnapshot = await getDocs(q);
        const profiles = [];

        querySnapshot.forEach((doc) => {
            profiles.push({ id: doc.id, ...doc.data() });
        });

        return profiles;
    } catch (error) {
        console.error("Error searching profiles: ", error);
        throw error;
    }
};

export default fetchProfiles;
