import { useState, useCallback } from 'react';

/**
 * Custom hook for managing notifications
 * @returns {Object} Notification state and handlers
 */
export const useNotifications = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
    autoHideDuration: 6000, // milliseconds
  });

  /**
   * Show a notification
   * @param {Object} options - Notification options
   * @param {string} options.message - The message to display
   * @param {string} [options.severity='info'] - The severity of the notification
   * @param {number} [options.autoHideDuration=6000] - Duration in milliseconds
   * @param {boolean} [options.persist=false] - Whether to persist the notification
   */
  const showNotification = useCallback(({ message, severity = 'info', autoHideDuration = 6000, persist = false }) => {
    setNotification({
      open: true,
      message,
      severity,
      autoHideDuration: persist ? null : autoHideDuration,
    });
  }, []); 

  /**
   * Show a success notification
   * @param {string} message - The success message
   * @param {Object} options - Additional options
   */
  const showSuccess = useCallback((message, options = {}) => {
    showNotification({ message, severity: 'success', ...options });
  }, [showNotification]);

  /**
   * Show an error notification
   * @param {string} message - The error message
   * @param {Object} options - Additional options
   */
  const showError = useCallback((message, options = {}) => {
    showNotification({ message, severity: 'error', ...options });
  }, [showNotification]);

  /**
   * Show a warning notification
   * @param {string} message - The warning message
   * @param {Object} options - Additional options
   */
  const showWarning = useCallback((message, options = {}) => {
    showNotification({ message, severity: 'warning', ...options });
  }, [showNotification]);

  /**
   * Show an info notification
   * @param {string} message - The info message
   * @param {Object} options - Additional options
   */
  const showInfo = useCallback((message, options = {}) => {
    showNotification({ message, severity: 'info', ...options });
  }, [showNotification]);

  /**
   * Close the notification
   */
  const closeNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      open: false,
    }));
  }, []);

  return {
    notification,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeNotification,
  };
};

/**
 * Notification component
 * @param {Object} props - Component props
 * @param {Object} props.notification - Notification state
 * @param {Function} props.onClose - Close handler
 */
export const Notification = ({ notification, onClose }) => {
  const { open, message, severity, autoHideDuration } = notification;

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={onClose}
        severity={severity}
        sx={{ width: '100%' }}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

// Re-export for convenience
export default {
  useNotifications,
  Notification,
};
