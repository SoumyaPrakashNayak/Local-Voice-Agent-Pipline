import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { airaTools, resolveFirRecord, MOCK_CASES } from './tools.js';

dotenv.config({ path: '../.env' });
dotenv.config(); // fallback to local .env

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

const apiKey = process.env.GOOGLE_API_KEY;
console.log(`[AIRA SERVER] Starting AIRA Intelligence Backend`);
console.log(`[AIRA SERVER] Google API Key configured: ${Boolean(apiKey)}`);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AIRA Intelligence Gemini Server',
    geminiConfigured: Boolean(process.env.GOOGLE_API_KEY),
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
  });
});

/**
 * Generate a secure Gemini Ephemeral Token for Browser Direct Live API
 * GET /api/gemini/live-token
 */
app.get('/api/gemini/live-token', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({
        error: 'GOOGLE_API_KEY is not configured in server environment.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Create short-lived ephemeral token restricted for Live session
    const tokenResponse = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
    });

    console.log('[AIRA TOKEN] Created Gemini ephemeral token for client session');

    return res.json({
      token: tokenResponse.name,
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      voice: 'Puck',
      sampleRate: 16000,
      outputSampleRate: 24000,
    });
  } catch (error) {
    console.error('[AIRA TOKEN ERROR] Failed to create ephemeral token:', error?.message || error);
    return res.status(500).json({
      error: error?.message || 'Failed to create Gemini Live token',
    });
  }
});

/**
 * Authoritative S.I.R.I.S. Tool Execution Endpoint
 * POST /api/tools/:toolName
 */
app.post('/api/tools/:toolName', (req, res) => {
  const { toolName } = req.params;
  const args = req.body || {};

  console.log(`[AIRA TOOL API] Executing tool: ${toolName} with args:`, args);

  if (typeof airaTools[toolName] === 'function') {
    try {
      const result = airaTools[toolName](args);
      console.log(`[AIRA TOOL API] Result:`, result);
      return res.json(result);
    } catch (err) {
      console.error(`[AIRA TOOL API ERROR] Error executing ${toolName}:`, err);
      return res.status(500).json({ error: err?.message || 'Tool execution failed' });
    }
  }

  return res.status(404).json({ error: `Tool ${toolName} not found.` });
});

/**
 * Return all FIR mock data catalog
 * GET /api/cases
 */
app.get('/api/cases', (req, res) => {
  return res.json(MOCK_CASES);
});

process.on('uncaughtException', (err) => {
  console.error('[AIRA SERVER UNCAUGHT EXCEPTION]:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[AIRA SERVER UNHANDLED REJECTION]:', reason);
});

const server = app.listen(PORT, () => {
  console.log(`[AIRA SERVER] Running on http://localhost:${PORT}`);
  console.log(`[AIRA SERVER] Direct Gemini Live Token Endpoint: http://localhost:${PORT}/api/gemini/live-token`);
});
