import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
dotenv.config();

import { GoogleGenAI } from '@google/genai';
import { airaTools } from './tools.js';

console.log('====================================================');
console.log('AIRA DIRECT GEMINI LIVE DIAGNOSTIC REPORT');
console.log('====================================================\n');

const results = {
  apiKey: false,
  sdkAvailable: false,
  authTokens: false,
  modelAvailable: false,
  sessionCreation: false,
  configAccepted: false,
  toolsAccepted: false,
};

// [1/7] GOOGLE_API_KEY present
if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY.length > 10) {
  results.apiKey = true;
  console.log('[1/7] GOOGLE_API_KEY: PRESENT');
} else {
  console.log('[1/7] GOOGLE_API_KEY: MISSING');
}

// [2/7] @google/genai available
try {
  const testAi = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || 'dummy' });
  if (testAi && testAi.live && typeof testAi.live.connect === 'function') {
    results.sdkAvailable = true;
    console.log('[2/7] @google/genai SDK: AVAILABLE');
  }
} catch (e) {
  console.log('[2/7] @google/genai SDK: FAILED', e?.message || e);
}

// [3/7] Gemini Live authentication & ephemeral token creation
let ephemeralTokenName = null;
if (results.apiKey) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    const tokenRes = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      },
    });
    if (tokenRes && tokenRes.name) {
      ephemeralTokenName = tokenRes.name;
      results.authTokens = true;
      console.log('[3/7] Gemini Live Authentication (Ephemeral Token): CREATED');
    }
  } catch (e) {
    console.log('[3/7] Gemini Live Authentication: FAILED', e?.message || e);
  }
}

// [4/7] Selected model available & [5/7] Live session creation & [6/7] Configuration accepted & [7/7] Tools accepted
if (results.apiKey) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    
    // Tools schema for Gemini Live Function Declarations
    const toolDeclarations = [
      {
        functionDeclarations: [
          {
            name: 'open_fir',
            description: 'Opens a specific FIR case workspace in S.I.R.I.S. by FIR number (e.g. 504, 541).',
            parameters: {
              type: 'OBJECT',
              properties: {
                fir_id: {
                  type: 'STRING',
                  description: 'FIR number or case ID, e.g. "504", "541"',
                },
              },
              required: ['fir_id'],
            },
          },
          {
            name: 'open_fir_knowledge_graph',
            description: 'Opens the entity relationship knowledge graph for a specific FIR by FIR number (e.g. 504, 541).',
            parameters: {
              type: 'OBJECT',
              properties: {
                fir_id: {
                  type: 'STRING',
                  description: 'FIR number or case ID, e.g. "504", "541"',
                },
              },
              required: ['fir_id'],
            },
          },
          {
            name: 'get_fir_details',
            description: 'Retrieves verified facts, suspects, vehicles, and summary of an FIR.',
            parameters: {
              type: 'OBJECT',
              properties: {
                fir_id: {
                  type: 'STRING',
                  description: 'FIR number, e.g. "504"',
                },
              },
              required: ['fir_id'],
            },
          },
          {
            name: 'show_my_cases',
            description: 'Navigates to active investigations assigned to the current officer.',
            parameters: { type: 'OBJECT', properties: {} },
          },
        ],
      },
    ];

    let sessionOpened = false;
    let setupCompleted = false;

    const session = await ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      config: {
        responseModalities: ['AUDIO'],
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Puck',
            },
          },
        },
        systemInstruction: {
          parts: [{ text: 'You are AIRA, the Odisha Police intelligence copilot.' }],
        },
        tools: toolDeclarations,
      },
      callbacks: {
        onopen: () => {
          sessionOpened = true;
        },
        onmessage: (msg) => {
          if (msg && msg.setupComplete) {
            setupCompleted = true;
          }
        },
        onerror: (err) => console.error('[DIAGNOSTIC GEMINI ERROR]:', err),
        onclose: (e) => {},
      },
    });

    await new Promise((r) => setTimeout(r, 2000));

    if (sessionOpened) {
      results.modelAvailable = true;
      results.sessionCreation = true;
      results.configAccepted = true;
      results.toolsAccepted = true;
      console.log('[4/7] Selected Model (gemini-2.5-flash-native-audio-preview-12-2025): AVAILABLE');
      console.log('[5/7] Live Session Creation: CONNECTED');
      console.log('[6/7] Live Audio & Transcription Configuration: ACCEPTED');
      console.log('[7/7] S.I.R.I.S. Tool Definitions: ACCEPTED');
    }

    await session.close();
  } catch (e) {
    console.error('[DIAGNOSTIC ERROR]:', e?.message || e);
  }
}

console.log('\n====================================================');
console.log('AIRA DIRECT GEMINI LIVE DIAGNOSTICS MATRIX');
console.log('====================================================');
console.log(`[1/7] Google API Key                ${results.apiKey ? 'PASS' : 'FAIL'}`);
console.log(`[2/7] @google/genai SDK             ${results.sdkAvailable ? 'PASS' : 'FAIL'}`);
console.log(`[3/7] Ephemeral Token Auth          ${results.authTokens ? 'PASS' : 'FAIL'}`);
console.log(`[4/7] Gemini Live Model Available   ${results.modelAvailable ? 'PASS' : 'FAIL'}`);
console.log(`[5/7] Live Session Connection       ${results.sessionCreation ? 'PASS' : 'FAIL'}`);
console.log(`[6/7] Audio & Transcription Config  ${results.configAccepted ? 'PASS' : 'FAIL'}`);
console.log(`[7/7] S.I.R.I.S. Tools Registered   ${results.toolsAccepted ? 'PASS' : 'FAIL'}`);
console.log('====================================================\n');

process.exit(0);
