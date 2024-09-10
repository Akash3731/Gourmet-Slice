import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useCart } from "../context/cartContext";
import { FaUserCircle } from "react-icons/fa"; // Import user icon
import axios from "axios"; // Make sure to install axios

const NavigationBar = () => {
  const { user, isLoggedIn, logout } = useContext(AuthContext); // Access user object
  const { cart } = useCart();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // State to hold profile image URL

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSignOut = () => {
    logout();
    setDropdownOpen(false);
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (isLoggedIn && user && user.id) {
        // Use '_id' for user ID
        try {
          console.log("User ID for profile image fetch:", user.id); // Log the user ID
          const response = await axios.get(
            `https://gourmet-slice.onrender.com/${user.id}/profile-image` // Corrected line
          );

          // Log the response for debugging
          console.log("Profile image fetch response:", response);

          // Check if the response has the expected structure
          if (response.data && response.data.image) {
            setProfileImage(response.data.image); // Update profileImage state
          } else {
            console.error("Unexpected response structure:", response.data);
          }
        } catch (error) {
          console.error(
            "Error fetching profile image:",
            error.response?.data || error.message
          );
        }
      } else {
        console.log("User is not logged in or user ID is undefined");
      }
    };

    fetchProfileImage();
  }, [isLoggedIn, user]);

  return (
    <div id="header" className="bg-custWhite sticky top-0 z-10">
      <div className="flex items-center justify-evenly text-custOrange py-7 font-bold ">
        <div className=" text-3xl font-bold transition-transform transform hover:scale-105">
          <Link to="/">Gourmet Slice</Link>
        </div>

        <ul className="hidden md:flex space-x-8">
          <li>
            <a
              className=" transition duration-200 hover:scale-105"
              href="#about"
            >
              About
            </a>
          </li>
          <li>
            <a
              className=" transition duration-200 hover:scale-105"
              href="#contact"
            >
              Contact
            </a>
          </li>
          {isLoggedIn && (
            <li>
              <Link
                className=" transition duration-200 hover:scale-105"
                to="/my-orders"
              >
                My Orders
              </Link>
            </li>
          )}
        </ul>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/cart"
                className=" transition duration-200 hover:scale-105"
              >
                Cart ({totalItems})
              </Link>
              <div className="relative">
                <button onClick={toggleDropdown} className="focus:outline-none">
                  {profileImage ? ( // Use the fetched profile image
                    <img
                      src={`https://gourmet-slice.onrender.com/${profileImage}`} // Update image source to include the base URL
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white"
                      onError={(e) => {
                        console.error(
                          "Error loading profile image:",
                          e.target.src
                        );
                        e.target.src = "https://via.placeholder.com/150"; // Valid fallback image URL
                      }}
                    />
                  ) : (
                    <FaUserCircle className=" w-10 h-10" />
                  )}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                    <Link
                      to="/profile" // Link to the profile page
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)} // Close the dropdown on click
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                className=" transition duration-200 hover:scale-105"
                to="/login"
              >
                Login
              </Link>
              <Link
                className=" transition duration-200 hover:scale-105"
                to="/sign-up"
              >
                Sign Up
              </Link>
              <Link
                to="/cart"
                className=" transition duration-200 hover:scale-105"
              >
                Cart ({totalItems})
              </Link>
            </>
          )}
        </div>
        {/* Responsive Hamburger Menu (optional, needs implementation) */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
