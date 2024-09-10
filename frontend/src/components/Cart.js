import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import NavigationBar from "./Navbar";
import { FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";

const Cart = () => {
  const { isLoggedIn } = useAuth();
  const { cart, removeFromCart, reduceQuantity, increaseQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = 5.0;
  const totalPrice = subtotal + deliveryFee;

  if (!isLoggedIn) {
    return (
      <>
        <NavigationBar />
        <div className="bg-gray-100 min-h-screen py-10">
          <div className="container mx-auto px-4 mt-5">
            <h2 className="text-center mb-4 text-4xl font-bold text-gray-800">
              Your Cart
            </h2>
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg text-center">
              You are not logged in. Please log in first.
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavigationBar />
      <div className="bg-custWhite min-h-screen py-10">
        <div className="container mx-auto px-4 mt-5">
          <h2 className="text-center mb-4 text-4xl font-bold text-gray-800">
            <FaShoppingCart className="inline-block mr-2 text-blue-600" />
            Your Cart
          </h2>
          {cart.length > 0 ? (
            <>
              {/* Cart Details Section */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-2 text-left">Image</th>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Description</th>
                      <th className="p-2 text-left">Price</th>
                      <th className="p-2 text-left">Quantity</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item._id} className="border-b border-gray-200">
                        <td className="p-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-auto rounded"
                          />
                        </td>
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">{item.description}</td>
                        <td className="p-2">&#8377;{item.price.toFixed(2)}</td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <button
                              className="bg-gray-200 rounded-full p-2 mr-2 hover:bg-gray-300 transition duration-200"
                              onClick={() => reduceQuantity(item._id)}
                            >
                              <FaMinus className="text-gray-600" />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              className="bg-gray-200 rounded-full p-2 ml-2 hover:bg-gray-300 transition duration-200"
                              onClick={() => increaseQuantity(item._id)}
                            >
                              <FaPlus className="text-gray-600" />
                            </button>
                          </div>
                        </td>
                        <td className="p-2">
                          <button
                            className="bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 py-1 px-2 text-sm"
                            onClick={() => removeFromCart(item._id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Summary Section */}
              <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                <h4 className="text-2xl font-bold text-center mb-4">
                  Order Summary
                </h4>
                <div className="flex justify-between py-2 border-b border-gray-300">
                  <span className="font-semibold">Subtotal:</span>
                  <span>&#8377;{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-300">
                  <span className="font-semibold">Delivery Fee:</span>
                  <span>&#8377;{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-lg">
                  <span>Total:</span>
                  <span>&#8377;{totalPrice.toFixed(2)}</span>
                </div>
                <div className="text-center mt-4">
                  <button
                    className="bg-blue-600 text-white rounded-md mt-4 py-2 px-6 hover:bg-blue-700 transition duration-200"
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-lg text-gray-600">
              Your cart is empty.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
