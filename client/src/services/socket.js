import { io } from "socket.io-client";

const configuredSocketUrl = import.meta.env.VITE_API_URL?.trim() || "/";
const normalizedSocketUrl = configuredSocketUrl === "/"
  ? "/"
  : configuredSocketUrl.replace(/\/$/, "");

export const socket = io(normalizedSocketUrl, {
  path: "/socket.io",
  withCredentials: true,
  autoConnect: false
});
