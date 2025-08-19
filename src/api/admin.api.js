import axios from "axios";
import { fetchCsrfToken } from "./csrf.api.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api",
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();
  if (["post", "put", "patch", "delete"].includes(method)) {
    const token = await fetchCsrfToken();
    if (token) {
      config.headers["X-XSRF-TOKEN"] = token;
    }
  }
  return config;
});

// usuarios (moderadores y administrador)
export const getAllUsers = (access_token) =>
  api.get("/users", { headers: { Authorization: `Bearer ${access_token}` } });

export const updateUserById = (userId, data, access_token) =>
  api.put(`/users/${userId}`, data, { headers: { Authorization: `Bearer ${access_token}` } });

export const deleteUserById = (userId, access_token) =>
  api.delete(`/users/${userId}`, { headers: { Authorization: `Bearer ${access_token}` } });

// productos
export const createProduct = (product, access_token) => {
  const fd = new FormData();
  Object.entries(product).forEach(([k, v]) => {
    if (v != null) {
      fd.append(
        k === "variations" ? "variations" : k,
        k === "variations" ? JSON.stringify(v) : v
      );
    }
  });
  const headers = {};
  if (access_token) headers.Authorization = `Bearer ${access_token}`;
  return api.post("/products", fd, { headers });
};

export const updateProduct = (id, product, access_token) => {
  const fd = new FormData();
  Object.entries(product).forEach(([k, v]) => {
    if (v != null) {
      fd.append(
        k === "variations" ? "variations" : k,
        k === "variations" ? JSON.stringify(v) : v
      );
    }
  });
  const headers = {};
  if (access_token) headers.Authorization = `Bearer ${access_token}`;
  return api.put(`/products/${id}`, fd, { headers });
};

export const deleteProduct = (id, access_token) => {
  const headers = {};
  if (access_token) headers.Authorization = `Bearer ${access_token}`;

  return api.delete(`/products/${id}`, { headers });
};

export const updateProductStock = (productId, stock, access_token) =>
  api.patch(
    `/products/${productId}/stock`,
    { stock },
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

// catálogos
export const createCatalog = (catalogData, access_token) =>
  api.post(
    "/catalogs",
    catalogData,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

export const updateCatalog = (id, catalogData, access_token) =>
  api.patch(
    `/catalogs/${id}`,
    catalogData,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

export const deleteCatalog = (id, access_token) =>
  api.delete(`/catalogs/${id}`, { headers: { Authorization: `Bearer ${access_token}` } });

// órdenes
export const getAllOrders = (access_token) =>
  api.get("/orders", { headers: { Authorization: `Bearer ${access_token}` } });

export const updateOrderStatus = (id, statusData, access_token) =>
  api.patch(
    `/orders/${id}/status`,
    statusData,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

export const dispatchOrder = (id, dispatchData, access_token) =>
  api.patch(
    `/orders/${id}/dispatch`,
    dispatchData,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

export const deleteOrder = (id, access_token) =>
  api.delete(`/orders/${id}`, { headers: { Authorization: `Bearer ${access_token}` } });

// movimientos de stock
export const recordStockMovement = (movementData, access_token) =>
  api.post(
    "/stock-movements",
    movementData,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

export const getStockMovementsByProduct = (productId, access_token) =>
  api.get(`/stock-movements/${productId}`, { headers: { Authorization: `Bearer ${access_token}` } });

// envíos
export const getAllShippings = (access_token) =>
  api.get("/shipping", { headers: { Authorization: `Bearer ${access_token}` } });

export const updateShippingStatus = (orderId, statusData, access_token) =>
  api.patch(
    `/shipping/${orderId}/status`,
    statusData,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

export const updateShipping = (orderId, shippingData, access_token) =>
  api.patch(
    `/shipping/${orderId}`,
    shippingData,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

export const deleteShipping = (orderId, access_token) =>
  api.delete(`/shipping/${orderId}`, { headers: { Authorization: `Bearer ${access_token}` } });

export const getOrdersForShipping = (access_token) =>
  api.get("/orders/for-shipping", { headers: { Authorization: `Bearer ${access_token}` } });

export const getShippingOrderById = (orderId, access_token) =>
  api.get(`/shipping/order/${orderId}`, { headers: { Authorization: `Bearer ${access_token}` } })
    .then((res) => res.data);

export const dispatchShipping = (orderId, dispatchData, access_token) =>
  api.post(
    `/shipping/${orderId}/dispatch`,
    dispatchData,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

export const updateShippingDetails = (orderId, updateData, access_token) =>
  api.patch(
    `/shipping/${orderId}`,
    updateData,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

export const createShippingForOrder = (orderId, access_token) =>
  api.post(`/shipping/${orderId}`, null, { headers: { Authorization: `Bearer ${access_token}` } });
