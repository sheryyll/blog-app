import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // Set axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('https://blog-app-y9pg.onrender.com/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://blog-app-y9pg.onrender.com/api/auth/login', {
        email,
        password
      });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please try again.'
      };
    }
  };

  const signup = async (username, email, password, firstName, lastName) => {
    try {
      const response = await axios.post('https://blog-app-y9pg.onrender.com/auth/signup', {
        username,
        email,
        password,
        firstName,
        lastName
      });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Signup failed. Please try again.'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

