const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB...');
    
    // Find test user
    const user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      console.log('Test user not found!');
    } else {
      console.log('Test user found:', {
        _id: user._id,
        email: user.email,
        username: user.username,
        password: user.password, // This should be hashed
        role: user.role,
        createdAt: user.createdAt
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking test user:', error);
    process.exit(1);
  }
};

checkTestUser();
