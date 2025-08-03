import axios from "axios";
import { getCsrfToken } from "./csrf.api.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api",
  withCredentials: true,
});

// Helper para headers
const getAuthHeaders = async (accessToken, includeCsrf = false) => {
  const headers = {
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  if (includeCsrf) {
    const csrfToken = getCsrfToken();
    if (csrfToken) headers["x-csrf-token"] = csrfToken;
  }

  return headers;
};

// 🧍 Perfil de usuario
export const getUserProfile = async () => {
  const headers = await getAuthHeaders(null, true);
  return api.get("/users/me", { headers });
};

// 🧾 Órdenes del usuario
export const getMyOrders = async (accessToken) => {
  const headers = await getAuthHeaders(accessToken);
  return api.get("/orders/my-orders", { headers });
};

export const getOrderById = async (id, accessToken) => {
  const headers = await getAuthHeaders(accessToken);
  return api.get(`/orders/${id}`, { headers });
};

export const cancelOrder = async (id, accessToken) => {
  const headers = await getAuthHeaders(accessToken, true);
  return api.patch(`/orders/${id}/cancel`, {}, { headers });
};

export const updateOrderPayment = async (id, paymentInfo, accessToken) => {
  const headers = await getAuthHeaders(accessToken, true);
  return api.patch(`/orders/${id}/payment`, paymentInfo, { headers });
};

export const updateOrderFields = async (id, updateData, accessToken) => {
  const headers = await getAuthHeaders(accessToken, true);
  return api.patch(`/orders/${id}`, updateData, { headers });
};

// 🛠️ (Opcionales: descomentar si los usás)
export const updateUserProfile = async (userData, accessToken) => {
  const headers = await getAuthHeaders(accessToken, true);
  return api.put("/users/me", userData, { headers });
};

export const deleteAccount = async (accessToken) => {
  const headers = await getAuthHeaders(accessToken, true);
  return api.delete("/users/me", { headers });
};
