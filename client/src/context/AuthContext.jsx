import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi, setAuthToken } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    authApi
      .me()
      .then((response) => {
        if (!active) return;
        setUser(response.data || null);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          setAuthToken(null);
          setUser(null);
        }
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
