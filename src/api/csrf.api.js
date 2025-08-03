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

// export const getCsrfToken = () => {
//   const csrfToken = document.cookie
//     .split('; ')
//     .find(row => row.startsWith('XSRF-TOKEN'))
//     ?.split('=')[1];
//   if (!csrfToken) {
//     console.error("CSRF token no encontrado en las cookies.");
//   }
//   return csrfToken;
// };
