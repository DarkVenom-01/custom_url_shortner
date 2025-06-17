import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Connection string (partial):', process.env.MONGO_URI.substring(0, process.env.MONGO_URI.indexOf('@')));
    
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Connection successful!');
    console.log('Connected to:', mongoose.connection.host);
    
    // Create a simple test document
    const TestSchema = new mongoose.Schema({ name: String, date: Date });
    const Test = mongoose.model('Test', TestSchema);
    
    await Test.create({ name: 'test', date: new Date() });
    console.log('Test document created successfully');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Connection error:', error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.error('This may be due to network issues or IP restrictions');
    }
    if (error.name === 'MongoError' && error.code === 18) {
      console.error('Authentication failed - username or password is incorrect');
    }
  }
}

testConnection();