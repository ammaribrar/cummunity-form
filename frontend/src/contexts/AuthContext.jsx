import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
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
      
      if (response && response.token) {
        try {
          // Get the user data after successful login
          const userResponse = await auth.getMe();
          if (userResponse && userResponse.data) {
            setCurrentUser(userResponse.data);
            return { 
              success: true, 
              user: userResponse.data,
              message: response.message || 'Login successful!',
              token: response.token
            };
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          // If we can't get user data but have a token, still consider it a success
          return { 
            success: true,
            message: 'Login successful!',
            user: { email },
            token: response.token
          };
        }
      }
      
      // If we get here, something went wrong
      return { 
        success: false, 
        message: response?.message || 'Login failed. No token received.',
        errors: response?.errors
      };
      
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 
                     error.message || 
                     'Login failed. Please check your credentials.';
      const errors = error.response?.data?.errors;
      
      setError(message);
      return { 
        success: false, 
        message,
        errors
      };
    }
  };

  // Register new user
  const register = async (userData) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await auth.register({
        username: userData.username.trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.password
      });
      
      if (response && response.success) {
        // If we have a token, save it and get user data
        if (response.token) {
          localStorage.setItem('token', response.token);
          try {
            const userResponse = await auth.getMe();
            if (userResponse && userResponse.data) {
              setCurrentUser(userResponse.data);
              return { 
                success: true, 
                user: userResponse.data,
                message: response.message || 'Registration successful!'
              };
            }
          } catch (userError) {
            console.error('Error fetching user data after registration:', userError);
            // Even if we can't get user data, registration was successful
            return { 
              success: true,
              message: 'Registration successful!',
              user: { email: userData.email }
            };
          }
        }
        
        return { 
          success: true,
          message: response.message || 'Registration successful!',
          user: response.user
        };
      }
      
      return { 
        success: false, 
        message: response?.message || 'Registration failed. Please try again.',
        errors: response?.errors
      };
      
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 
                     error.message || 
                     'Registration failed. Please try again.';
      
      setError(message);
      return { 
        success: false, 
        message,
        errors: error.response?.data?.errors
      };
    } finally {
      setLoading(false);
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
