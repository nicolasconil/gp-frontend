// src/api/public.api.js  (o donde esté tu public.api.js)
import axios from "axios";
import { fetchCsrfToken, getCsrfToken } from "./csrf.api.js";

// Normaliza un valor de URL para evitar 'undefined'
const normalize = (u) => (typeof u === "string" ? u.replace(/\/$/, "") : "");

// Si VITE_BACKEND_URL no está definido, no dejar "undefined" en la base
const rawBackend = normalize(import.meta.env.VITE_BACKEND_URL);
const isProd = !!import.meta.env.PROD;

// En producción usá el proxy /api (Netlify _redirects), en dev apuntá al backend si está definido
const BASE_IN_PROD = "/api";
const backendBase = isProd
  ? BASE_IN_PROD
  : (rawBackend ? `${rawBackend}/api` : "/api");

// Crear instancia axios segura
const api = axios.create({
  baseURL: backendBase,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();
  if (["post", "put", "patch", "delete"].includes(method)) {
    let token = getCsrfToken();
    if (!token) {
      token = await fetchCsrfToken();
    }
    if (token) {
      config.headers = config.headers || {};
      config.headers["X-XSRF-TOKEN"] = token;
    }
  }
  return config;
});

export default api;

// autenticación 
export const login = async (credentials) => {
    await fetchCsrfToken();
    return api.post('/auth/login', credentials);
};

export const refreshToken = () => api.post('/auth/refresh-token');
export const requestPasswordReset = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (data) => api.post('/auth/reset-password', data);
export const logout = async () => api.post('/auth/logout');

// productos
export const getAllProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);

// catálogos 
export const getAllCatalogs = () => api.get('/catalogs');
export const getActiveCatalogs = () => api.get('/catalogs/active');
export const getCatalogById = (id) => api.get(`/catalogs/${id}`);

// órdenes 
export const createOrder = async (orderData) => {
  await fetchCsrfToken();
  return api.post('/orders', orderData, {
    headers: {
      'X-XSRF-TOKEN': getCsrfToken()
    }
  });
};

export const createPaymentPreference = async (orderData) => {
  await fetchCsrfToken();
  return api.post('/mercadopago/preference', orderData, {
    headers: {
      'X-XSRF-TOKEN': getCsrfToken()
    },
  });
};

export const suscribeToNewsletter = async (email) => {
  return api.post('/promotions/subscribe', { email });
};

export const getUserProfile = async () => {
  await fetchCsrfToken();
  return api.get('/auth/users/me', {
    headers: {
      'X-XSRF-TOKEN': getCsrfToken()
    },
  });
};
