import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa"; // Import icons

function Login() {
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
    if (!formData.email.endsWith("@gmail.com")) {
      setMessage(
        "Only @gmail.com email addresses are allowed for regular users."
      );
      return;
    }
    try {
      const res = await axios.post(
        "https://gourmet-slice.onrender.com/login",
        formData
      );
      setMessage(res.data.msg);
      const token = res.data.token;
      login(token);
      navigate("/");
    } catch (err) {
      if (err.response) {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-white">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
          <FaUser className="inline-block mr-2" />
          Login
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
            Login
          </button>
        </form>
        {message && <p className="mt-3 text-red-600 text-center">{message}</p>}
        <p className="mt-3 text-center">
          <Link to="/admin-login" className="text-blue-600 hover:underline">
            Admin Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
