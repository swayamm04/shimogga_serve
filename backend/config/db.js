require('dotenv').config();
const mongoose = require('mongoose');

let mongoServerInstance = null;

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('MONGO_URI is not defined in environment variables.');
    return tryFallbackMongo();
  }

  try {
    console.log('Attempting to connect to MongoDB Atlas at provided MONGO_URI...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log(` MongoDB Connected to Atlas: ${mongoose.connection.host} / ${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (err) {
    console.warn(`! MongoDB Atlas connection failed (${err.message}).`);
    console.warn('-> This usually happens if the Atlas cluster is paused or DNS is unreachable.');
    console.warn('-> Initializing resilient Mongo server for smooth local development...');
    return tryFallbackMongo();
  }
}

async function tryFallbackMongo() {
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    if (!mongoServerInstance) {
      mongoServerInstance = await MongoMemoryServer.create();
    }
    const fallbackUri = mongoServerInstance.getUri();
    await mongoose.connect(fallbackUri);
    console.log(` MongoDB connected to in-memory instance: ${fallbackUri}`);
    return mongoose.connection;
  } catch (fallbackErr) {
    console.error('Failed to start in-memory Mongo server:', fallbackErr.message);
    throw fallbackErr;
  }
}

module.exports = { connectDB };
