const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const TEST_EMAIL = 'test@example.com';
const NEW_PASSWORD = 'test123';

const resetTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB...');
    
    // Find the test user
    const user = await User.findOne({ email: TEST_EMAIL });
    
    if (!user) {
      console.log('Test user not found. Creating a new one...');
      
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);
      
      // Create test user
      const newUser = new User({
        username: 'testuser',
        email: TEST_EMAIL,
        password: hashedPassword,
        role: 'user'
      });
      
      await newUser.save();
      console.log('Test user created successfully!');
    } else {
      // Update existing user's password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(NEW_PASSWORD, salt);
      await user.save();
      console.log('Test user password reset successfully!');
    }
    
    console.log('Test user credentials:');
    console.log('Email:', TEST_EMAIL);
    console.log('Password:', NEW_PASSWORD);
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting test user:', error);
    process.exit(1);
  }
};

resetTestUser();
