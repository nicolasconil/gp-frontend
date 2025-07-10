import axios from "axios";

const api = axios.create({
    baseURL: '/api',
    withCredentials: true
});

let cachedCsrfToken = null;

export const getCsrfToken = async () => {
    if (cachedCsrfToken) return cachedCsrfToken;
    const res = await api.get('/csrf-token');
    cachedCsrfToken = res.data.csrfToken;
    return cachedCsrfToken;
};

export const resetCsrfToken = () => {
    cachedCsrfToken = null;
};