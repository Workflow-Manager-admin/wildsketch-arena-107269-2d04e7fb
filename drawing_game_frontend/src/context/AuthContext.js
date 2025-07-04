import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, loginAnonymous } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (nickname) => {
    setLoading(true);
    const user = await loginAnonymous(nickname);
    setUser(user);
    setLoading(false);
  };

  const value = { user, loading, login };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
