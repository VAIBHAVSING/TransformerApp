import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transformerApp';

console.log('Testing MongoDB connection...');
console.log(`Attempting to connect to: ${mongoURI}`);

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    console.log('Your authentication system is ready to use.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('\nPlease make sure that:');
    console.log('1. MongoDB is installed and running on your system');
    console.log('2. The connection URI in the .env file is correct');
    process.exit(1);
  });