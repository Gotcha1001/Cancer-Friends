import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
    const playClickSound = () => {
        const clickSound = new Audio("/Put.mp3");
        clickSound.play();
    };

    return (
        <footer className="footer bg-gray-200 py-4">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
                <ul className="footer-links flex flex-wrap sm:flex-row sm:justify-center">
                    <li className="mb-4 sm:mb-0">
                        <NavLink
                            to="/data-protection"
                            onClick={playClickSound}
                            className={({ isActive }) =>
                                isActive ? "active-footer-link text-gray-900 block" : "text-gray-700 hover:text-gray-900 block"
                            }
                        >
                            Data Protection
                        </NavLink>
                    </li>
                </ul>

                {/* Company Logo */}
                <div className="mt-4 sm:mt-0 sm:ml-auto flex items-center">
                    <img
                        src="https://images.pexels.com/photos/14464586/pexels-photo-14464586.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Josh's Art Logo"
                        className="h-12 rounded-full m-3 wobble1"
                    />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
