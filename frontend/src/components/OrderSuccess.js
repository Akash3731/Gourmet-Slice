import React from "react";
import NavigationBar from "./Navbar";
import { useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const { order } = location.state || {};

  return (
    <>
      <NavigationBar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-custWhite p-4">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-700 mb-6">
            Thank you for your order! Your delicious meal is on its way.
          </p>

          {order && (
            <div className="text-left">
              <h4 className="text-lg font-medium text-gray-800 mb-3">
                Your Order Summary
              </h4>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <li
                    className="py-2 flex justify-between items-center"
                    key={index}
                  >
                    <span>{item.product.name}</span>
                    <span className="font-medium">x {item.quantity}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-gray-800">
                <span className="font-semibold">Total Amount:</span> &#8377;
                {order.total}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Delivery Address:</span>{" "}
                {order.address}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Payment Method:</span>{" "}
                {order.paymentMethod}
              </p>
            </div>
          )}

          <button
            className="mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
            onClick={() => (window.location.href = "/")}
          >
            Go to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
