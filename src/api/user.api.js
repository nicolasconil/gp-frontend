import axios from "axios";
import { getCsrfToken } from "./csrf.api.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
    withCredentials: true
});

export const getUserProfile = async () => {
  const csrfToken = getCsrfToken();
  return api.get('/users/me', {
    headers: {
      'XSRF-TOKEN': csrfToken,
    },
  });
};

// export const updateUserProfile = async (userData) => {
//     const csrfToken = await getCsrfToken();
//     return api.put('/me', userData, {
//         headers: {
//             'x-csrf-token': csrfToken,
//         },
//     });
// };

// export const deleteAccount = async () => {
//     const csrfToken = await getCsrfToken();    
//     return api.delete('/me', {
//         headers: {
//             'x-csrf-token': csrfToken,
//         },
//     });
// };

// export const getUserOrders = () => api.get('/me/orders');
// export const exportUserData = (format) => api.get(`/me/exports?format=${format}`);

// órdenes
export const getMyOrders = (access_token) => {
    return api.get('/orders/my-orders', {
        headers: {
            'Authorization': `Bearer ${access_token}`, 
        },
    });
};

export const getOrderById = (id, access_token) => {
    return api.get(`/orders/${id}`, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
        },
    });
};

export const cancelOrder = async (id, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.patch(`/orders/${id}/cancel`, {}, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};

export const updateOrderPayment = async (id, paymentInfo, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.patch(`/orders/${id}/payment`, paymentInfo, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};

export const updateOrderFields = async (id, updateData, access_token) => {
    const csrfToken = await getCsrfToken();
    return api.patch(`/orders/${id}`, updateData, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'x-csrf-token': csrfToken,
        },
    });
};

