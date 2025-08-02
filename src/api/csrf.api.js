import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
    withCredentials: true  
});

export const getCsrfToken = () => {
    const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
    if (!csrfToken) {
        console.error("CSRF token no encontrado en las cookies.");
    }
    return csrfToken;
};

export const resetCsrfToken = () => {
    cachedCsrfToken = null;
};
