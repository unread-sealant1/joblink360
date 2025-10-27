import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: false
  });

  // ✅ Login with credentials
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password }, {
        withCredentials: true
      });
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // ✅ Register with credentials
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password }, {
        withCredentials: true
      });
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // ✅ Logout with credentials
  const logout = async () => {
    try {
      await api.post('/auth/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  // ✅ Session check on page load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get('/auth/me', {
          withCredentials: true
        });
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      } catch {
        dispatch({ type: 'LOGOUT' });
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
