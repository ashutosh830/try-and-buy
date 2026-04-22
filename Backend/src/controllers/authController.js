const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Cart = require("../models/Cart");
const asyncHandler = require("../middleware/asyncHandler");
const ROLES = require("../constants/roles");
const { signToken } = require("../services/jwtService");
const AppError = require("../utils/appError");
const sanitizeUser = require("../utils/sanitizeUser");

const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    role = ROLES.USER,
    address = "",
    shopName = "",
    vehicleNumber = ""
  } = req.body;

  if (!name || !email || !password || !phone) {
    throw new AppError("Name, email, password, and phone are required", 400);
  }

  if (![ROLES.USER, ROLES.VENDOR, ROLES.RIDER].includes(role)) {
    throw new AppError("Invalid role selected", 400);
  }

  if (role === ROLES.VENDOR && !shopName) {
    throw new AppError("Shop name is required for vendors", 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    phone,
    role,
    address,
    shopName,
    vehicleNumber
  });

  if (role === ROLES.USER) {
    await Cart.create({
      user: user._id,
      items: []
    });
  }

  const token = signToken(user);

  res.status(201).json({
    success: true,
    message: "Registration successful",
    token,
    user: sanitizeUser(user)
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = signToken(user);

  res.json({
    success: true,
    message: "Login successful",
    token,
    user: sanitizeUser(user)
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: sanitizeUser(req.user)
  });
});

module.exports = {
  register,
  login,
  me
};
