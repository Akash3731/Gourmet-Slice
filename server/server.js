const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Admin = require("./models/Admin");
const Order = require("./models/Orders");
const Product = require("./models/Product");
const verifyToken = require("./authMiddleware");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Sign up to register the user
app.post("/sign-up", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create new user
    user = new User({ name, email, password });
    await user.save();

    // Create JWT token without profile image
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .status(201)
      .json({ msg: "User registered successfully", token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Admin sign-up route
app.post("/admin-sign-up", async (req, res) => {
  const { email, password } = req.body;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@admins\.gourmetslice\.in$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: "Invalid email format for admin" });
  }

  try {
    // Check if admin exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ msg: "Admin already exists" });
    }

    // Create new admin
    admin = new Admin({ email, password });
    await admin.save();

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ msg: "Admin registered successfully", token });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Login route for user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create JWT token without profile image
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ msg: "Login successful", token, name: user.name });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Your existing route for profile image upload
app.put(
  "/api/user/profile-image",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const imagePath = req.file.path;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { image: imagePath },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ msg: "User not found" });
      }

      const token = jwt.sign(
        {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          profileImage: updatedUser.image,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        msg: "Profile image updated successfully",
        image: imagePath,
        token,
      });
    } catch (error) {
      console.error("Error updating profile image:", error);
      res
        .status(500)
        .json({ msg: "Error updating profile image", error: error.message });
    }
  }
);

// Admin login route
app.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  // Check if the email is from the correct domain
  const domain = "@admins.gourmetslice.in";
  if (!email.endsWith(domain)) {
    return res
      .status(403)
      .json({ msg: `Access denied. Only ${domain} emails are allowed.` });
  }

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log("Admin not found");
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Compare the password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      console.log("Invalid password");
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Generate a token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ msg: "Login successful", token });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Route for adding products with image upload
app.post("/api/products", upload.single("image"), async (req, res) => {
  const { name, description, price, category } = req.body;
  const image = req.file.path; // Get the path of the uploaded image

  // Basic validation
  if (!name || !description || !price || !category || !image) {
    return res.status(400).json({ msg: "All fields are required." });
  }

  const newProduct = new Product({ name, description, price, category, image });

  try {
    await newProduct.save();
    res.status(201).json({ msg: "Product added successfully!" });
  } catch (err) {
    res.status(500).json({ msg: "Error adding product", error: err.message });
  }
});

//Profile image
app.get("/:userId/profile-image", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("image");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.image) {
      return res.status(404).json({ message: "Profile image not found" });
    }

    // Normalize the image path for the URL
    const imagePath = user.image.replace(/\\/g, "/"); // Replace backslashes with forward slashes

    res.json({ image: imagePath });
  } catch (error) {
    console.error("Error fetching profile image:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a product by ID
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ msg: "Product not found." });
    }

    res.status(200).json({ msg: "Product removed successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error removing product", error: error.message });
  }
});

// GET all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error fetching products", error: error.message });
  }
});

// Order creation
app.post("/api/orders", verifyToken, async (req, res) => {
  const { items, address, paymentMethod, total, status } = req.body;

  // Validate incoming data
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ msg: "Items are required." });
  }
  if (!address) {
    return res.status(400).json({ msg: "Address is required." });
  }
  if (!paymentMethod) {
    return res.status(400).json({ msg: "Payment method is required." });
  }
  if (total === undefined || total <= 0) {
    return res
      .status(400)
      .json({ msg: "Total amount is required and must be greater than 0." });
  }

  try {
    const newOrder = new Order({
      user: req.user.id,
      items,
      address,
      paymentMethod,
      total,
      status,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update product
app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const updatedData = { name, description, price, category };

    // Check if an image file was uploaded
    if (req.file) {
      updatedData.image = req.file.path; // Update the image path if a new file is uploaded
    }

    // Find the product by ID and update it
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true } // Add runValidators to ensure validation is enforced
    );

    // Check if the product was found and updated
    if (!updatedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res
      .status(200)
      .json({ msg: "Product updated successfully!", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Error adding/updating product: " + error.message });
  }
});

// Get orders for the logged-in user
app.get("/api/orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product") // Populate product details in each order
      .exec();

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all users (Admin route)
app.get("/api/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all orders (Admin route)
app.get("/api/orders/all", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product") // Populate product details in each order
      .populate("user") // Populate user details for each order
      .exec();

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Protected route
app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ msg: "This is a protected route", user: req.user });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
