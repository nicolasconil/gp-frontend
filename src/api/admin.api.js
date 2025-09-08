import axios from "axios";
import { fetchCsrfToken, getCsrfToken } from "./csrf.api.js";

const normalize = (u) => (typeof u === "string" ? u.replace(/\/$/, "") : "");

const rawBackend = normalize(import.meta.env.VITE_BACKEND_URL);
const isProd = !!import.meta.env.PROD;
const BASE_IN_PROD = "/api";
const backendBase = isProd
  ? BASE_IN_PROD
  : (rawBackend ? `${rawBackend}/api` : "/api");

const api = axios.create({
  baseURL: backendBase,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();
  if (["post", "put", "patch", "delete"].includes(method)) {
    let csrf = getCsrfToken();
    if (!csrf) csrf = await fetchCsrfToken();
    if (csrf) {
      config.headers = config.headers || {};
      config.headers["X-XSRF-TOKEN"] = csrf;
    }
  }
  return config;
});

export const setAdminAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

const makeAuthHeader = (access_token) => {
  return access_token ? { Authorization: `Bearer ${access_token}` } : {};
};

function appendFieldsToFormData(fd, product) {
  Object.entries(product).forEach(([k, v]) => {
    if (v == null) return;
    if (k === "variations") {
      fd.append("variations", JSON.stringify(v));
    } else if (k === "newImages" || k === "imagesToKeep") {
      // handled separately outside
    } else {
      // primitive or string types
      fd.append(k, v);
    }
  });
}

// usuarios (moderadores y administrador)
export const getAllUsers = (access_token) =>
  api.get("/users", { headers: makeAuthHeader(access_token) });

export const updateUserById = (userId, data, access_token) =>
  api.put(`/users/${userId}`, data, { headers: makeAuthHeader(access_token) });

export const deleteUserById = (userId, access_token) =>
  api.delete(`/users/${userId}`, { headers: makeAuthHeader(access_token) });

// productos
export const createProduct = async (product, access_token) => {
  let csrf = getCsrfToken();
  if (!csrf) csrf = await fetchCsrfToken();
  const fd = new FormData();
  appendFieldsToFormData(fd, product);
  if (Array.isArray(product.imagesToKeep)) {
    fd.append('imagesToKeep', JSON.stringify(product.imagesToKeep));
  }
  if (Array.isArray(product.newImages) && product.newImages.length > 0) {
    product.newImages.forEach((file) => {
      fd.append('images', file);
    });
  } else if (product.image && typeof product.image === 'string') {
    fd.append('image', product.image);
  }
  const headers = { ...makeAuthHeader(access_token) };
  if (csrf) headers['X-XSRF-TOKEN'] = csrf;
  return api.post("/products", fd, { headers });
};

export const updateProduct = async (id, product, access_token) => {
  let csrf = getCsrfToken();
  if (!csrf) csrf = await fetchCsrfToken();
  const fd = new FormData();
  appendFieldsToFormData(fd, product);
  if (Array.isArray(product.imagesToKeep)) {
    fd.append('imagesToKeep', JSON.stringify(product.imagesToKeep));
  }
  if (Array.isArray(product.newImages) && product.newImages.length > 0) {
    product.newImages.forEach((file) => fd.append('images', file));
  }
  if (!product.newImages && product.image && typeof product.image === 'string') {
    fd.append('image', product.image);
  }
  const headers = { ...makeAuthHeader(access_token) };
  if (csrf) headers['X-XSRF-TOKEN'] = csrf;
  return api.put(`/products/${id}`, fd, { headers });
};

export const deleteProduct = async (id, access_token) => {
  let csrf = getCsrfToken();
  if (!csrf) csrf = await fetchCsrfToken();
  const headers = { ...makeAuthHeader(access_token) };
  if (csrf) headers['X-XSRF-TOKEN'] = csrf;
  return api.delete(`/products/${id}`, { headers });
};

export const updateProductStock = (productId, stock, access_token) =>
  api.patch(`/products/${productId}/stock`, { stock }, { headers: makeAuthHeader(access_token) });

// catálogos
export const createCatalog = (catalogData, access_token) =>
  api.post("/catalogs", catalogData, { headers: makeAuthHeader(access_token) });

export const updateCatalog = (id, catalogData, access_token) =>
  api.patch(`/catalogs/${id}`, catalogData, { headers: makeAuthHeader(access_token) });

export const deleteCatalog = (id, access_token) =>
  api.delete(`/catalogs/${id}`, { headers: makeAuthHeader(access_token) });

// órdenes
export const getAllOrders = (access_token) =>
  api.get("/orders", { headers: makeAuthHeader(access_token) });

export const updateOrderStatus = (id, statusData, access_token) =>
  api.patch(`/orders/${id}/status`, statusData, { headers: makeAuthHeader(access_token) });

export const dispatchOrder = (id, dispatchData, access_token) =>
  api.patch(`/orders/${id}/dispatch`, dispatchData, { headers: makeAuthHeader(access_token) });

export const deleteOrder = (id, access_token) =>
  api.delete(`/orders/${id}`, { headers: makeAuthHeader(access_token) });

// movimientos de stock
export const recordStockMovement = (movementData, access_token) =>
  api.post("/stock-movements", movementData, { headers: makeAuthHeader(access_token) });

export const getStockMovementsByProduct = (productId, access_token) =>
  api.get(`/stock-movements/${productId}`, { headers: makeAuthHeader(access_token) });

// envíos
export const getAllShippings = (access_token) =>
  api.get("/shipping", { headers: makeAuthHeader(access_token) });

export const updateShippingStatus = (orderId, statusData, access_token) =>
  api.patch(`/shipping/${orderId}/status`, statusData, { headers: makeAuthHeader(access_token) });

export const updateShipping = (orderId, shippingData, access_token) =>
  api.patch(`/shipping/${orderId}`, shippingData, { headers: makeAuthHeader(access_token) });

export const deleteShipping = (orderId, access_token) =>
  api.delete(`/shipping/${orderId}`, { headers: makeAuthHeader(access_token) });

export const getOrdersForShipping = (access_token) =>
  api.get("/orders/for-shipping", { headers: makeAuthHeader(access_token) });

export const getShippingOrderById = (orderId, access_token) =>
  api.get(`/shipping/order/${orderId}`, { headers: makeAuthHeader(access_token) }).then(res => res.data);

export const dispatchShipping = (orderId, dispatchData, access_token) =>
  api.post(`/shipping/${orderId}/dispatch`, dispatchData, { headers: makeAuthHeader(access_token) });

export const updateShippingDetails = (orderId, updateData, access_token) =>
  api.patch(`/shipping/${orderId}`, updateData, { headers: makeAuthHeader(access_token) });

export const createShippingForOrder = (orderId, access_token) =>
  api.post(`/shipping/${orderId}`, null, { headers: makeAuthHeader(access_token) });
