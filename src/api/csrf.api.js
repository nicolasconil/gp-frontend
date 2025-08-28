export const fetchCsrfToken = async () => {
  try {
    const res = await fetch('/api/auth/csrf-token', {
      method: 'GET',
      credentials: 'include' 
    });

    if (!res.ok) {
      return null;
    }
    const data = await res.json().catch(() => null);
    return data?.csrfToken || null;
  } catch (error) {
    return null;
  }
};

export const getCsrfToken = () => {
  try {
    const match = document.cookie.match(new RegExp('(?:^|; )' + 'XSRF-TOKEN' + '=([^;]+)'));
    return match ? decodeURIComponent(match[1]) : null;
  } catch (error) {
    return null;
  }
};
