import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // must be null initially
  const [isLoading, setIsLoading] = useState(false);

  const login = async (userData) => {
    setUser(userData); // this will trigger NavigationContainer to switch
  };

  const logout = () => {
    setUser(null);
  };
  useEffect(() => {
    console.log("🔁 Auth user changed:", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
