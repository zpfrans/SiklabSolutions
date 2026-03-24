import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

const DATABASE_URL = process.env.NEON_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ NEON_DATABASE_URL is not set in .env file');
  process.exit(1);
}

console.log('🔄 Starting database migration...');
console.log('📍 Connecting to Neon PostgreSQL...\n');

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  let client;
  try {
    // Test connection
    client = await pool.connect();
    console.log('✅ Connected to Neon PostgreSQL successfully!');
    
    // Read migration file
    const migrationFile = join(__dirname, '001_ai_assistant_schema.sql');
    const migrationSQL = readFileSync(migrationFile, 'utf8');
    
    console.log('📄 Loading migration file...');
    console.log(`📍 File: ${migrationFile}\n`);
    
    // Execute migration
    console.log('⏳ Running migration...\n');
    const result = await client.query(migrationSQL);
    
    console.log('\n✅ Migration completed successfully!');
    console.log('📊 Schema created:');
    console.log('   ✓ users (user accounts)');
    console.log('   ✓ conversations (chat sessions)');
    console.log('   ✓ messages (chat history)');
    console.log('   ✓ knowledge_base (company knowledge)');
    console.log('   ✓ quick_responses (pre-written responses)');
    console.log('   ✓ feedback (user ratings)');
    console.log('   ✓ audit_logs (activity tracking)');
    console.log('   ✓ Indexes (for performance)');
    console.log('   ✓ Views (analytics queries)');
    console.log('\n🎉 Your AI Assistant database is ready!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error('Error:', error.message);
    if (error.detail) {
      console.error('Details:', error.detail);
    }
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

runMigration();
