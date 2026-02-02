import React, { createContext, useContext } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Sin sistema de usuarios - todo es local
  const value = {
    user: null,
    loading: false,
    login: async () => Promise.resolve(),
    register: async () => Promise.resolve(),
    logout: async () => Promise.resolve()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};