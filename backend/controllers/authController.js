const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  try {
    console.log('Registration request received:', { body: req.body });
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      console.log('Missing required fields:', { username: !!username, email: !!email, password: !!password });
      return next(new ErrorResponse('Please provide all required fields', 400));
    }

    // Basic validation
    if (password.length < 6) {
      return next(new ErrorResponse('Password must be at least 6 characters', 400));
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return next(new ErrorResponse('Please provide a valid email', 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() }, 
        { username: username.toLowerCase() }
      ] 
    });
    
    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
      return next(new ErrorResponse(`User with this ${field} already exists`, 400));
    }

    // Create user
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: password.trim()
    });

    console.log('User created successfully:', { userId: user._id, email: user.email });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue,
      stack: error.stack
    });
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return next(new ErrorResponse(`This ${field} is already in use`, 400));
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return next(new ErrorResponse(messages.join(', '), 400));
    }
    
    next(new ErrorResponse('Registration failed. Please try again later.', 500));
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  console.log('Login attempt for email:', email);

  // Validate email & password
  if (!email || !password) {
    console.log('Missing email or password');
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  try {
    // Check for user
    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    
    if (!user) {
      console.log('No user found with email:', email);
      return next(new ErrorResponse('Invalid credentials', 401));
    }
    
    console.log('User found, checking password...');
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      console.log('Password does not match');
      return next(new ErrorResponse('Invalid credentials', 401));
    }
    
    console.log('Password matches, generating token...');
    
    // Create token and send response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    return next(new ErrorResponse('Login failed. Please try again.', 500));
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  try {
    // Create token
    const token = user.getSignedJwtToken();
    
    // Calculate expiration date (30 days from now)
    const expiresInDays = 30;
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + expiresInDays);
    
    // Basic cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: expiresInDays * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      path: '/'
    };
    
    // Add domain in production if specified
    if (process.env.NODE_ENV === 'production' && process.env.COOKIE_DOMAIN) {
      cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }

    // Remove password from output
    const userObj = user.toObject();
    delete userObj.password;

    // Send response with cookie and user data
    res
      .status(statusCode)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      });
  } catch (error) {
    console.error('Error in sendTokenResponse:', error);
    
    // Try to get a fresh token in case the error was related to token generation
    let token;
    try {
      token = user.getSignedJwtToken();
    } catch (tokenError) {
      console.error('Error generating fallback token:', tokenError);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate authentication token',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // If we can't set the cookie, send token in response body only
    res.status(statusCode).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      message: 'Authentication successful, but there was an issue setting the session cookie',
      warning: 'For security, please ensure cookies are enabled in your browser',
      // Only include error details in development
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
        stack: error.stack
      })
    });
  }
};
