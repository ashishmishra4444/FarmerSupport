import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const normalizedApiBaseUrl = configuredApiUrl
  ? `${configuredApiUrl.replace(/\/$/, "")}/api`
  : "/api";

const api = axios.create({
  baseURL: normalizedApiBaseUrl,
  withCredentials: true
});

const unwrap = (response) => response.data;

export const authApi = {
  register: (payload) => api.post("/auth/register", payload).then(unwrap),
  login: (payload) => api.post("/auth/login", payload).then(unwrap),
  logout: () => api.post("/auth/logout").then(unwrap),
  me: () => api.get("/auth/me").then(unwrap)
};

export const productApi = {
  list: (params) => api.get("/products", { params }).then(unwrap),
  create: (payload) => api.post("/products", payload).then(unwrap),
  mine: () => api.get("/products/farmer/my-products").then(unwrap),
  summary: () => api.get("/products/farmer/summary").then(unwrap),
  update: (productId, payload) => api.patch(`/products/${productId}`, payload).then(unwrap),
  remove: (productId) => api.delete(`/products/${productId}`).then(unwrap)
};

export const orderApi = {
  create: (payload) => api.post("/orders", payload).then(unwrap),
  buyerOrders: () => api.get("/orders/buyer/my-orders").then(unwrap),
  farmerOrders: () => api.get("/orders/farmer/my-orders").then(unwrap),
  analytics: () => api.get("/orders/farmer/analytics").then(unwrap),
  getById: (orderId) => api.get(`/orders/${orderId}`).then(unwrap),
  updateStatus: (orderId, payload) => api.patch(`/orders/${orderId}/status`, payload).then(unwrap)
};

export const adminApi = {
  dashboard: () => api.get("/admin/dashboard").then(unwrap),
  syncMandi: () => api.post("/admin/mandi/sync").then(unwrap),
  snapshot: () => api.get("/admin/snapshot").then(unwrap)
};

export const mandiApi = {
  list: () => api.get("/mandi").then(unwrap)
};

export const weatherApi = {
  alerts: (params) => api.get("/weather", { params }).then(unwrap)
};

export const recommendationApi = {
  predict: (payload) => api.post("/recommendations", payload).then(unwrap)
};

export const paymentApi = {
  createOrder: (orderId) => api.post(`/payments/${orderId}/create-order`).then(unwrap),
  verify: (orderId, payload) => api.post(`/payments/${orderId}/verify`, payload).then(unwrap)
};

export const chatApi = {
  list: () => api.get("/chats").then(unwrap),
  create: (payload) => api.post("/chats", payload).then(unwrap),
  sendMessage: (chatId, payload) => api.post(`/chats/${chatId}/messages`, payload).then(unwrap)
};

export default api;
