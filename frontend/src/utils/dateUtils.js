import { formatDistanceToNow, format, parseISO } from 'date-fns';

/**
 * Format a date to a relative time string (e.g., "2 hours ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

/**
 * Format a date to a specific format
 * @param {string|Date} date - The date to format
 * @param {string} formatStr - The format string (default: 'MMM d, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Format a date to a readable date and time string
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy h:mm a');
};

/**
 * Format a date to a time string (e.g., "2:30 PM")
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
};

/**
 * Check if a date is today
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Format a date to a short relative time if today, otherwise format as date
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatShortDate = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return format(dateObj, 'h:mm a');
  }
  
  const now = new Date();
  const diffDays = Math.floor((now - dateObj) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return format(dateObj, 'EEEE'); // Day of the week
  } else if (dateObj.getFullYear() === now.getFullYear()) {
    return format(dateObj, 'MMM d'); // Month and day
  } else {
    return format(dateObj, 'MMM d, yyyy'); // Full date
  }
};
