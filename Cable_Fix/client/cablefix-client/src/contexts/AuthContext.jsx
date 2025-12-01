import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem("user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // keep user in localStorage
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  function login(token, userObj) {
    localStorage.setItem("token", token);
    setUser(userObj);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
