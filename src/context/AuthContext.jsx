import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { login as loginRequest, logout as logoutRequest, refreshToken } from "../api/public.api.js";
import api from "../api/public.api.js";
import { fetchCsrfToken } from "../api/csrf.api.js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    const csrfToken = fetchCsrfToken();
    const { data } = await api.get("/auth/users/me", {
      headers: {
        'XSRF-TOKEN': csrfToken,
      },
      withCredentials: true,
    });
    return data;
  };

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (err) => {
        const originalConfig = err.config;
        if (err.response?.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            await refreshToken();
            return api(originalConfig);
          } catch {
            localStorage.removeItem("user");
            setUser(null);
            if (location.pathname !== "/login") navigate("/login");
          }
        }
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(responseInterceptor);
  }, [location.pathname, navigate]);

  useEffect(() => {
    const authPages = ["/login", "/forgot-password", "/reset-password"];
    if (authPages.includes(location.pathname)) {
      setAuthLoading(false);
      return;
    }

    (async () => {
      try {
        const userData = await fetchUserProfile();
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    })();
  }, [location.pathname]);

  const login = useCallback(async (credentials) => {
    await loginRequest(credentials);
    const userData = await fetchUserProfile();
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }, [navigate]);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    authLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
