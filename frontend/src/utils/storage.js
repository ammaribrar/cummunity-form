/**
 * Get an item from localStorage
 * @param {string} key - The key to get from localStorage
 * @param {*} defaultValue - The default value to return if the key doesn't exist
 * @returns {*} The stored value or defaultValue
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Set an item in localStorage
 * @param {string} key - The key to set in localStorage
 * @param {*} value - The value to store
 * @returns {void}
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
  }
};

/**
 * Remove an item from localStorage
 * @param {string} key - The key to remove from localStorage
 * @returns {void}
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
  }
};

/**
 * Clear all items from localStorage
 * @returns {void}
 */
export const clear = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Auth token management
 */
export const authToken = {
  /**
   * Get the authentication token
   * @returns {string|null} The auth token or null if not found
   */
  get: () => getItem('token', null),
  
  /**
   * Set the authentication token
   * @param {string} token - The auth token to store
   * @returns {void}
   */
  set: (token) => setItem('token', token),
  
  /**
   * Remove the authentication token
   * @returns {void}
   */
  remove: () => removeItem('token'),
};

/**
 * User preferences management
 */
export const preferences = {
  /**
   * Get all user preferences
   * @returns {Object} The user preferences
   */
  getAll: () => getItem('preferences', {}),
  
  /**
   * Get a specific preference
   * @param {string} key - The preference key
   * @param {*} defaultValue - The default value if the preference doesn't exist
   * @returns {*} The preference value or defaultValue
   */
  get: (key, defaultValue = null) => {
    const prefs = preferences.getAll();
    return key in prefs ? prefs[key] : defaultValue;
  },
  
  /**
   * Set a preference
   * @param {string} key - The preference key
   * @param {*} value - The preference value
   * @returns {void}
   */
  set: (key, value) => {
    const prefs = preferences.getAll();
    prefs[key] = value;
    setItem('preferences', prefs);
  },
  
  /**
   * Remove a preference
   * @param {string} key - The preference key to remove
   * @returns {void}
   */
  remove: (key) => {
    const prefs = preferences.getAll();
    if (key in prefs) {
      delete prefs[key];
      setItem('preferences', prefs);
    }
  },
  
  /**
   * Clear all preferences
   * @returns {void}
   */
  clear: () => {
    setItem('preferences', {});
  },
};

/**
 * Theme preference management
 */
export const theme = {
  /**
   * Get the current theme preference
   * @returns {string} The theme preference ('light' or 'dark')
   */
  get: () => preferences.get('theme', 'light'),
  
  /**
   * Set the theme preference
   * @param {string} themeName - The theme name ('light' or 'dark')
   * @returns {void}
   */
  set: (themeName) => {
    if (['light', 'dark'].includes(themeName)) {
      preferences.set('theme', themeName);
      
      // Update the HTML class for dark mode
      const html = document.documentElement;
      if (themeName === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  },
  
  /**
   * Toggle between light and dark theme
   * @returns {string} The new theme name
   */
  toggle: () => {
    const currentTheme = theme.get();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    theme.set(newTheme);
    return newTheme;
  },
};

// Initialize theme on load
if (typeof window !== 'undefined') {
  // Apply the saved theme or default to light
  const savedTheme = theme.get();
  theme.set(savedTheme);
}
