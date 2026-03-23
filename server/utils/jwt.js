import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

export const setAuthCookie = (res, user) => {
  const token = signToken({
    userId: user._id,
    role: user.role
  });

  res.cookie("token", token, cookieOptions);
};

export const clearAuthCookie = (res) => {
  res.clearCookie("token", cookieOptions);
};
