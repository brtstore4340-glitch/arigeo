/**
 * RAM Voice Chat Backend
 * Express server that bridges voice input to RAM_CHAT.ps1
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { callRAM, textToSpeech, healthCheck } from './ram-bridge.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// ROUTES
// ============================================================================

/**
 * Health check endpoint
 */
app.get('/api/health', async (req, res) => {
  try {
    const isHealthy = await healthCheck();
    res.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      ram: isHealthy ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

/**
 * Main chat endpoint - send message to RAM, get response
 * POST /api/chat
 * Body: { message: string }
 * Response: { response: string, timestamp: string }
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message is required',
      });
    }

    console.log(`[Chat] User: ${message}`);

    const response = await callRAM(message);

    console.log(`[Chat] RAM: ${response.substring(0, 100)}...`);

    res.json({
      response,
      timestamp: new Date().toISOString(),
      language: 'auto', // Could detect Thai vs English
    });
  } catch (error) {
    console.error('[Chat Error]', error.message);
    res.status(500).json({
      error: error.message || 'Failed to get response from RAM',
    });
  }
});

/**
 * Text-to-speech endpoint
 * POST /api/tts
 * Body: { text: string, voiceId?: string }
 * Response: audio/mp3 buffer
 */
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceId } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Text is required',
      });
    }

    console.log(`[TTS] Generating speech: ${text.substring(0, 50)}...`);

    const audioBuffer = await textToSpeech(text, voiceId);

    if (!audioBuffer) {
      return res.status(503).json({
        error: 'TTS service unavailable, use browser TTS instead',
      });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error('[TTS Error]', error.message);
    res.status(500).json({
      error: error.message || 'Failed to generate speech',
    });
  }
});

/**
 * Combined chat + TTS endpoint (voice response)
 * POST /api/speak
 * Body: { message: string }
 * Response: { response: string, audio: base64 }
 */
app.post('/api/speak', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message is required',
      });
    }

    // Get response from RAM
    const ramResponse = await callRAM(message);

    // Generate speech (optional, may return null if API key not set)
    let audioBase64 = null;
    try {
      const audioBuffer = await textToSpeech(ramResponse);
      if (audioBuffer) {
        audioBase64 = Buffer.from(audioBuffer).toString('base64');
      }
    } catch (error) {
      console.warn('TTS generation skipped:', error.message);
    }

    res.json({
      message,
      response: ramResponse,
      audio: audioBase64, // null if TTS unavailable
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Speak Error]', error.message);
    res.status(500).json({
      error: error.message || 'Failed to process request',
    });
  }
});

/**
 * Thai language support endpoint
 * POST /api/chat/thai
 * Body: { message: string } (Thai text)
 * Response: { response: string, language: "thai" }
 */
app.post('/api/chat/thai', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message is required',
      });
    }

    console.log(`[Thai Chat] User: ${message}`);

    const response = await callRAM(message);

    res.json({
      response,
      language: 'thai',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Thai Chat Error]', error.message);
    res.status(500).json({
      error: error.message || 'Failed to get Thai response',
    });
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

app.use((error, req, res, next) => {
  console.error('[Server Error]', error);
  res.status(500).json({
    error: error.message || 'Internal server error',
  });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(
    `\n╔════════════════════════════════════════════════╗`
  );
  console.log(
    `║  RAM Voice Chat Backend                        ║`
  );
  console.log(
    `║  Listening on http://localhost:${PORT}              ║`
  );
  console.log(
    `╚════════════════════════════════════════════════╝\n`
  );
  console.log(`API Endpoints:`);
  console.log(`  GET  /api/health         - Health check`);
  console.log(`  POST /api/chat           - Send message to RAM`);
  console.log(`  POST /api/tts            - Text-to-speech`);
  console.log(`  POST /api/speak          - Chat + TTS combined`);
  console.log(`  POST /api/chat/thai      - Thai language chat\n`);
});

process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});
