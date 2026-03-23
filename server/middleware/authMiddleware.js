import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const extractToken = (req) => {
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  if (req.headers.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  }

  return null;
};

export const protect = async (req, _res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(new ApiError(401, "User no longer exists"));
    }

    req.user = user;
    next();
  } catch (_error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

export const optionalAuth = async (req, _res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (user) {
      req.user = user;
    }
  } catch (_error) {
    req.user = null;
  }

  next();
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Authentication required"));
  }

  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, "You are not authorized to access this resource"));
  }

  next();
};
