// lib/dbConnection.ts
// Helper untuk database connection dengan caching

import mongoose from 'mongoose';

let cachedConnection: typeof mongoose | null = null;

export async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || 'digiarchive',
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });

    cachedConnection = connection;
    console.log('Connected to MongoDB');
    return connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export function getConnection() {
  if (!cachedConnection) {
    throw new Error('Database connection not established');
  }
  return cachedConnection;
}

// Cleanup on process exit
process.on('SIGINT', async () => {
  if (cachedConnection) {
    await cachedConnection.disconnect();
    console.log('Disconnected from MongoDB');
  }
  process.exit(0);
});
