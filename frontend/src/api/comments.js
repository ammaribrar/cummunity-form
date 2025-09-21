import api from '../utils/api';

// Get comments for a post
const getComments = async (postId) => {
  try {
    const response = await api.get(`/v1/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add comment to post
const addComment = async ({ postId, content }) => {
  try {
    const response = await api.post(`/v1/posts/${postId}/comments`, { content });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update comment
const updateComment = async ({ id, content }) => {
  try {
    const response = await api.put(`/v1/comments/${id}`, { content });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete comment
const deleteComment = async (id) => {
  try {
    const response = await api.delete(`/v1/comments/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Like comment
const likeComment = async (id) => {
  try {
    const response = await api.put(`/v1/comments/${id}/like`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Unlike comment
const unlikeComment = async (id) => {
  try {
    const response = await api.put(`/v1/comments/${id}/unlike`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment
};
