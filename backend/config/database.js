const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB connection string not found in environment variables');
    }

    console.log('Connecting to MongoDB...'.yellow);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.green.bold);
    
    // Connection events for better debugging
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB'.green);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err.message}`.red);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected'.yellow);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`.red);
    console.log('Please check your MongoDB connection string in .env file'.yellow);
    process.exit(1);
  }
};

module.exports = connectDB;
