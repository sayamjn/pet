const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      retries++;
      console.error(`MongoDB connection error (attempt ${retries}/${maxRetries}):`, error.message);
      
      if (retries === maxRetries) {
        console.error('Failed to connect to MongoDB after maximum retries');
        process.exit(1);
      }
      
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

module.exports = connectDB;
