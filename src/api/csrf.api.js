export const fetchCsrfToken = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/csrf-token`, {
      method: 'GET',
      credentials: 'include'
    }); 
    if (!res.ok) {
      console.error('fetchCsrfToken: respuesta no OK', res.status);
      return null;
    }
    const data = await res.json();
    return data?.csrfToken || null;
  } catch (error) {
    console.error('fetchCsrfToken error', error);
    return null;
  }
};

export const getCsrfToken = () => {
  try {
    const match = document.cookie.match(new RegExp('(^|; )' + 'XSRF-TOKEN' + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  } catch (error) {
    return null;
  }
};
