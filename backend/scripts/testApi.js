const axios = require('axios');
require('dotenv').config();

async function testPostCreation() {
  try {
    // Replace with a valid JWT token from your frontend after login
    const authToken = 'YOUR_JWT_TOKEN_HERE';
    
    if (!authToken) {
      console.error('Please provide a valid JWT token');
      process.exit(1);
    }

    // Test post data
    const postData = {
      title: 'Test Post from API',
      content: 'This is a test post created via the API',
      tags: ['test', 'api'],
      isPublished: true
    };

    console.log('Creating test post...');
    console.log('Post data:', postData);

    const response = await axios.post('http://localhost:5000/api/v1/posts', postData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ Post created successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error creating post:');
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received');
      console.error('Request:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
    }
  }
}

testPostCreation();
