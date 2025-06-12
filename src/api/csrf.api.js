import axios from "axios";

const api = axios.create({
    baseURL: '/',
    withCredentials: true
});

export const getCsrfToken = async () => {
    const res = await api.get('/csrf-token');
    return res.data.csrfToken;
};