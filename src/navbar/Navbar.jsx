
import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseconfig/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu visibility
  const clickSoundRef = useRef(null);
  const navigate = useNavigate();
  const adminEmail = "admin@example.com";
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const adminDropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

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
    setSearchTerm(""); // Clear the search input after navigating
  };

  const handleMenuToggle = () => {
    console.log("Before toggle:", isMenuOpen);
    setIsMenuOpen((prev) => !prev);
    console.log("After toggle:", !isMenuOpen);
  };


  const closeMenu = () => {
    setIsMenuOpen(false); // Close the menu
  };

  const handleLinkClick = () => {
    playClickSound();
    closeMenu(); // Collapse the menu after a link is clicked
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(event.target)
      ) {
        setIsAdminDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar bg-gray-800 py-4 text-white">
      <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
        <div className="mt-2 flex w-full items-center justify-between md:mt-0 md:w-auto">
          <Link to="/" className="zoom mr-0 md:mr-14" onClick={handleLinkClick}>
            <img
              src="/CancerNav.png"
              alt="Logo"
              className="second-navbar-logo m-3 h-auto w-28 rounded-md md:w-32 lg:w-48 xl:w-56"
            />
          </Link>
          {/* Hamburger Icon */}
          <button
            className="block md:hidden text-white"
            onClick={handleMenuToggle}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Navbar Links */}
        <div
          className={`absolute top-full left-0 w-full bg-indigo-800 md:relative md:flex md:w-auto md:bg-transparent ${isMenuOpen ? "block" : "hidden"}`}
        >
          <div className="flex flex-col items-center md:items-stretch md:flex-row md:flex-wrap">
            {user && (
              <div className="mt-8 flex w-full items-center justify-center md:mb-0 md:ml-12 md:w-auto md:justify-start md:mr-20">
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search profiles by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-l-md bg-black px-4 py-2 focus:outline-none shadow-neon"
                    style={{ marginRight: 0 }} // Adjusted margin-right
                  />
                  <button
                    type="submit"
                    onClick={handleLinkClick}
                    className="rounded-r-md bg-gray-600 px-4 py-2 hover:bg-gray-500"
                  >
                    Search
                  </button>
                </form>
              </div>
            )}

            <div className="mt-4 flex flex-col items-center space-y-2 md:mt-0 md:flex-row md:space-x-4 md:space-y-0">
              {user && (
                <>
                  {user.email === adminEmail && (
                    <div
                      className="navbar-element relative"
                      ref={adminDropdownRef}
                    >
                      <button
                        onClick={toggleAdminDropdown}
                        className="rounded-md bg-black p-1 hover:text-blue-500 shadow-neon"
                      >
                        Admin
                      </button>
                      {isAdminDropdownOpen && (
                        <ul
                          className="absolute mt-2 rounded bg-gray-800 text-white shadow-lg"
                          onMouseEnter={() => setIsAdminDropdownOpen(true)}
                          onMouseLeave={() => setIsAdminDropdownOpen(false)}
                        >
                          <li className="navbar-element">
                            <NavLink
                              to="video-upload"
                              className={({ isActive }) =>
                                isActive
                                  ? "active-link block px-4 py-2 text-white"
                                  : "block px-4 py-2 text-white"
                              }
                              onClick={handleLinkClick}
                            >
                              Video Upload
                            </NavLink>
                          </li>
                          <li className="navbar-element">
                            <NavLink
                              to="video-alter"
                              className={({ isActive }) =>
                                isActive
                                  ? "active-link block px-4 py-2 text-white"
                                  : "block px-4 py-2 text-white"
                              }
                              onClick={handleLinkClick}
                            >
                              Video Alter
                            </NavLink>
                          </li>
                          <li className="navbar-element">
                            <NavLink
                              to="inspire"
                              className={({ isActive }) =>
                                isActive
                                  ? "active-link block px-4 py-2 text-white"
                                  : "block px-4 py-2 text-white"
                              }
                              onClick={handleLinkClick}
                            >
                              Inspire Upload
                            </NavLink>
                          </li>
                          <li className="navbar-element">
                            <NavLink
                              to="inspire-alter"
                              className={({ isActive }) =>
                                isActive
                                  ? "active-link block px-4 py-2 text-white"
                                  : "block px-4 py-2 text-white"
                              }
                              onClick={handleLinkClick}
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
                      to="feed"
                      className={({ isActive }) =>
                        isActive
                          ? "active-link text-white hover:text-blue-500"
                          : "text-white hover:text-blue-500"
                      }
                      onClick={handleLinkClick}
                    >
                      Feed
                    </NavLink>
                  </div>
                  <div className="navbar-element">
                    <NavLink
                      to="inspire-display"
                      className={({ isActive }) =>
                        isActive
                          ? "active-link text-white hover:text-blue-500"
                          : "text-white hover:text-blue-500"
                      }
                      onClick={handleLinkClick}
                    >
                      Inspire
                    </NavLink>
                  </div>
                  <div className="navbar-element">
                    <NavLink
                      to="videos"
                      className={({ isActive }) =>
                        isActive
                          ? "active-link text-white hover:text-blue-500"
                          : "text-white hover:text-blue-500"
                      }
                      onClick={handleLinkClick}
                    >
                      Videos
                    </NavLink>
                  </div>
                  <div className="navbar-element">
                    <NavLink
                      to="profile"
                      className={({ isActive }) =>
                        isActive
                          ? "active-link text-white hover:text-blue-500"
                          : "text-white hover:text-blue-500"
                      }
                      onClick={handleLinkClick}
                    >
                      Profile
                    </NavLink>
                  </div>
                  <div className="navbar-element">
                    <NavLink
                      to="private-diary"
                      className={({ isActive }) =>
                        isActive
                          ? "active-link text-white hover:text-blue-500"
                          : "text-white hover:text-blue-500"
                      }
                      onClick={handleLinkClick}
                    >
                      Diary
                    </NavLink>
                  </div>

                  <div className="navbar-element">
                    <NavLink
                      to="nav-messages"
                      className={({ isActive }) =>
                        isActive
                          ? "active-link text-white hover:text-blue-500"
                          : "text-white hover:text-blue-500"
                      }
                      onClick={handleLinkClick}
                    >
                      Messages
                    </NavLink>
                  </div>

                  <div className="navbar-element">
                    <NavLink
                      to="spinner"
                      className={({ isActive }) =>
                        isActive
                          ? "active-link text-white hover:text-blue-500"
                          : "text-white hover:text-blue-500"
                      }
                      onClick={handleLinkClick}
                    >
                      Game
                    </NavLink>
                  </div>
                  <div className="navbar-element-welcome">
                    <span className="mb-3 rounded-md bg-teal-600 p-2 text-white hover:bg-black sm:mr-2 sm:mb-4">
                      {`Welcome, ${user.email}`}
                    </span>
                  </div>


                  <button
                    onClick={logout}
                    className="navbar-element mt-3 bg-indigo-900 mb-2 text-white px-1 py-1 rounded-md hover:bg-purple-500"
                  >
                    Logout
                  </button>
                </>
              )}
              {!user && (
                <>
                  <div className="navbar-element">
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        isActive
                          ? "active-link text-white hover:text-blue-500"
                          : "text-white hover:text-blue-500"
                      }
                      onClick={handleLinkClick}
                    >
                      Login
                    </NavLink>
                  </div>
                  <div className="navbar-element">
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        isActive
                          ? "active-link text-white hover:text-blue-500"
                          : "text-white hover:text-blue-500"
                      }
                      onClick={handleLinkClick}
                    >
                      Register
                    </NavLink>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


