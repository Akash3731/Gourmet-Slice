import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import NavigationBar from "./Navbar";
import {
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaUtensils,
  FaFilter,
  FaLeaf, // Veg icon
  FaDrumstickBite, // Non-Veg icon
  FaCoffee, // Beverage icon
} from "react-icons/fa";

// Spinner Component
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="w-16 h-16 border-b-4 border-blue-600 rounded-full animate-spin"></div>
  </div>
);

const OrderFood = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [quantities, setQuantities] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const res = await axios.get(
          "https://gourmet-slice.onrender.com/api/products"
        );
        setFoodItems(res.data);
        const initialQuantities = {};
        res.data.forEach((item) => {
          initialQuantities[item._id] = 0;
        });
        setQuantities(initialQuantities);
        setLoading(false); // Stop loading once the data is fetched
      } catch (err) {
        console.error("Error fetching food items:", err);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchFoodItems();
  }, []);

  const handleOrder = (item) => {
    const quantity = quantities[item._id];
    if (!isLoggedIn) {
      showToastMessage("You are not logged in. Please log in first.");
      return;
    }
    if (quantity > 0) {
      addToCart(item, quantity);
      setQuantities({ ...quantities, [item._id]: 0 });
    } else {
      showToastMessage(`Please select a quantity for ${item.name}`);
    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const filteredItems = foodItems.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  const increaseQuantity = (itemId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: prevQuantities[itemId] + 1,
    }));
  };

  const decreaseQuantity = (itemId) => {
    setQuantities((prevQuantities) => {
      const newQuantity = Math.max(0, prevQuantities[itemId] - 1);
      return { ...prevQuantities, [itemId]: newQuantity };
    });
  };

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <>
      <NavigationBar />
      <div className=" min-h-screen py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-6 text-4xl font-bold text-custBlack bg-white p-4 rounded-md">
            Menu
          </h2>

          <div className="flex flex-col md:flex-row">
            {/* Category Filter Section */}
            <div className="mb-6 md:w-1/4 md:mr-6" ref={dropdownRef}>
              <div className="flex items-center mb-2">
                <FaFilter className="text-gray-600 mr-2" />
                <h3 className="font-semibold text-lg">Filter by category:</h3>
              </div>
              <div className="relative">
                <button
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-left hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                >
                  {selectedCategory}
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    {isDropdownOpen ? "▲" : "▼"}
                  </span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md -lg">
                    {["All", "Veg", "Non-Veg", "Beverage"].map((category) => (
                      <button
                        key={category}
                        className={`w-full text-left p-2 hover:bg-blue-100 transition duration-200 ${
                          selectedCategory === category ? "font-bold" : ""
                        }`}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Food Items Section */}
            <div className="flex-grow">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                  <Spinner />
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div
                      className="bg-white rounded-lg transition-all hover:scale-105 hover:shadow-xl duration-500 p-4 flex flex-col"
                      key={item._id}
                    >
                      <img
                        src={`https://gourmet-slice.onrender.com/${item.image}`} // Updated line for image source
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-md mb-4 border border-gray-300"
                      />
                      <h5 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition duration-200 flex items-center">
                        {item.category === "Veg" ? (
                          <FaLeaf className="mr-2 text-green-500" />
                        ) : item.category === "Non-Veg" ? (
                          <FaDrumstickBite className="mr-2 text-red-500" />
                        ) : item.category === "Beverage" ? (
                          <FaCoffee className="mr-2 text-brown-500" />
                        ) : null}
                        {item.name}
                      </h5>
                      <p className="text-gray-600 mb-2">{item.description}</p>
                      <p className="text-lg font-bold text-gray-800 mb-4">
                        &#8377;{item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center mb-4">
                        <button
                          className="bg-gray-200 rounded-full p-2 mr-2 hover:bg-gray-300 transition duration-200"
                          onClick={() => decreaseQuantity(item._id)}
                        >
                          <FaMinus className="text-gray-600" />
                        </button>
                        <span className="mx-2 text-lg font-semibold">
                          {quantities[item._id]}
                        </span>
                        <button
                          className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition duration-200"
                          onClick={() => increaseQuantity(item._id)}
                        >
                          <FaPlus className="text-gray-600" />
                        </button>
                      </div>
                      <button
                        className="bg-blue-600 text-white rounded-md w-full py-2 mt-2 hover:bg-blue-700 transition duration-200 shadow-lg transform hover:scale-105 flex items-center justify-center"
                        onClick={() => handleOrder(item)}
                      >
                        <FaShoppingCart className="mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  ))
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
          </div>

          {/* Toast Notification */}
          {showToast && (
            <div className="fixed bottom-4 right-4 bg-blue-600 text-white py-2 px-4 rounded-md shadow-lg">
              {toastMessage}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderFood;
