const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set. Add a local or MongoDB Atlas connection string to the backend environment.');
  }

  const conn = await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME || 'food_rescue',
    serverSelectionTimeoutMS: 15000,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

module.exports = connectDB;
