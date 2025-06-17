import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGO_URI;
    
    // Log the URI being used (without exposing full credentials)
    console.log('Connecting to MongoDB with URI starting with:', 
      mongoURI ? mongoURI.substring(0, mongoURI.indexOf('@') > 0 ? mongoURI.indexOf('@') : 20) + '...' : 'undefined');
    
    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000 // Reduce timeout for faster feedback
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); 
  }
};

export default connectDB;
