import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import NavigationBar from "./Navbar";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.token) {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "https://gourmet-slice.onrender.com/api/orders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders.");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) return <div className="text-center py-4">Loading orders...</div>;
  if (error)
    return <div className="text-center py-4 text-red-600">Error: {error}</div>;

  return (
    <>
      <NavigationBar />
      <div className="container mx-auto mt-8 p-4">
        <h2 className="text-2xl font-semibold text-center mb-6">My Orders</h2>
        {orders.length === 0 ? (
          <p className="text-center text-gray-700">
            You have no orders placed yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600">
                    Order ID
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600">Items</th>
                  <th className="px-4 py-2 text-left text-gray-600">Total</th>
                  <th className="px-4 py-2 text-left text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-200">
                    <td className="px-4 py-2 text-gray-800">{order._id}</td>
                    <td className="px-4 py-2 text-gray-800">
                      {order.items.map((item, index) => (
                        <div key={`${item.product?._id}-${index}`}>
                          {item.product ? (
                            <>
                              {item.quantity} x {item.product.name}
                            </>
                          ) : (
                            <span>Product not available</span>
                          )}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-2 text-gray-800">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-gray-800">{order.status}</td>
                    <td className="px-4 py-2 text-gray-800">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrders;
