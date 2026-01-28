import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('demo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      const demoUser = {
        email: 'estudiante@estadisticamente.com',
        uid: 'demo_user_123',
        displayName: 'Estudiante Demo'
      };
      setUser(demoUser);
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const demoUser = {
      email: email,
      uid: 'demo_user_' + Date.now(),
      displayName: email.split('@')[0]
    };
    setUser(demoUser);
    localStorage.setItem('demo_user', JSON.stringify(demoUser));
    return Promise.resolve(demoUser);
  };

  const register = async (email, password) => {
    return login(email, password);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('demo_user');
    return Promise.resolve();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};