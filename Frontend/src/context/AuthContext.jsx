import { createContext, useContext, useEffect, useState } from "react";

import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem("trybuy_token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((response) => setUser(response.data.user))
      .catch(() => {
        window.localStorage.removeItem("trybuy_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (token, authenticatedUser) => {
    window.localStorage.setItem("trybuy_token", token);
    setUser(authenticatedUser);
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    persistSession(response.data.token, response.data.user);
    return response.data;
  };

  const login = async (payload) => {
    const response = await api.post("/auth/login", payload);
    persistSession(response.data.token, response.data.user);
    return response.data;
  };

  const logout = () => {
    window.localStorage.removeItem("trybuy_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
