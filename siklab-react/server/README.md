# Siklab Solutions - Secure ChatBot Backend

## 🔒 Enterprise-Grade Security Features

This advanced backend implements comprehensive security measures:

- **Helmet**: HTTP security headers (CSP, HSTS, X-Frame-Options)
- **CORS**: Configured cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 min (general), 20 per min (chat)
- **Input Validation**: express-validator with XSS prevention
- **SQL Injection Protection**: Parameterized queries
- **NoSQL Injection Prevention**: mongo-sanitize
- **JWT Authentication**: Secure session-based tokens
- **HPP**: HTTP parameter pollution prevention
- **Compression**: Gzip response compression
- **Request Size Limiting**: 10kb body limit

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Variables

Your `.env` file is already configured with:
- ✅ Neon PostgreSQL connection
- ✅ MongoDB Atlas connection
- ✅ JWT secret
- ⚠️ AI services (optional - add one for AI responses)

To enable AI responses, add ONE of these:

**Option 1: Anthropic Claude (Recommended)**
```
ANTHROPIC_API_KEY=sk-ant-...
```
Get key from: https://console.anthropic.com/

**Option 2: OpenAI GPT**
```
OPENAI_API_KEY=sk-...
```
Get key from: https://platform.openai.com/api-keys

> Without AI keys, chatbot will use knowledge base only

### 3. Seed MongoDB (Already Done!)
```bash
npm run seed
```

### 4. Start Backend Server (Already Running!)
```bash
npm run dev
```

Server runs on: **http://localhost:3001**

## 📡 API Endpoints

### Authentication

**Create Session**
```http
POST /api/auth/session
Content-Type: application/json

{
  "userId": "optional",
  "metadata": {
    "page": "/",
    "referrer": "https://example.com"
  }
}

Response:
{
  "success": true,
  "session": {
    "id": 1,
    "sessionId": "uuid",
    "startedAt": "2024-..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Chat

**Send Message** (Protected)
```http
POST /api/chat/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "What services do you offer?"
}

Response:
{
  "success": true,
  "message": "We offer three main services...",
  "metadata": {
    "responseTime": 245,
    "source": "knowledge_base",
    "timestamp": "2024-..."
  }
}
```

**Get History** (Protected)
```http
GET /api/chat/history
Authorization: Bearer <token>

Response:
{
  "success": true,
  "history": [
    {
      "message_type": "user",
      "content": "Hello",
      "timestamp": "2024-..."
    },
    ...
  ]
}
```

### Health Check
```http
GET /api/health

Response:
{
  "status": "healthy",
  "timestamp": "2024-...",
  "uptime": 1234.56
}
```

## 🗄️ Database Schema

### PostgreSQL (Neon) - Conversation Storage
- `conversations` - Chat sessions
- `messages` - All messages
- `chat_analytics` - Response metrics

### MongoDB - Knowledge Base
- `knowledge_base` - Q&A pairs (10 entries)
- `quick_responses` - Instant replies (4 entries)
- `training_data` - Learning dataset

## 🧠 AI Response Flow

1. **Knowledge Base Lookup** (MongoDB)
   - Checks quick_responses for exact triggers
   - Searches knowledge_base with text search
   - Keyword matching

2. **AI Service** (if no KB match)
   - Claude (Anthropic) - preferred
   - GPT-4 (OpenAI) - fallback
   - Custom system prompt with company context

3. **Fallback Response**
   - Generic helpful message
   - Contact information

## 🛡️ Security Best Practices Implemented

✅ Environment variables for secrets
✅ JWT with expiration (24h)
✅ SQL parameterized queries
✅ Input sanitization & validation
✅ Rate limiting per IP
✅ CORS whitelist
✅ Request size limits
✅ Security headers (Helmet)
✅ Error handling without leaking info
✅ Graceful shutdown
✅ Connection pooling
✅ MongoDB indexes for performance

## 📊 Monitoring

The backend logs:
- All requests (Morgan)
- Database connections
- Rate limit violations
- Authentication failures
- Chat analytics (response time, source)

## 🔧 Development Commands

```bash
# Start with auto-reload
npm run dev

# Start production
npm start

# Reseed database
npm run seed
```

## 🚀 Frontend Integration

The ChatBot component is already updated to:
1. Create session on open
2. Store JWT token
3. Send authenticated requests
4. Handle connection status
5. Show green/yellow indicator

## 📝 Next Steps

1. **Add AI Key** (optional but recommended)
   - Get Anthropic API key for better responses
   - Add to `.env` file
   - Restart backend

2. **Customize Knowledge Base**
   - Edit `server/seed-mongodb.js`
   - Add more Q&A pairs
   - Run `npm run seed`

3. **Test the Chatbot**
   - Open http://localhost:5173
   - Click chat button (bottom right)
   - Try these:
     - "What services do you offer?"
     - "Tell me about your values"
     - "How can I contact you?"

## 🎯 Production Deployment

Before deploying:
1. Change JWT_SECRET to strong random value
2. Set NODE_ENV=production
3. Update FRONTEND_URL to production domain
4. Enable MongoDB IP whitelist restrictions
5. Set up SSL certificates
6. Configure proper logging service
7. Set up monitoring (health check endpoint)

---

## ✅ Status

- [x] Backend server running on port 3001
- [x] PostgreSQL connected (Neon)
- [x] MongoDB connected (Atlas)
- [x] Knowledge base seeded (10 Q&A + 4 quick responses)
- [x] Frontend ChatBot component updated
- [x] Security middleware active
- [ ] AI service configured (optional)

**Everything is ready! The chatbot is now fully functional with secure backend! 🎉**
