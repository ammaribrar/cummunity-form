import api from '../utils/api';

// Register user
const register = async (userData) => {
  try {
    console.log('Sending registration request with data:', userData);
    
    const response = await api.post('/api/v1/auth/register', userData, {
      validateStatus: (status) => status < 500 // Resolve for all status codes less than 500
    });
    
    console.log('Registration response:', response.data);
    
    // Handle successful registration (201 Created)
    if (response.status === 201) {
      // If we have a token in the response, save it
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return {
        success: true,
        message: response.data.message || 'Registration successful!',
        user: response.data.user
      };
    }
    
    // Handle validation errors (422 Unprocessable Entity)
    if (response.status === 422 && response.data.errors) {
      return {
        success: false,
        message: 'Validation failed',
        errors: response.data.errors
      };
    }
    
    // Handle other error responses
    return {
      success: false,
      message: response.data?.message || 'Registration failed',
      errors: response.data?.errors
    };
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle network errors or other unexpected errors
    if (!error.response) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    // Handle API errors with response
    throw {
      message: error.response.data?.message || 'Registration failed',
      response: error.response,
      errors: error.response.data?.errors
    };
    
    // Handle network errors or other issues
    throw new Error(error.message || 'Failed to connect to the server. Please try again.');
  }
};

// Login user
const login = async (credentials) => {
  console.log('Attempting login with credentials:', {
    email: credentials.email,
    hasPassword: !!credentials.password
  });

  try {
    const response = await api.post('/api/v1/auth/login', {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password
    }, {
      validateStatus: function (status) {
        return status < 600; // Resolve for all status codes
      }
    });
    
    console.log('Login response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });

    // If we have a successful response with a token
    if (response.data && response.data.token) {
      // Save the token to localStorage
      localStorage.setItem('token', response.data.token);
      
      // Return the response data with success flag
      return {
        ...response.data,
        success: true
      };
    }
    
    // Handle non-200 responses with error messages
    if (response.data) {
      const errorMessage = response.data.message || 'Login failed';
      console.error('Login failed with message:', errorMessage);
      const error = new Error(errorMessage);
      error.response = response;
      error.status = response.status;
      throw error;
    }
    
    const noDataError = new Error('No response data received from server');
    noDataError.response = response;
    throw noDataError;
    
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });
    
    // If we have a response with status code, handle accordingly
    if (error.response) {
      // Handle validation errors (422) or other API errors
      if (error.response.status === 422 && error.response.data?.errors) {
        const validationError = new Error('Validation failed');
        validationError.response = error.response;
        validationError.errors = error.response.data.errors;
        throw validationError;
      }
      
      // Handle unauthorized (401) specifically
      if (error.response.status === 401) {
        const authError = new Error('Invalid email or password');
        authError.status = 401;
        throw authError;
      }
      
      // Handle other API errors
      const apiError = new Error(
        error.response.data?.message || 
        `Login failed with status ${error.response.status}`
      );
      apiError.status = error.response.status;
      throw apiError;
    }
    
    // Handle network errors or other issues
    const networkError = new Error(error.message || 'Failed to connect to the server. Please try again.');
    networkError.isNetworkError = true;
    throw networkError;
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
};

// Get current user
const getMe = async () => {
  try {
    const response = await api.get('/api/v1/auth/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user data');
  }
};

export default {
  register,
  login,
  logout,
  getMe
};
