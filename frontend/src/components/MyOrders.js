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
    // Check if user is logged in
    if (!user || !user.token) {
      navigate("/"); // Redirect to home page if not logged in
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

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <NavigationBar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <p>You have no orders placed yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
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
                  <td>${order.total.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default MyOrders;
