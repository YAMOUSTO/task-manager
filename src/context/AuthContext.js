// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '../api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    const checkLoggedIn = () => {
      setLoading(true);
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            setCurrentUser(JSON.parse(storedUser));
          } catch (e) {
            console.error("Error parsing stored user", e);
            localStorage.removeItem('user');
            setToken(null);
            setCurrentUser(null);
          }
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const signup = async (name, email, password) => {
    const response = await registerUser({ name, email, password });
    setCurrentUser(response.data.user);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setToken(response.data.token);
    return response.data;
  };

  const login = async (email, password) => {
    const response = await loginUser({ email, password });
    setCurrentUser(response.data.user);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setToken(response.data.token);
    return response.data;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    setToken(null);
  };

  const value = {
    currentUser,
    token,
    signup,
    login,
    logout,
    loading,
    isAuthenticated: !!token && !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}