import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { login as loginRequest, logout as logoutRequest, refreshToken } from "../api/public.api.js";
import api from "../api/public.api.js";
import { fetchCsrfToken, getCsrfToken } from "../api/csrf.api.js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    await fetchCsrfToken(); 
    const { data } = await api.get("/auth/users/me", {
      withCredentials: true,
      headers: {
        "X-XSRF-TOKEN": getCsrfToken(),
      },
    });
    return data;
  };

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (err) => {
        const originalConfig = err.config || {};
        if (err.response?.status !== 401) return Promise.reject(err);
        if (originalConfig._retry || /\/auth\/refresh|\/auth\/login|\/auth\/logout/.test(originalConfig.url)) {
          localStorage.removeItem("user");
          setUser(null);
          if (location.pathname !== "/login") navigate("/login");
          return Promise.reject(err);
        }
        originalConfig._retry = true;
        try {
          await refreshToken();
          originalConfig.withCredentials = true;
          originalConfig.headers = {
            ...(originalConfig.headers || {}),
            "X-XSRF-TOKEN": getCsrfToken(),
          };
          return api(originalConfig);
        } catch (refreshErr) {
          localStorage.removeItem("user");
          setUser(null);
          if (location.pathname !== "/login") navigate("/login");
          return Promise.reject(refreshErr);
        }
      }
    );
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [location.pathname, navigate]);

  useEffect(() => {
    let mounted = true;
    const authPages = ["/login", "/forgot-password", "/reset-password"];
    if (authPages.includes(location.pathname)) {
      setAuthLoading(false);
      return;
    }

    (async () => {
      setAuthLoading(true);
      try {
        const userData = await fetchUserProfile();
        if (!mounted) return;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } catch (e) {
        if (!mounted) return;
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        if (!mounted) return;
        setAuthLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  const login = useCallback(
    async (credentials) => {
      try {
        await fetchCsrfToken(); 
        await loginRequest(credentials); 
        const userData = await fetchUserProfile();
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return userData;
      } catch (err) {
        throw err;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest(); 
    } catch (e) {
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    }
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
