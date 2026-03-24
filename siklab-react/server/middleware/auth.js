import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-secret-change-this-in-production';
const JWT_EXPIRES_IN = '24h';

// Generate JWT token for chat session
export const generateToken = (sessionId, userId = null) => {
  return jwt.sign(
    { 
      sessionId, 
      userId,
      type: 'chat_session',
      timestamp: Date.now()
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'No token provided' 
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach session info to request
    req.session = {
      sessionId: decoded.sessionId,
      userId: decoded.userId
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired', 
        message: 'Please request a new session' 
      });
    }
    return res.status(401).json({ 
      error: 'Invalid token', 
      message: error.message 
    });
  }
};

// Optional: Verify token without throwing error (for public endpoints)
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET);
      req.session = {
        sessionId: decoded.sessionId,
        userId: decoded.userId
      };
    }
  } catch (error) {
    // Continue without authentication
  }
  next();
};
