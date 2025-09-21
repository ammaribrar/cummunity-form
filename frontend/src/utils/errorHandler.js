import { useNotifications } from './notifications';

/**
 * Custom hook for handling errors
 * @returns {Object} Error handling functions
 */
export const useErrorHandler = () => {
  const { showError } = useNotifications();

  /**
   * Handle API errors
   * @param {Error} error - The error object
   * @param {string} defaultMessage - Default error message if none is provided
   * @returns {void}
   */
  const handleApiError = (error, defaultMessage = 'An error occurred') => {
    console.error('API Error:', error);
    
    let message = defaultMessage;
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      if (data && data.message) {
        message = data.message;
      } else if (status === 401) {
        message = 'You are not authorized. Please log in.';
      } else if (status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        message = 'The requested resource was not found.';
      } else if (status >= 500) {
        message = 'A server error occurred. Please try again later.';
      }
    } else if (error.request) {
      // The request was made but no response was received
      message = 'No response from server. Please check your connection.';
    } else if (error.message) {
      // Something happened in setting up the request that triggered an Error
      message = error.message;
    }
    
    showError(message);
  };

  /**
   * Handle form submission errors
   * @param {Error} error - The error object
   * @param {Object} setErrors - Formik setErrors function
   * @param {string} defaultMessage - Default error message if none is provided
   * @returns {void}
   */
  const handleFormError = (error, setErrors, defaultMessage = 'Please fix the errors below') => {
    console.error('Form Error:', error);
    
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 422 && data.errors) {
        // Handle validation errors
        const validationErrors = {};
        Object.keys(data.errors).forEach(key => {
          validationErrors[key] = data.errors[key].join(' ');
        });
        setErrors(validationErrors);
        return;
      }
      
      if (data && data.message) {
        showError(data.message);
        return;
      }
    }
    
    showError(defaultMessage);
  };

  /**
   * Handle network errors
   * @param {Error} error - The error object
   * @returns {void}
   */
  const handleNetworkError = (error) => {
    console.error('Network Error:', error);
    showError('Network error. Please check your connection and try again.');
  };

  /**
   * Handle authentication errors
   * @param {Error} error - The error object
   * @returns {void}
   */
  const handleAuthError = (error) => {
    console.error('Auth Error:', error);
    
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // Clear any existing auth data
        localStorage.removeItem('token');
        // Redirect to login page
        window.location.href = '/login';
        return;
      }
    }
    
    handleApiError(error, 'Authentication failed. Please try again.');
  };

  return {
    handleApiError,
    handleFormError,
    handleNetworkError,
    handleAuthError,
  };
};

/**
 * Create an error boundary component
 * @returns {React.Component} Error boundary component
 */
export const withErrorBoundary = (WrappedComponent) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Error Boundary caught an error:', error, errorInfo);
      // You can also log the error to an error reporting service
      // logErrorToMyService(error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Something went wrong.</h2>
            <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                marginTop: '10px',
                cursor: 'pointer',
              }}
            >
              Reload Page
            </button>
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

// Re-export for convenience
export default {
  useErrorHandler,
  withErrorBoundary,
};
