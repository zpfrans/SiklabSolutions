import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '../middleware/auth.js';
import { chatMessageValidation } from '../middleware/validation.js';
import { getPostgresPool, getMongoDB } from '../config/database.js';
import { generateAIResponse, checkAIHealthStatus } from '../services/aiService.js';
import { findBestResponse } from '../services/knowledgeBase.js';

const router = express.Router();

/**
 * Health check endpoint - verify AI services availability
 * GET /api/chat/health
 */
router.get('/health', async (req, res) => {
  try {
    const status = await checkAIHealthStatus();
    const statusCode = status.anyAvailable ? 200 : 503;
    
    res.status(statusCode).json({
      status: status.anyAvailable ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        gemini: status.gemini,
        claude: status.claude,
        gpt: status.gpt,
      },
      message: status.anyAvailable 
        ? '✅ At least one AI service is available'
        : '❌ No AI services available - check API keys'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Send chat message (protected route)
router.post('/message', verifyToken, chatMessageValidation, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { message } = req.body;
    const { sessionId } = req.session;
    
    const pool = getPostgresPool();
    const mongodb = getMongoDB();

    // Get conversation ID
    const convResult = await pool.query(
      'SELECT id FROM conversations WHERE session_id = $1',
      [sessionId]
    );

    if (convResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Session not found',
        message: 'Please create a new session' 
      });
    }

    const conversationId = convResult.rows[0].id;

    // Save user message to PostgreSQL
    try {
      await pool.query(
        `INSERT INTO messages (conversation_id, message_text, sender, created_at)
         VALUES ($1, $2, 'user', NOW())`,
        [conversationId, message]
      );
    } catch (dbError) {
      console.warn('Could not save user message to DB:', dbError.message);
    }

    // 1. Try to find response in knowledge base (MongoDB) - skip if not connected
    let botResponse;
    let responseSource = 'ai_model';
    
    if (mongodb) {
      try {
        botResponse = await findBestResponse(message, mongodb);
        if (botResponse) {
          responseSource = 'knowledge_base';
        }
      } catch (kbError) {
        console.warn('Knowledge base error:', kbError.message);
      }
    }

    // 2. If no match, use AI service (OpenAI/Anthropic/Gemini)
    if (!botResponse) {
      try {
        console.log('🤖 Calling AI service for message:', message.substring(0, 50) + '...');
        botResponse = await generateAIResponse(message, sessionId, mongodb);
        responseSource = 'ai_model';
        console.log('✅ AI response generated successfully');
      } catch (aiError) {
        console.error('❌ AI service error:', aiError.message);
        console.error('Stack:', aiError.stack);
        // Fallback response
        botResponse = "Thank you for your message! We're currently processing your question. Our team at contact@siklabitsolutions.com will get back to you shortly, or feel free to message us on our Facebook page.";
        responseSource = 'fallback';
      }
    }

    // Save bot response to PostgreSQL (non-critical)
    try {
      await pool.query(
        `INSERT INTO messages (conversation_id, message_text, sender, created_at)
         VALUES ($1, $2, 'bot', NOW())`,
        [conversationId, botResponse]
      );
    } catch (dbError) {
      console.warn('Could not save bot message to DB:', dbError.message);
    }

    // Log analytics (non-critical)
    const responseTime = Date.now() - startTime;
    try {
      await pool.query(
        `INSERT INTO chat_analytics 
         (conversation_id, event_type, event_data, created_at)
         VALUES ($1, 'message_sent', $2, NOW())`,
        [conversationId, JSON.stringify({
          user_message: message,
          bot_response: botResponse,
          response_time_ms: responseTime,
          response_source: responseSource
        })]
      );
    } catch (analyticsError) {
      console.warn('Could not log analytics:', analyticsError.message);
    }

    res.json({
      success: true,
      message: botResponse,
      metadata: {
        responseTime: responseTime,
        source: responseSource,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      message: error.message 
    });
  }
});

// Get conversation history (protected route)
router.get('/history', verifyToken, async (req, res) => {
  try {
    const { sessionId } = req.session;
    const pool = getPostgresPool();

    const result = await pool.query(
      `SELECT m.sender, m.message_text as content, m.created_at as timestamp
       FROM messages m
       JOIN conversations c ON m.conversation_id = c.id
       WHERE c.session_id = $1
       ORDER BY m.created_at ASC`,
      [sessionId]
    );

    res.json({
      success: true,
      history: result.rows
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch history',
      message: error.message 
    });
  }
});

export default router;
