import crypto from 'crypto';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

// --- 1. Request ID & Timeout ---

export const requestIdMiddleware = (req, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
};

export const timeoutMiddleware = (timeout = 30000) => {
  return (req, res, next) => {
    const timeoutId = setTimeout(() => {
      const err = new Error('Request timeout');
      err.statusCode = 408;
      next(err);
    }, timeout);

    res.on('finish', () => clearTimeout(timeoutId));
    res.on('close', () => clearTimeout(timeoutId));
    
    next();
  };
};

// --- 2. Schema-Based Validation (Replaces Regex) ---

// Contact form validation
const contactFormSchema = z.object({
  name: z.string().min(2, "Name is too short").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message too short").max(2000, "Message too long")
}).strict();

// Chat message validation
const chatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(5000, "Message too long"),
  sessionId: z.string().optional(),
  saveSettings: z.boolean().optional()
}).strict();

export const validateContactRequest = (req, res, next) => {
  try {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        return res.status(415).json({ 
          error: 'Invalid Content-Type. Must be application/json',
          requestId: req.id 
        });
      }
    }

    // Parse and sanitize the body
    req.body = contactFormSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn(`Validation failed - ID: ${req.id}, IP: ${req.ip}`);
      return res.status(400).json({
        error: 'Invalid request data',
        details: error.errors.map(e => ({ field: e.path[0], message: e.message })),
        requestId: req.id
      });
    }
    next(error);
  }
};

/**
 * Generic validation middleware - validates chat messages
 * Used for /api/chat/message endpoint
 */
export const validateChatMessage = (req, res, next) => {
  try {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        return res.status(415).json({ 
          error: 'Invalid Content-Type. Must be application/json',
          requestId: req.id 
        });
      }
    }

    // Parse and sanitize the chat message
    req.body = chatMessageSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn(`Chat validation failed - ID: ${req.id}, IP: ${req.ip}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid message format',
        details: error.errors.map(e => ({ field: e.path[0], message: e.message })),
        requestId: req.id
      });
    }
    next(error);
  }
};

/**
 * Generic validation middleware factory - create validators for any schema
 * Usage: app.post('/endpoint', validateRequest(mySchema), handler)
 */
export const validateRequest = (schema = null) => {
  return (req, res, next) => {
    try {
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const contentType = req.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          return res.status(415).json({ 
            error: 'Invalid Content-Type. Must be application/json',
            requestId: req.id 
          });
        }
      }

      // If no schema provided, just validate JSON structure
      if (schema) {
        req.body = schema.parse(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.warn(`Validation failed - ID: ${req.id}, IP: ${req.ip}`);
        return res.status(400).json({
          error: 'Invalid request data',
          details: error.errors.map(e => ({ field: e.path[0], message: e.message })),
          requestId: req.id
        });
      }
      next(error);
    }
  };
};

// --- 3. Rate Limiting ---

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

export const formSubmissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 submissions per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Maximum submissions reached. Please try again later.' }
});

// --- 4. Logging & Monitoring ---

export const securityLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const isError = res.statusCode >= 400;

    const logData = {
      requestId: req.id,
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      ...(isError && { bodySize: JSON.stringify(req.body || {}).length })
    };

    if (isError || duration > 5000) {
      console.warn('HTTP Log:', logData);
    }
  });

  next();
};

export const connectionMonitor = () => {
  const monitorId = setInterval(() => {
    const memUsage = process.memoryUsage();
    const threshold = 0.8; // 80% of heap

    // Fixed: using heapTotal instead of heapLimit
    if (memUsage.heapUsed / memUsage.heapTotal > threshold) {
      console.warn('⚠️ High memory usage detected:', {
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        timestamp: new Date().toISOString()
      });
    }
  }, 30000);

  // Return function to stop monitoring if needed
  return () => clearInterval(monitorId);
};

/**
 * XSS Prevention - Sanitize request headers and values
 * Detects common XSS patterns in user input
 */
export const xssProtection = (req, res, next) => {
  const xssPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi
  ];

  const checkValue = (val) => {
    if (typeof val !== 'string') return false;
    return xssPatterns.some(pattern => pattern.test(val));
  };

  // Check body
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (checkValue(req.body[key])) {
        console.warn(`🚨 XSS attempt detected - ID: ${req.id}, Field: ${key}, IP: ${req.ip}`);
        return res.status(400).json({
          error: 'Invalid characters detected in request',
          requestId: req.id
        });
      }
    }
  }

  next();
};

/**
 * SQL Injection Prevention - Detect common SQL injection patterns
 */
export const sqlInjectionProtection = (req, res, next) => {
  const sqlPatterns = [
    /('|(--)|;|\/\*|\*\/|xp_|sp_)/gi,
    /(union|select|insert|update|delete|drop|create|alter)/gi,
    /(and|or|1=1|1=0)/gi
  ];

  const checkValue = (val) => {
    if (typeof val !== 'string') return false;
    // Only flag if multiple SQL keywords detected
    const matches = val.match(sqlPatterns) || [];
    return matches.length > 2;
  };

  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (checkValue(req.body[key])) {
        console.warn(`🚨 SQL injection attempt detected - ID: ${req.id}, Field: ${key}, IP: ${req.ip}`);
        return res.status(400).json({
          error: 'Suspicious SQL patterns detected',
          requestId: req.id
        });
      }
    }
  }

  next();
};

/**
 * CORS header validator - Ensures Origin header is legitimate
 */
export const corsHeaderValidator = (allowedOrigins = []) => {
  return (req, res, next) => {
    const origin = req.get('Origin');
    if (origin && !allowedOrigins.includes(origin)) {
      console.warn(`⚠️ Suspicious origin header - ID: ${req.id}, Origin: ${origin}, IP: ${req.ip}`);
    }
    next();
  };
};

/**
 * Request size limiter - Prevent large payload attacks
 */
export const requestSizeLimiter = (maxSizeKb = 100) => {
  return (req, res, next) => {
    const contentLength = parseInt(req.get('Content-Length') || '0', 10);
    const maxSizeBytes = maxSizeKb * 1024;

    if (contentLength > maxSizeBytes) {
      console.warn(`🚨 Request size exceeded - ID: ${req.id}, Size: ${contentLength}, Max: ${maxSizeBytes}, IP: ${req.ip}`);
      return res.status(413).json({
        error: `Request too large. Maximum ${maxSizeKb}KB allowed`,
        requestId: req.id
      });
    }

    next();
  };
};