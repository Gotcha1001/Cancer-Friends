import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseconfig/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const clickSoundRef = useRef(null);
    const navigate = useNavigate();
    const adminEmail = "admin@example.com";
    const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
    const adminDropdownRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        clickSoundRef.current = new Audio("/Put.mp3");

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const playClickSound = () => {
        clickSoundRef.current.play();
    };

    const logout = async () => {
        try {
            await signOut(auth);
            navigate("/"); // Redirect to the home page after logout
        } catch (error) {
            console.error(error);
        }
    };

    const toggleAdminDropdown = () => {
        setIsAdminDropdownOpen(!isAdminDropdownOpen);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        playClickSound();
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        setSearchTerm(''); // Clear the search input after navigating
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
                setIsAdminDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar bg-gray-800 text-white py-4">
            <div className="container mx-auto flex flex-col md:flex-row md:justify-between items-center">
                <div className="flex items-center md:flex-none mt-2">
                    <Link to="/" className="zoom mr-14" onClick={playClickSound}>
                        <img
                            src="/CancerNav.png"
                            alt="Logo"
                            className="second-navbar-logo  rounded-md m-3 mr-7 w-33 md:w-32 lg:w-48 xl:w-56 h-auto md:h-10 lg:h-12 xl:h-16" // This applies specific styles for smaller screens
                        />
                    </Link>
                </div>

                <div className="md:flex-grow flex flex-col md:flex-row md:justify-between items-center md:items-stretch md:ml-4">
                    {user && (
                        <form onSubmit={handleSearch} className="flex items-center ml-12 mt-8 md:mb-0">
                            <input
                                type="text"
                                placeholder="Search profiles by name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-black rounded-l-md px-4 py-2 focus:outline-none"
                            />
                            <button type="submit" className="bg-gray-600 rounded-r-md px-4 py-2 hover:bg-gray-500">
                                Search
                            </button>
                        </form>
                    )}



                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
                        {user && (
                            <>
                                {user.email === adminEmail && (
                                    <div className="relative navbar-element" ref={adminDropdownRef}>
                                        <button onClick={toggleAdminDropdown} className="bg-black rounded-md p-2  hover:text-blue-500">
                                            Admin Actions
                                        </button>
                                        {isAdminDropdownOpen && (
                                            <ul className="absolute bg-gray-800 text-white rounded mt-2 shadow-lg" onMouseEnter={() => setIsAdminDropdownOpen(true)} onMouseLeave={() => setIsAdminDropdownOpen(false)}>
                                                <li className="navbar-element">
                                                    <NavLink
                                                        to="video-upload"
                                                        className={({ isActive }) =>
                                                            isActive ? "active-link text-white block px-4 py-2" : "text-white block px-4 py-2"
                                                        }
                                                        onClick={playClickSound}
                                                    >
                                                        Video Upload
                                                    </NavLink>
                                                </li>
                                                <li className="navbar-element">
                                                    <NavLink
                                                        to="video-alter"
                                                        className={({ isActive }) =>
                                                            isActive ? "active-link text-white block px-4 py-2" : "text-white block px-4 py-2"
                                                        }
                                                        onClick={playClickSound}
                                                    >
                                                        Video Alter
                                                    </NavLink>
                                                </li>
                                                <li className="navbar-element">
                                                    <NavLink
                                                        to="inspire"
                                                        className={({ isActive }) =>
                                                            isActive ? "active-link text-white block px-4 py-2" : "text-white block px-4 py-2"
                                                        }
                                                        onClick={playClickSound}
                                                    >
                                                        Inspire Upload
                                                    </NavLink>
                                                </li>
                                                <li className="navbar-element">
                                                    <NavLink
                                                        to="inspire-alter"
                                                        className={({ isActive }) =>
                                                            isActive ? "active-link text-white block px-4 py-2" : "text-white block px-4 py-2"
                                                        }
                                                        onClick={playClickSound}
                                                    >
                                                        Inspire Alter
                                                    </NavLink>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                )}
                                <div className="navbar-element">
                                    <NavLink
                                        to="inspire-display"
                                        className={({ isActive }) =>
                                            isActive ? "active-link text-white hover:text-blue-500" : "text-white hover:text-blue-500"
                                        }
                                        onClick={playClickSound}
                                    >
                                        Inspire
                                    </NavLink>
                                </div>
                                <div className="navbar-element ">
                                    <NavLink
                                        to="videos"
                                        className={({ isActive }) =>
                                            isActive ? "active-link text-white hover:text-blue-500" : "text-white hover:text-blue-500"
                                        }
                                        onClick={playClickSound}
                                    >
                                        Videos
                                    </NavLink>
                                </div>
                                <div className="navbar-element ">
                                    <NavLink
                                        to="profile"
                                        className={({ isActive }) =>
                                            isActive ? "active-link text-white hover:text-blue-500" : "text-white hover:text-blue-500"
                                        }
                                        onClick={playClickSound}
                                    >
                                        Profile
                                    </NavLink>
                                </div>
                                <div className="navbar-element-welcome">
                                    <span className="text-white bg-teal-600  rounded-md hover:bg-black p-2 mb-3 md:mb-0 md:mr-2 sm:mr-4">{`Welcome, ${user.email}`}</span>
                                </div>

                                <div className="navbar-element">
                                    <button onClick={logout} className="text-white hover:text-blue-500">
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                        {!user && (
                            <>
                                <div className="navbar-element">
                                    <NavLink
                                        to="register"
                                        onClick={playClickSound}
                                        className="text-white hover:text-blue-500"
                                    >
                                        Register
                                    </NavLink>
                                </div>
                                <div className="navbar-element">
                                    <NavLink
                                        to="login"
                                        onClick={playClickSound}
                                        className="text-white hover:text-blue-500"
                                    >
                                        Login
                                    </NavLink>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
