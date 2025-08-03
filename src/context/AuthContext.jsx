import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { login as loginRequest, logout as logoutRequest, refreshToken } from "../api/public.api.js";
import api from "../api/public.api.js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });
  const [authLoading, setAuthLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.access_token) {
        config.headers["Authorization"] = `Bearer ${storedUser.access_token}`;
      }
      return config;
    });
    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (err) => {
        const originalConfig = err.config;
        if (err.response?.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            await refreshToken(); // esto debería renovar el token y setear cookies
            return api(originalConfig); // reintenta con nuevo token
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
        const storedToken = JSON.parse(localStorage.getItem("user"))?.access_token;
        if (!storedToken) throw new Error("No token");
        const { data } = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });
        const userData = { role: data.role, ...data, access_token: storedToken };
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
    const { data: { access_token } } = await loginRequest(credentials);                
    const { data } = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });    
    const userData = { role: data.role, ...data, access_token };
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