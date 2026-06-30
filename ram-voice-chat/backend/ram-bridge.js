/**
 * RAM Bridge - Connects to local RAM_CHAT.ps1 subprocess
 * Translates voice input → RAM response → voice output
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to RAM_CHAT.ps1
const RAM_CHAT_PATH = path.resolve(
  __dirname,
  '../../../tools/RAM_CHAT.ps1'
);

/**
 * Call RAM with user message via PowerShell subprocess
 * @param {string} userMessage - The user's input
 * @param {object} options - Configuration options
 * @returns {Promise<string>} RAM's response
 */
export async function callRAM(userMessage, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      // PowerShell command to run RAM_CHAT.ps1
      const psCommand = `
        $ErrorActionPreference = 'Stop'
        & "${RAM_CHAT_PATH}" -Message "${userMessage.replace(/"/g, '`"')}"
      `;

      // Spawn PowerShell process
      const ps = spawn('powershell.exe', ['-NoProfile', '-Command', psCommand], {
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true,
        shell: true,
      });

      let stdout = '';
      let stderr = '';
      let timeout;

      // Set timeout (30 seconds max)
      timeout = setTimeout(() => {
        ps.kill();
        reject(new Error('RAM response timeout'));
      }, 30000);

      ps.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      ps.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      ps.on('close', (code) => {
        clearTimeout(timeout);

        if (code !== 0) {
          reject(new Error(`PowerShell exited with code ${code}: ${stderr}`));
          return;
        }

        if (!stdout.trim()) {
          reject(new Error('No response from RAM'));
          return;
        }

        // Extract response (RAM outputs JSON)
        try {
          // Try to parse as JSON first
          const response = JSON.parse(stdout);
          resolve(response.message || response.response || stdout.trim());
        } catch (e) {
          // If not JSON, return raw output
          resolve(stdout.trim());
        }
      });

      ps.on('error', (err) => {
        clearTimeout(timeout);
        reject(new Error(`Failed to spawn RAM process: ${err.message}`));
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate speech from text using ElevenLabs API
 * Requires ELEVENLABS_API_KEY environment variable
 * @param {string} text - Text to convert to speech
 * @param {string} voiceId - ElevenLabs voice ID (default: "Sarah")
 * @returns {Promise<Buffer>} Audio MP3 buffer
 */
export async function textToSpeech(text, voiceId = 'EXAVITQu4EsNXXpSD7XK') {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    console.warn(
      'ELEVENLABS_API_KEY not set, using browser TTS instead'
    );
    return null;
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('TTS error:', error.message);
    return null;
  }
}

/**
 * Health check - verify RAM_CHAT.ps1 is accessible
 * @returns {Promise<boolean>}
 */
export async function healthCheck() {
  try {
    const response = await callRAM('health check', { maxWait: 5000 });
    return response && response.length > 0;
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
}

export default {
  callRAM,
  textToSpeech,
  healthCheck,
};
