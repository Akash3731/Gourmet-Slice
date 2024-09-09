import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { FaUser, FaLock } from "react-icons/fa";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting admin login with data:", formData);
    if (!formData.email.endsWith("@admins.gourmetslice.in")) {
      setMessage(
        "Only @admins.gourmetslice.in email addresses are allowed for admin users."
      );
      return;
    }
    try {
      const res = await axios.post(
        "https://gourmet-slice.onrender.com/admin-login",
        formData
      );
      setMessage(res.data.msg);
      const token = res.data.token;
      console.log("Token received:", token);
      login(token); // Set the token in AuthContext

      if (formData.email.endsWith("@admins.gourmetslice.in")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      if (err.response) {
        console.log("Error response:", err.response);
        if (err.response.data.msg === "Invalid credentials") {
          setMessage(
            "Invalid credentials, please check your email and password."
          );
        } else {
          setMessage("Error: " + err.response.data.msg);
        }
      } else {
        setMessage("Error: Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h2 className="text-center text-2xl font-bold mb-6 text-red-600">
          <FaUser className="inline-block mr-2" />
          Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <FaUser className="ml-3 text-gray-400" />
              <input
                type="email"
                className="flex-grow p-2 rounded-md focus:outline-none focus:ring focus:ring-red-300"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <FaLock className="ml-3 text-gray-400" />
              <input
                type="password"
                className="flex-grow p-2 rounded-md focus:outline-none focus:ring focus:ring-red-300"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-200"
          >
            Login
          </button>
        </form>
        {message && <p className="mt-3 text-red-600 text-center">{message}</p>}
      </div>
    </div>
  );
}

export default AdminLogin;
