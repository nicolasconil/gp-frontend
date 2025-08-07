import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
  withCredentials: true
});

export const fetchCsrfToken = async () => {
  try {
    const res = await api.get('/auth/csrf-token'); 
    return res.data.csrfToken;
  } catch (error) {
    return null;
  }
};

export const getCsrfToken = () => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
};
