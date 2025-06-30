import axios from "axios";
import { getCsrfToken } from "./csrf.api.js";

const api = axios.create({
    baseURL: '/api',
    withCredentials: true
});

export default api;

api.interceptors.request.use(async (config) => {
    const needsCsrf = ['post', 'put', 'patch', 'delete'].includes(
        config.method?.toLowerCase()
    );
    if (needsCsrf) {
        const csrf =  await getCsrfToken();
        config.headers['x-csrf-token'] = csrf;
    }
    return config;
});

// autenticación 
export const login = (credentials) => api.post('/auth/login', credentials)
export const refreshToken = () => api.post('/refresh-token');
export const requestPasswordReset = (email) => api.post('/forgot-password', email);
export const resetPassword = (data) => api.post('/reset-password', data);
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
    const csrfToken = await getCsrfToken();
    return api.post('/orders', orderData, {
        headers: {
            'x-csrf-token': csrfToken,
        },
    });
};

// pasarela de pagos de mercado pago
export const createPaymentPreference = async (orderData) => {
    const csrfToken = await getCsrfToken();
    return api.post('/mercadopago/preference', orderData, {
        headers: {
            'x-csrf-token': csrfToken,
        },
    });
};

// envíos
export const createShipping = async (shippingData) => {
    const csrfToken = await getCsrfToken();
    return api.post('/shipping', shippingData, {
        headers: {
            'x-csrf-token': csrfToken,
        },
    });
};