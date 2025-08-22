import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  user: null,
  login: async (email: string, password: string) => {},
  logout: () => {},
  loading: false,
});

export const useAuth = () => useContext(AuthContext);  // ✅ Exported here

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser({ email, name: email.split("@")[0] });
    setLoading(false);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
