import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.js';
import authRoutes from './routes/auth.js';
import { connectPostgres, connectMongoDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { 
  requestIdMiddleware, 
  timeoutMiddleware, 
  validateRequest,
  xssProtection,
  sqlInjectionProtection,
  corsHeaderValidator,
  requestSizeLimiter,
  securityLogger,
  connectionMonitor,
  globalLimiter,
  formSubmissionLimiter
} from './middleware/security.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;
let server;

// Lightweight Health Check - No middleware
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS Configuration - Define first, before using in middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.FRONTEND_URL,
  // Add your Vercel frontend URLs here after deployment
].filter(Boolean);

// Advanced Security Middleware
app.use(requestIdMiddleware); // Track all requests with unique ID
// Removed: timeout middleware was causing all API requests to timeout
app.use(securityLogger); // Log security-related events
app.use(xssProtection); // Protect against XSS attacks
app.use(sqlInjectionProtection); // Protect against SQL injection
app.use(corsHeaderValidator(allowedOrigins)); // Validate CORS headers
app.use(requestSizeLimiter(100)); // Limit request size to 100KB

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin.includes(allowed) || allowed.includes(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Chat rate limiter - less restrictive for better UX
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // allow up to 100 chat messages per minute (was 20)
  message: 'Too many chat messages, please slow down.',
  skip: (req) => req.path === '/api/chat/health', // Don't rate limit health checks
});

app.use('/api/', limiter);
app.use('/api/chat', chatLimiter);

// Body Parser & Security
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(validateRequest); // Advanced request validation
app.use(compression()); // Compress responses

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Database Connections
await connectPostgres();
await connectMongoDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

// Start Server
server = app.listen(PORT, () => {
  console.log(`🚀 Secure server running on port ${PORT}`);
  console.log(`🔒 Security features enabled: Helmet, CORS, Rate Limiting, Input Sanitization`);
  console.log(`📊 Advanced protections: Request tracking, Timeout handling, Injection prevention`);
  connectionMonitor(app); // Start monitoring connection/memory
});

// Graceful Shutdown Handler
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('❌ Forced shutdown - timeout exceeded');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

export default app;
