import axios from "axios";
import { getCsrfToken } from "./csrf.api.js";

const api = axios.create({
    baseURL: '/',
    withCredentials: true
});

// usuarios (moderadores y administrador)
export const getAllUsers = () => api.get('/users');

export const updateUserById = async (userId, data, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.put(`/users/${userId}`, data, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};

export const deleteUserById = async (userId, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.delete(`/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};

// productos
export const createProduct = async (product, access_token) => {
    const csrfToken = await getCsrfToken();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('description', product.description);
    if (product.image) {
        formData.append('image', product.image);
    }
    return api.post('/products', formData, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'multipart/form-data',
            'x-csrf-token': csrfToken,
        },
    });
};

export const updateProduct = async (productId, product, access_token) => {
    const csrfToken = await getCsrfToken();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('description', product.description);
    if (product.image) {
        formData.append('image', product.image)
    }
    return api.put(`/products/${productId}`, formData, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'multipart/form-data',
            'x-csrf-token': csrfToken,
        },
    });
};

export const deleteProduct = async (productId, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.delete(`/products/${productId}`, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};

export const updateProductStock = async (productId, stock, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.patch(`/products/${productId}/stock`, { stock }, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};

// catálogos
export const createCatalog = async (catalogData, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.post('/catalogs', catalogData, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};

export const updateCatalog = async (id, catalogData, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.patch(`/catalogs/${id}`, catalogData, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};

export const deleteCatalog = async (id, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.delete(`/catalogs/${id}`, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};

// órdenes
export const getAllOrders = (access_token) => {
    return api.get('/orders', {
        headers: {
            'Authorization': `Bearer ${access_token}`,
        },
    });
};

export const updateOrderStatus = async (id, statusData, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.patch(`/orders/${id}/status`, statusData, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};

export const dispatchOrder = async (id, dispatchData, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.patch(`/orders/${id}/dispatch`, dispatchData, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};

export const deleteOrder = async (id, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.delete(`/orders/${id}`,{
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};

// movimientos de stock
export const recordStockMovement = async (movementData, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.post('/stock-movements', movementData, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};

export const getStockMovementsByProduct = (productId, access_token) => {
    return api.get(`/stock-movements/${productId}`, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
        },
    });
};

// envíos 
export const getAllShippings = (access_token) => {
    return api.get('/shipping', {
        headers: {
            'Authorization': `Bearer ${access_token}`,
        },
    });
};

export const updateShippingStatus = async (orderId, statusData, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.patch(`/shipping/${orderId}/status`, statusData, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};

export const updateShipping = async (orderId, shippingData, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.patch(`/shipping/${orderId}`, shippingData, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};

export const deleteShipping = async (orderId, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.delete(`/shipping/${orderId}`, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};
