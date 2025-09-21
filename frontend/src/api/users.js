import api from '../utils/api';

// Get current user profile
const getProfile = async () => {
  try {
    const response = await api.get('/v1/users/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update profile
const updateProfile = async (userData) => {
  try {
    const response = await api.put('/v1/users/me/update', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update password
const updatePassword = async ({ currentPassword, newPassword }) => {
  try {
    const response = await api.put('/v1/users/me/updatepassword', {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Get all users
const getUsers = async () => {
  try {
    const response = await api.get('/v1/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Get user by ID
const getUser = async (id) => {
  try {
    const response = await api.get(`/v1/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Update user
const updateUser = async ({ id, ...userData }) => {
  try {
    const response = await api.put(`/v1/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Delete user
const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/v1/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  getProfile,
  updateProfile,
  updatePassword,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
