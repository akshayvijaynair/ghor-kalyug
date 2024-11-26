import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

 
    
    console.log('MongoDB connected successfully');

    // Adding event listeners for additional debugging
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;