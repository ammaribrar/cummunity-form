import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { auth } from '../api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token and get user data
          const response = await auth.getMe();
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        setError('Session expired. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await auth.login({ email, password });
      setCurrentUser(response.user);
      return { success: true };
    } catch (error) {
      const message = error.message || 'Login failed. Please check your credentials.';
      setError(message);
      return { success: false, message };
    }
  };

  // Register new user
  const register = async (userData) => {
    try {
      setError(null);
      const response = await auth.register(userData);
      setCurrentUser(response.user);
      return { success: true };
    } catch (error) {
      const message = error.message || 'Registration failed. Please try again.';
      setError(message);
      return { success: false, message };
    }
  };

  // Logout user
  const logout = useCallback(() => {
    auth.logout();
    setCurrentUser(null);
    setError(null);
  }, []);

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await auth.updateProfile(userData);
      setCurrentUser(response.data);
      return { success: true };
    } catch (error) {
      const message = error.message || 'Failed to update profile. Please try again.';
      setError(message);
      return { success: false, message };
    }
  };

  // Update password
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await auth.updatePassword({ currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      const message = error.message || 'Failed to update password. Please try again.';
      setError(message);
      return { success: false, message };
    }
  };

  // Clear error
  const clearError = () => setError(null);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
