const mongoose = require('mongoose');
require('dotenv').config();
const Post = require('../models/Post');
const User = require('../models/User');

async function testPostCreation() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find a test user
    const testUser = await User.findOne();
    if (!testUser) {
      console.log('No users found. Please create a user first.');
      process.exit(1);
    }

    console.log('\nTest user found:');
    console.log(`- ID: ${testUser._id}`);
    console.log(`- Username: ${testUser.username}`);
    console.log(`- Email: ${testUser.email}`);

    // Create a test post
    const testPost = {
      title: 'Test Post',
      content: 'This is a test post created by the test script.',
      author: testUser._id,
      tags: ['test', 'automated'],
    };

    console.log('\nCreating test post...');
    const post = await Post.create(testPost);
    console.log('✅ Test post created successfully!');
    console.log('\nPost details:');
    console.log(`- ID: ${post._id}`);
    console.log(`- Title: ${post.title}`);
    console.log(`- Author: ${post.author}`);
    console.log(`- Created At: ${post.createdAt}`);

    // Find the post with author populated
    const foundPost = await Post.findById(post._id).populate('author', 'username email');
    console.log('\nFound post with populated author:');
    console.log(JSON.stringify(foundPost, null, 2));

    // Count total posts
    const postCount = await Post.countDocuments();
    console.log(`\nTotal posts in database: ${postCount}`);

    // List all posts
    const allPosts = await Post.find().populate('author', 'username').lean();
    console.log('\nAll posts:');
    console.log(JSON.stringify(allPosts, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  }
}

testPostCreation();
