import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '../middleware/auth.js';
import { sessionValidation } from '../middleware/validation.js';
import { getPostgresPool } from '../config/database.js';

const router = express.Router();

// Create new chat session
router.post('/session', sessionValidation, async (req, res) => {
  try {
    const sessionId = uuidv4();
    const { userId = null, metadata = {} } = req.body;
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const pool = getPostgresPool();
    
    // Generate JWT token (doesn't require database)
    const token = generateToken(sessionId, userId);

    // If PostgreSQL is available, save to database
    if (pool) {
      try {
        const result = await pool.query(
          `INSERT INTO conversations (session_id, started_at)
           VALUES ($1, NOW())
           RETURNING id, session_id, started_at`,
          [sessionId]
        );

        res.status(201).json({
          success: true,
          session: {
            id: result.rows[0].id,
            sessionId: result.rows[0].session_id,
            startedAt: result.rows[0].started_at
          },
          token
        });
      } catch (dbError) {
        console.error('Database session creation error:', dbError);
        // Fall back to returning session without database record
        res.status(201).json({
          success: true,
          session: {
            sessionId,
            startedAt: new Date().toISOString()
          },
          token
        });
      }
    } else {
      // PostgreSQL not available, return session in-memory only
      res.status(201).json({
        success: true,
        session: {
          sessionId,
          startedAt: new Date().toISOString()
        },
        token
      });
    }
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create session',
      message: error.message 
    });
  }
});

export default router;
