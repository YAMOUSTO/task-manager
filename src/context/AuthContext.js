import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '../api'; 

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token')); 
  const [loading, setLoading] = useState(true); 



  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      console.log("AuthContext: Token set in localStorage:", token); 
    } else {
      localStorage.removeItem('token');
      console.log("AuthContext: Token removed from localStorage"); 
    }
  }, [token]); 


  useEffect(() => {
    const checkLoggedIn = async () => {
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
          }
        } else {
        
          
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

 const signup = async (name, email, password) => {
    const response = await registerUser({ name, email, password }); 
    console.log("AuthContext: Signup successful, API response:", response.data); 
    setCurrentUser(response.data.user);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setToken(response.data.token); 
    return response.data;
  };

  const login = async (email, password) => {
    const response = await loginUser({ email, password }); 
    console.log("AuthContext: Login successful, API response:", response.data); 
    setCurrentUser(response.data.user);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setToken(response.data.token); 
    return response.data;
  };

  const logout = () => {
    console.log("AuthContext: Logging out"); 
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