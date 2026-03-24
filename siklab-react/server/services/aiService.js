import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

// Initialize AI clients
const geminiKey = process.env.GEMINI_API_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

console.log('🔍 AI Service Configuration:');
console.log('  ✓ GEMINI_API_KEY:', geminiKey ? '✅ Loaded' : '❌ Missing');
console.log('  ✓ ANTHROPIC_API_KEY:', anthropicKey ? '✅ Loaded' : '❌ Missing');
console.log('  ✓ OPENAI_API_KEY:', openaiKey ? '✅ Loaded' : '❌ Missing');

const anthropic = anthropicKey ? new Anthropic({ apiKey: anthropicKey }) : null;
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;
const gemini = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

// System prompt for Siklab Solutions chatbot
const SYSTEM_PROMPT = `You are an AI assistant for Siklab Solutions, a Philippine-based technology company specializing in enterprise web applications, security & compliance, and managed maintenance services.

Company Overview:
- Core Values: Innovation Spark, Fearless Security, Catalyst Partnership, Scalable Foundations, Transparent Velocity
- Services: Enterprise Web Applications, Security & Compliance, Managed Maintenance
- Philosophy: "We don't just code—we architect, secure, and sustain high-performance systems"
- Contact: support@siklabsolutions.com | Facebook: Siklab Solutions

Guidelines:
1. Be professional, helpful, and concise
2. Focus on Siklab Solutions' services and values
3. If asked about pricing, suggest contacting support@siklabsolutions.com
4. For technical questions, provide accurate helpful information
5. Always maintain a friendly but professional tone
6. If you don't know, admit it and offer to connect them with support
7. Response time is critical - be quick and direct`;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const RETRY_BACKOFF = 2;

/**
 * Check if error is retryable
 */
const isRetryableError = (error) => {
  const message = (error.message || '').toLowerCase();
  const code = error.code || error.status;
  
  return (
    code === 408 || code === 429 || code === 500 || code === 502 || code === 503 || code === 504 ||
    message.includes('timeout') ||
    message.includes('econnrefused') ||
    message.includes('enotfound') ||
    message.includes('rate limit') ||
    message.includes('temporarily')
  );
};

/**
 * Retry logic with exponential backoff
 */
const withRetry = async (fn, retries = MAX_RETRIES) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && isRetryableError(error)) {
      const delay = RETRY_DELAY * Math.pow(RETRY_BACKOFF, MAX_RETRIES - retries + 1);
      console.warn(`⚠️ Retry ${MAX_RETRIES - retries + 1}/${MAX_RETRIES} (${delay}ms):`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
};

/**
 * Call Gemini API
 */
const callGemini = async (userMessage) => {
  if (!gemini) throw new Error('Gemini not initialized');
  
  const model = gemini.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent(userMessage);
  const response = result.response;
  
  if (!response.text()) throw new Error('Empty response from Gemini');
  return response.text();
};

/**
 * Call Claude API
 */
const callClaude = async (userMessage) => {
  if (!anthropic) throw new Error('Claude not initialized');
  
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
    timeout: 60000,
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Non-text response from Claude');
  return content.text;
};

/**
 * Call OpenAI GPT API
 */
const callOpenAI = async (userMessage) => {
  if (!openai) throw new Error('OpenAI not initialized');
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage }
    ],
    max_tokens: 1024,
    temperature: 0.7,
    timeout: 60000,
  });

  const message = response.choices[0]?.message?.content;
  if (!message) throw new Error('Empty response from OpenAI');
  return message;
};

/**
 * Generate AI response with fallback chain and retry logic
 * Works 24/7 with multiple AI service failover
 */
export const generateAIResponse = async (userMessage, sessionId, mongodb) => {
  const serviceOrder = [];
  
  // Determine service priority order
  if (gemini) serviceOrder.push({ name: 'Gemini', fn: callGemini });
  if (anthropic) serviceOrder.push({ name: 'Claude', fn: callClaude });
  if (openai) serviceOrder.push({ name: 'GPT', fn: callOpenAI });

  if (serviceOrder.length === 0) {
    throw new Error('❌ No AI service configured. Add API keys to .env');
  }

  let lastError;
  for (const service of serviceOrder) {
    try {
      console.log(`🤖 [${service.name}] Processing message...`);
      const response = await withRetry(() => service.fn(userMessage), MAX_RETRIES);
      console.log(`✅ [${service.name}] Success`);
      return response;
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ [${service.name}] Failed:`, error.message);
      continue;
    }
  }

  console.error('❌ All AI services failed:', lastError?.message);
  throw lastError || new Error('All AI services unavailable');
};

/**
 * Health check for all AI services
 */
export const checkAIHealthStatus = async () => {
  const status = {
    gemini: { available: false, status: 'Not configured' },
    claude: { available: false, status: 'Not configured' },
    gpt: { available: false, status: 'Not configured' },
    anyAvailable: false,
  };

  if (gemini) {
    try {
      const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
      await model.generateContent('ping');
      status.gemini = { available: true, status: '✅ OK' };
      status.anyAvailable = true;
    } catch (e) {
      status.gemini = { available: false, status: `❌ ${e.message}` };
    }
  }

  if (anthropic) {
    try {
      await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'ping' }],
      });
      status.claude = { available: true, status: '✅ OK' };
      status.anyAvailable = true;
    } catch (e) {
      status.claude = { available: false, status: `❌ ${e.message}` };
    }
  }

  if (openai) {
    try {
      await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 10,
      });
      status.gpt = { available: true, status: '✅ OK' };
      status.anyAvailable = true;
    } catch (e) {
      status.gpt = { available: false, status: `❌ ${e.message}` };
    }
  }

  return status;
};

/**
 * Generate embeddings for semantic search
 */
export const generateEmbedding = async (text) => {
  if (!openai) throw new Error('OpenAI API key required for embeddings');
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
};

export { isRetryableError, withRetry, MAX_RETRIES };
