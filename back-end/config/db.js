import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn('MONGO_URI is not configured; using the local JSON data fallback.');
    return { connected: false, error: 'MONGO_URI is not configured' };
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000 // 5 sec connection timeout
    });
    console.log(`====================================================`);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}`);
    console.log(`====================================================`);
    return { connected: true, host: conn.connection.host };
  } catch (error) {
    console.warn(`⚠️ MongoDB Atlas Connection Warning: ${error.message}`);
    console.warn(`ℹ️ Operating with hybrid in-memory GeoJSON database fallback.`);
    return { connected: false, error: error.message };
  }
};
