# Chatbot Backend Setup Guide

## Architecture Overview

**Neon (PostgreSQL)**: Store conversation history, user sessions, analytics
**MongoDB**: Store AI training data, FAQs, knowledge base, quick responses

## 1. Database Setup

### Neon (PostgreSQL) Schema

```sql
-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  started_at TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active' -- active, closed, archived
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  message_text TEXT NOT NULL,
  sender VARCHAR(10) NOT NULL, -- 'user' or 'bot'
  created_at TIMESTAMP DEFAULT NOW(),
  intent VARCHAR(100), -- detected intent (pricing, services, contact, etc.)
  confidence_score DECIMAL(3,2)
);

-- Analytics table
CREATE TABLE chat_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  event_type VARCHAR(50), -- message_sent, conversation_started, lead_captured
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_conversations_session ON conversations(session_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_analytics_conversation ON chat_analytics(conversation_id);
```

### MongoDB Collections

```javascript
// knowledge_base collection
{
  _id: ObjectId,
  category: "services" | "pricing" | "process" | "technical" | "general",
  question: "What services do you offer?",
  answer: "We offer Enterprise Web Applications, Security & Compliance...",
  keywords: ["services", "offerings", "what do you do"],
  priority: 1-10,
  createdAt: Date,
  updatedAt: Date
}

// quick_responses collection
{
  _id: ObjectId,
  trigger: "hello" | "hi" | "pricing" | "contact",
  response: "Hi! 👋 I'm Siklab AI Assistant...",
  followUp: ["services", "pricing", "contact"],
  language: "en"
}

// training_data collection
{
  _id: ObjectId,
  input: "how much does a website cost",
  intent: "pricing",
  entities: ["website"],
  response_template: "pricing_inquiry",
  variations: ["cost of website", "website price"]
}
```

## 2. Backend API Setup (Node.js + Express)

### Install Dependencies

```bash
npm install express @neondatabase/serverless mongodb dotenv openai
```

### Environment Variables (.env)

```env
# Neon PostgreSQL
NEON_DATABASE_URL=postgresql://user:password@host/database

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/siklab-chatbot

# OpenAI (optional, for enhanced AI)
OPENAI_API_KEY=your_openai_key

# Server
PORT=3001
```

### API Endpoints (api/chat/route.ts or server.js)

```typescript
// POST /api/chat
import { neon } from '@neondatabase/serverless';
import { MongoClient } from 'mongodb';

const sql = neon(process.env.NEON_DATABASE_URL);
const mongoClient = new MongoClient(process.env.MONGODB_URI);

export async function POST(request: Request) {
  const { message, conversationId } = await request.json();
  
  try {
    // 1. Get or create conversation
    let sessionId = conversationId;
    if (!sessionId) {
      const [conv] = await sql`
        INSERT INTO conversations (session_id) 
        VALUES (${crypto.randomUUID()}) 
        RETURNING session_id
      `;
      sessionId = conv.session_id;
    }

    // 2. Save user message to Neon
    await sql`
      INSERT INTO messages (conversation_id, message_text, sender)
      SELECT id, ${message}, 'user'
      FROM conversations WHERE session_id = ${sessionId}
    `;

    // 3. Find response from MongoDB knowledge base
    const db = mongoClient.db('siklab-chatbot');
    const response = await findBestResponse(db, message);

    // 4. Save bot response to Neon
    await sql`
      INSERT INTO messages (conversation_id, message_text, sender, intent)
      SELECT id, ${response.text}, 'bot', ${response.intent}
      FROM conversations WHERE session_id = ${sessionId}
    `;

    // 5. Update conversation timestamp
    await sql`
      UPDATE conversations 
      SET last_message_at = NOW() 
      WHERE session_id = ${sessionId}
    `;

    return Response.json({
      response: response.text,
      conversationId: sessionId,
      intent: response.intent
    });

  } catch (error) {
    console.error('Chat error:', error);
    return Response.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

async function findBestResponse(db, message: string) {
  const lowerMessage = message.toLowerCase();
  
  // Check for quick responses first
  const quickResponse = await db.collection('quick_responses').findOne({
    trigger: { $regex: lowerMessage, $options: 'i' }
  });
  
  if (quickResponse) {
    return { text: quickResponse.response, intent: quickResponse.trigger };
  }
  
  // Search knowledge base
  const kbResponse = await db.collection('knowledge_base')
    .find({ keywords: { $in: lowerMessage.split(' ') } })
    .sort({ priority: -1 })
    .limit(1)
    .toArray();
  
  if (kbResponse.length > 0) {
    return { 
      text: kbResponse[0].answer, 
      intent: kbResponse[0].category 
    };
  }
  
  // Default response
  return { 
    text: "I'd be happy to help! Could you provide more details, or would you like to speak with our team directly? You can reach us at contact@siklabsolutions.com",
    intent: 'unknown'
  };
}
```

## 3. Seed MongoDB with Initial Data

```javascript
// seed-chatbot.js
const { MongoClient } = require('mongodb');

async function seedDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('siklab-chatbot');

  // Quick responses
  await db.collection('quick_responses').insertMany([
    {
      trigger: 'hello',
      response: "Hi! 👋 I'm Siklab AI Assistant. How can I help ignite your digital transformation today?",
      followUp: ['services', 'pricing', 'process'],
      language: 'en'
    },
    {
      trigger: 'pricing',
      response: "Our pricing varies based on project scope and complexity. We offer custom quotes tailored to your needs. Would you like to schedule a free consultation?",
      followUp: ['contact', 'services'],
      language: 'en'
    }
  ]);

  // Knowledge base
  await db.collection('knowledge_base').insertMany([
    {
      category: 'services',
      question: 'What services do you offer?',
      answer: 'We offer three main services: 1) Enterprise Web Applications - Custom platforms and SaaS solutions, 2) Security & Compliance - OWASP-aware secure architecture, 3) Managed Maintenance - 24/7 monitoring and support.',
      keywords: ['services', 'offerings', 'what do you do', 'capabilities'],
      priority: 10
    },
    {
      category: 'process',
      question: 'What is your development process?',
      answer: 'Our process includes: Discovery (understanding your needs), Design (creating solutions), Development (building with security-first approach), Testing (ensuring quality), Launch (deploying to production), and Support (ongoing maintenance).',
      keywords: ['process', 'workflow', 'how do you work', 'methodology'],
      priority: 8
    },
    {
      category: 'contact',
      question: 'How can I contact you?',
      answer: "You can reach us at contact@siklabsolutions.com or use our contact form. We typically respond within 24 hours!",
      keywords: ['contact', 'reach', 'email', 'phone', 'get in touch'],
      priority: 9
    }
  ]);

  console.log('Database seeded successfully!');
  await client.close();
}

seedDatabase().catch(console.error);
```

## 4. Next Steps

1. **Setup Neon Database**: Create account at neon.tech and get connection string
2. **Setup MongoDB**: Create cluster at mongodb.com/atlas
3. **Run migrations**: Execute SQL schema in Neon console
4. **Seed MongoDB**: Run `node seed-chatbot.js`
5. **Create API routes**: Set up Express server or Next.js API routes
6. **Test locally**: Test chat flow end-to-end
7. **Deploy**: Deploy backend to Vercel/Railway/Render

## 5. Enhancement Options

- **Add OpenAI**: For more intelligent responses
- **Lead capture**: Store email when user wants to be contacted
- **Sentiment analysis**: Track user satisfaction
- **Analytics dashboard**: View conversation metrics
- **Multi-language**: Support multiple languages
- **File uploads**: Allow users to share files
