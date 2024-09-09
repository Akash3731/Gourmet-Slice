import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaProductHunt,
  FaSignOutAlt,
  FaUserShield,
  FaEdit,
  FaShoppingCart,
  FaListUl,
  FaLeaf,
  FaDrumstickBite,
  FaCoffee,
} from "react-icons/fa";

const Admin = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Veg",
    image: null,
  });
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [orders, setOrders] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin-login");
    } else {
      fetchProducts();
      fetchUsersAndOrders();
    }
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://gourmet-slice.onrender.com/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchUsersAndOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const usersResponse = await axios.get("https://gourmet-slice.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersResponse = await axios.get(
        "https://gourmet-slice.onrender.com/api/orders/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Users:', usersResponse.data); // Logging users data
      console.log('Orders:', ordersResponse.data); // Logging orders data

      setUsers(usersResponse.data);
      setOrders(ordersResponse.data);
    } catch (error) {
      console.error("Error fetching users or orders:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("image", formData.image);

    try {
      const url = editingProductId
        ? `https://gourmet-slice.onrender.com/api/products/${editingProductId}`
        : "https://gourmet-slice.onrender.com/api/products";

      const method = editingProductId ? "put" : "post";

      const res = await axios[method](url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(res.data.msg);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "Veg",
        image: null,
      });
      setEditingProductId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.msg || err.message || "An unknown error occurred";
      setMessage("Error adding/updating product: " + errorMessage);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: null,
    });
    setEditingProductId(product._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`https://gourmet-slice.onrender.com/api/products/${id}`);
        setMessage("Product deleted successfully!");
        fetchProducts();
      } catch (err) {
        setMessage("Error deleting product: " + err.response.data.msg);
      }
    }
  };

  const toggleUserOrders = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center">
        <FaUserShield className="mr-2" /> Admin Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white shadow-md rounded-md"
        >
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <FaProductHunt className="mr-2" />
            {editingProductId ? "Edit Product" : "Add Product"}
          </h3>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="number"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              autoComplete="off"
            >
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="Beverage">Beverage</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Product Image
            </label>
            <input
              type="file"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              id="image"
              name="image"
              onChange={handleChange}
              accept="image/*"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 flex items-center justify-center"
          >
            <FaProductHunt className="mr-2" />{" "}
            {editingProductId ? "Update Product" : "Add Product"}
          </button>
          {message && (
            <p className="bg-yellow-100 text-yellow-700 p-4 rounded-md mt-4">
              {message}
            </p>
          )}
        </form>

        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <FaListUl className="mr-2" />
            Products
          </h3>
          <ul>
            {products.map((product) => (
              <li
                key={product._id}
                className="border p-2 mb-2 flex justify-between items-center"
              >
                <span>{product.name}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-500 text-white py-1 px-2 rounded-md shadow-sm hover:bg-blue-700 flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white py-1 px-2 rounded-md shadow-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4 flex items-center">
        <FaUser className="mr-2" />
        Users & Orders
      </h3>

      {loadingUsers ? (
        <p>Loading users and orders...</p>
      ) : (
        users.map((user) => (
          <div key={user._id} className="border p-2 mb-2">
            <div
              className="cursor-pointer"
              onClick={() => toggleUserOrders(user._id)}
            >
              <p className="font-bold">{user.name}</p>
              <p>{user.email}</p>
              <p>{user.isAdmin ? "Admin" : "Customer"}</p>
            </div>

            {expandedUser === user._id && (
              <div className="pl-4">
                <h4 className="text-lg font-bold mt-2">Orders:</h4>
                {orders
                  .filter((order) => order?.user?._id === user._id)
                  .map((order) => (
                    <div key={order._id} className="border p-2 mb-2">
                      <p>Order ID: {order._id}</p>
                      <p>Status: {order.status}</p>
                      <p>Total: ${order.total.toFixed(2)}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))
      )}

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-700 mt-8 flex items-center justify-center"
      >
        <FaSignOutAlt className="mr-2" /> Logout
      </button>
    </div>
  );
};

export default Admin;
