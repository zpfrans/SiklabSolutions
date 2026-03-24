import pg from 'pg';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const { Pool } = pg;

// PostgreSQL Connection Pool (Optional - will skip if not available)
let pgPool;

export const connectPostgres = async () => {
  try {
    if (!process.env.POSTGRES_URL && !process.env.NEON_DATABASE_URL) {
      console.log('⚠️  PostgreSQL not configured - skipping PostgreSQL connection');
      return null;
    }

    pgPool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20, // Maximum pool size
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test connection
    const client = await pgPool.connect();
    console.log('✅ PostgreSQL (Neon) connected successfully');
    client.release();
    
    return pgPool;
  } catch (error) {
    console.error('⚠️  PostgreSQL connection error:', error.message);
    console.log('⚠️  Continuing without PostgreSQL - MongoDB-only mode');
    pgPool = null; // Set to null instead of exiting
    return null;
  }
};

export const getPostgresPool = () => {
  if (!pgPool) {
    return null; // Return null instead of throwing error
  }
  return pgPool;
};

// MongoDB Connection
let mongoClient;
let mongoDB;

export const connectMongoDB = async () => {
  try {
    mongoClient = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await mongoClient.connect();
    mongoDB = mongoClient.db('siklab_chatbot');
    
    console.log('✅ MongoDB connected successfully');
    
    // Create indexes for better performance
    await mongoDB.collection('knowledge_base').createIndex({ question: 'text', answer: 'text' });
    await mongoDB.collection('knowledge_base').createIndex({ category: 1 });
    await mongoDB.collection('quick_responses').createIndex({ trigger: 1 });
    
    return mongoDB;
  } catch (error) {
    console.error('⚠️  MongoDB connection error:', error.message);
    console.log('⚠️  Falling back to Gemini AI service only (MongoDB is optional)');
    mongoDB = null; // Set to null instead of exiting
    return null;
  }
};

export const getMongoDB = () => {
  return mongoDB; // Return null if not connected, instead of throwing error
};

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  if (pgPool) await pgPool.end();
  if (mongoClient) await mongoClient.close();
  process.exit(0);
});
