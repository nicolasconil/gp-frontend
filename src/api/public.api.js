import axios from "axios";
import { getCsrfToken, fetchCsrfToken } from "./csrf.api.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
    withCredentials: true
});

export default api;

const EXCLUDED_FROM_CSRF = ['/auth/login','/auth/refresh-token'];

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();
  const url = config.url;
  const needsCsrf = ['post', 'put', 'patch', 'delete'].includes(method);
  const isExcluded = EXCLUDED_FROM_CSRF.some(path => url.includes(path));
  if (needsCsrf && !isExcluded) {
    const csrf = await getCsrfToken();
    if (csrf) {
      config.headers['XSRF-TOKEN'] = csrf;
    }
  }
  config.withCredentials = true;
  return config;
});


// autenticación 
export const login = async (credentials) => {
  const csrfToken = await fetchCsrfToken();
  if (!csrfToken) throw new Error("CSRF Token no disponible.");
  return api.post('/auth/login', credentials, {
    headers: {
      'XSRF-TOKEN': csrfToken 
    }
  });
};

export const refreshToken = () => api.post('/auth/refresh-token');
export const requestPasswordReset = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (data) => api.post('/auth/reset-password', data);
export const logout = () => api.post('/auth/logout');

// productos
export const getAllProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);

// catálogos 
export const getAllCatalogs = () => api.get('/catalogs');
export const getActiveCatalogs = () => api.get('/catalogs/active');
export const getCatalogById = (id) => api.get(`/catalogs/${id}`);

// órdenes 
export const createOrder = async (orderData) => {
    return api.post('/orders', orderData);
};

export const createPaymentPreference = async (orderData) => {
    const csrfToken = await getCsrfToken();
    return api.post('/mercadopago/preference', orderData, {
        headers: {
            'x-csrf-token': csrfToken,
        },
    });
};

export const suscribeToNewsletter = async (email) => {
    return api.post('/promotions/subscribe', { email });
};