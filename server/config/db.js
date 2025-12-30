import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if MONGO_URI is configured
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('your_mongodb')) {
      console.error('⚠️  MongoDB URI not configured!');
      console.error('Please set MONGO_URI in your .env file');
      console.error('The server will start but database operations will fail.');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('⚠️  Server will continue but database operations will fail.');
    console.error('Please check your MONGO_URI in .env file');
  }
};

export default connectDB;

