import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clearAuthCookie, setAuthCookie } from "../utils/jwt.js";

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  location: user.location
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, location } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    location
  });

  setAuthCookie(res, user);

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: sanitizeUser(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  setAuthCookie(res, user);

  res.json({
    success: true,
    message: "Login successful",
    data: sanitizeUser(user)
  });
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  res.json({
    success: true,
    message: "Logout successful"
  });
});

export const me = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.json({
      success: true,
      data: null
    });
  }

  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.json({
      success: true,
      data: null
    });
  }

  res.json({
    success: true,
    data: user
  });
});
