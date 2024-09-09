import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://gourmet-slice.onrender.com/sign-up",
        formData
      );
      setMessage(res.data.msg);
      if (res.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      if (err.response) {
        setMessage("Error: " + err.response.data.msg);
      } else {
        setMessage("Error: Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-white">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
          <FaUser className="inline-block mr-2" />
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <FaUser className="ml-3 text-gray-400" />
              <input
                type="text"
                className="flex-grow p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <FaEnvelope className="ml-3 text-gray-400" />
              <input
                type="email"
                className="flex-grow p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
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
                className="flex-grow p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
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
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>
        {message && <p className="mt-3 text-red-600 text-center">{message}</p>}
        <p className="mt-4 text-center text-gray-600">
          <Link to="/admin-sign-up" className="text-blue-600 hover:underline">
            Admin Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
