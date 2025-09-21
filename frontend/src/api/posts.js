import api from '../utils/api';

// Get all posts
const getPosts = async (params = {}) => {
  try {
    const response = await api.get('/api/v1/posts', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error.response?.data || error.message;
  }
};

// Get single post
const getPost = async (id) => {
  try {
    const response = await api.get(`/api/v1/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

// Create post
const createPost = async (postData) => {
  try {
    console.log('Creating post with data:', postData);
    
    // Prepare the post data
    const postPayload = {
      title: postData.title,
      content: postData.content,
      tags: postData.tags || [],
      isPublished: postData.isPublished !== false, // Default to true if not specified
      featuredImage: postData.featuredImage
    };
    
    console.log('Sending post data:', postPayload);
    
    const response = await api.post('/api/v1/posts', postPayload);
    
    console.log('Post created successfully:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Error creating post:', error);
    
    // Extract error message from response if available
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Failed to create post';
    
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: errorMessage
    });
    
    throw new Error(errorMessage);
  }
};

// Update post
const updatePost = async ({ id, ...postData }) => {
  try {
    const response = await api.put(`/api/v1/posts/${id}`, postData);
    return response.data;
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

// Delete post
const deletePost = async (id) => {
  try {
    const response = await api.delete(`/api/v1/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

// Like post
const likePost = async (id) => {
  try {
    const response = await api.put(`/api/v1/posts/${id}/like`);
    return response.data;
  } catch (error) {
    console.error(`Error liking post ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

// Unlike post
const unlikePost = async (id) => {
  try {
    const response = await api.put(`/api/v1/posts/${id}/unlike`);
    return response.data;
  } catch (error) {
    console.error(`Error unliking post ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

export default {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost
};
