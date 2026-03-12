const usermodel = require("../models/usermodule");
const foodmodule = require("../models/foodmodule");
const adminmodule = require("../models/adminmodule");
const ordermodule = require("../models/ordermodule");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await usermodel.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcryptjs.hash(password, 10);
    const user = await usermodel.create({
      fullname,
      email,
      password: hashed,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token);

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("registerUser error", error);
    return res.status(500).json({
      message: "Server error 1",
      error: error.message,
    });
  }
}

async function userlogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const match = await bcryptjs.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);
    return res.status(200).json({
      message: "Login successfully",
      token,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("userlogin error", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function userprofile(req, res) {
  try {
    const userid = req.user.id;
    const user = await usermodel.findById(userid).select("-password");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("userprofile error", error);
    return res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
}

async function foodcard(req, res) {
  try {
    const Food = await foodmodule.find({ isPopular: true });
    return res.status(200).json(Food);
  } catch (error) {
    console.error("foodcard error", error);
    return res.status(500).json({
      message: "some error occurred",
      error: error.message,
    });
  }
}

async function addfood(req, res) {
  try {
    const food = await foodmodule.create(req.body);
    return res.status(201).json({
      message: "food saved successfully",
      food,
    });
  } catch (error) {
    console.error("addfood error", error);
    return res.status(500).json({
      message: "some error occurred",
      error: error.message,
    });
  }
}

async function allfood(req, res) {
  try {
    const food = await foodmodule.find();
    return res.status(200).json(food);
  } catch (error) {
    console.error("allfood error", error);
    return res.status(500).json({
      message: "some error occurred",
      error: error.message,
    });
  }
}

async function adminlogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const admin = await adminmodule.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const match = await bcryptjs.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    return res.status(200).json({
      success: true,
      adminid: admin._id,
    });
  } catch (error) {
    console.error("adminlogin error", error);
    return res.status(500).json({
      message: "some error occurred",
      error: error.message,
    });
  }
}

async function adminreg(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const admin = await adminmodule.create({ email, password });
    return res.status(201).json({
      message: "Admin registered successfully",
      adminId: admin._id,
    });
  } catch (error) {
    console.error("adminreg error", error);
    return res.status(500).json({
      message: "some error occurred",
      error: error.message,
    });
  }
}

async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const { items, deliveryInfo, paymentMethod, total } = req.body;
    if (!items || !deliveryInfo || !total) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const order = await ordermodule.create({
      userId,
      items,
      deliveryInfo,
      paymentMethod,
      total,
      status: "pending",
    });
    return res.status(201).json({
      message: "Order placed successfully",
      order: {
        _id: order._id,
        items: order.items,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("createOrder error", error);
    return res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
}

async function getUserOrders(req, res) {
  try {
    const userId = req.user.id;
    const orders = await ordermodule
      .find({ userId })
      .populate("userId")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Orders fetched successfully",
      orders: orders || [],
    });
  } catch (error) {
    console.error("getUserOrders error", error);
    return res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
}

module.exports = {
  registerUser,
  userlogin,
  userprofile,
  foodcard,
  addfood,
  allfood,
  adminlogin,
  adminreg,
  createOrder,
  getUserOrders,
};

