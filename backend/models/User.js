const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot be more than 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: 'default-avatar.png',
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  try {
    // Get JWT secret from environment variables
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Set default expiration to 30 days in seconds
    const defaultExpiresIn = 30 * 24 * 60 * 60; // 30 days in seconds
    
    // Check if JWT_EXPIRE is provided and valid
    let expiresIn = defaultExpiresIn;
    if (process.env.JWT_EXPIRE) {
      // Parse the JWT_EXPIRE value
      const match = process.env.JWT_EXPIRE.match(/^(\d+)([smhdwMy])$/);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[2];
        
        // Convert to seconds based on unit
        const multipliers = {
          's': 1,           // seconds
          'm': 60,          // minutes
          'h': 60 * 60,     // hours
          'd': 24 * 60 * 60, // days
          'w': 7 * 24 * 60 * 60, // weeks
          'M': 30 * 24 * 60 * 60, // months (approximate)
          'y': 365 * 24 * 60 * 60 // years (approximate)
        };
        
        if (multipliers[unit]) {
          expiresIn = value * multipliers[unit];
        }
      } else {
        console.warn(`Invalid JWT_EXPIRE format: ${process.env.JWT_EXPIRE}. Using default '30d'`);
      }
    }
    
    // Sign and return the token with numeric expiresIn (in seconds)
    return jwt.sign(
      { 
        id: this._id, 
        role: this.role 
      },
      jwtSecret,
      { 
        expiresIn: expiresIn 
      }
    );
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw new Error('Failed to generate authentication token');
  }
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
