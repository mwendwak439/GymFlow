import { createContext, useContext, useEffect, useState } from "react";
import { fetchCsrf, getMe, loginUser, logoutUser, registerUser } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app start: get the CSRF cookie, then check if a session already exists
  useEffect(() => {
    async function init() {
      try {
        await fetchCsrf();
        const res = await getMe();
        setUser(res.data);
      } catch {
        setUser(null); // not logged in
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    await fetchCsrf(); // token rotates after login
    setUser(res.data);
    return res.data;
  };

  const register = async (data) => {
    const res = await registerUser(data);
    await fetchCsrf();
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await logoutUser();
    await fetchCsrf();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);