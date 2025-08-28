import axios from "axios";
import { fetchCsrfToken } from "./csrf.api.js";

const normalize = (u) => (typeof u === "string" ? u.replace(/\/$/, "") : "");
const rawBackend = normalize(import.meta.env.VITE_BACKEND_URL);
const isProd = !!import.meta.env.PROD;
const BASE_IN_PROD = "/api";
const backendBase = isProd ? BASE_IN_PROD : (rawBackend ? `${rawBackend}/api` : "/api");

const api = axios.create({
  baseURL: backendBase,
  withCredentials: true
});

const makeAuthHeader = (access_token) => (access_token ? { Authorization: `Bearer ${access_token}` } : {});

// órdenes
export const getMyOrders = (access_token) => {
  return api.get('/orders/my-orders', {
    headers: { ...makeAuthHeader(access_token) }
  });
};

export const getOrderById = (id, access_token) => {
  return api.get(`/orders/${id}`, {
    headers: { ...makeAuthHeader(access_token) }
  });
};

export const cancelOrder = async (id, access_token) => {
  const csrfToken = await fetchCsrfToken();
  return api.patch(`/orders/${id}/cancel`, {}, {
    headers: {
      ...makeAuthHeader(access_token),
      'x-csrf-token': csrfToken,
    },
  });
};

export const updateOrderPayment = async (id, paymentInfo, access_token) => {
  const csrfToken = await fetchCsrfToken();
  return api.patch(`/orders/${id}/payment`, paymentInfo, {
    headers: {
      ...makeAuthHeader(access_token),
      'x-csrf-token': csrfToken,
    },
  });
};

export const updateOrderFields = async (id, updateData, access_token) => {
  const csrfToken = await fetchCsrfToken();
  return api.patch(`/orders/${id}`, updateData, {
    headers: {
      ...makeAuthHeader(access_token),
      'x-csrf-token': csrfToken,
    },
  });
};
