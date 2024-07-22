import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const playClickSound = () => {
    const clickSound = new Audio("/Put.mp3");
    clickSound.play();
  };

  return (
    <footer className="footer bg-gray-200 py-4">
      <div className="container mx-auto flex flex-col items-center justify-between space-y-4 sm:space-y-0 sm:flex-row sm:items-center">
        {/* Footer Links */}
        <ul className="footer-links flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 sm:justify-center">
          <li>
            <NavLink
              to="/data-protection"
              onClick={playClickSound}
              className={({ isActive }) =>
                isActive
                  ? "active-footer-link text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              }
            >
              Data Protection
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/foundations"
              onClick={playClickSound}
              className={({ isActive }) =>
                isActive
                  ? "active-footer-link text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              }
            >
              Cancer Foundations
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/child-cancer"
              onClick={playClickSound}
              className={({ isActive }) =>
                isActive
                  ? "active-footer-link text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              }
            >
              Child Cancer
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/research"
              onClick={playClickSound}
              className={({ isActive }) =>
                isActive
                  ? "active-footer-link text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              }
            >
              Research
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cancer-hospitals"
              onClick={playClickSound}
              className={({ isActive }) =>
                isActive
                  ? "active-footer-link text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              }
            >
              Cancer Hospitals
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/children-cancer-homes"
              onClick={playClickSound}
              className={({ isActive }) =>
                isActive
                  ? "active-footer-link text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              }
            >
              Cancer Homes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/resources"
              onClick={playClickSound}
              className={({ isActive }) =>
                isActive
                  ? "active-footer-link text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              }
            >
              Resources
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cancer-blogs"
              onClick={playClickSound}
              className={({ isActive }) =>
                isActive
                  ? "active-footer-link text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              }
            >
              Cancer Blogs
            </NavLink>
          </li>
        </ul>

        {/* Company Logo */}
        <div className="mt-4 flex items-center justify-center sm:mt-0 sm:ml-auto">
          <img
            src="https://images.pexels.com/photos/14464586/pexels-photo-14464586.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Cancer Logo"
            className="wobble1 h-12 rounded-full"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
