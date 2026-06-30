/**
 * RAM Bridge - Connects to local RAM_CHAT.ps1 subprocess
 * Translates voice input → RAM response → voice output
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to RAM_API_BRIDGE.ps1 (wrapper for API calls)
const RAM_BRIDGE_PATH = path.resolve(
  __dirname,
  '../../tools/RAM_API_BRIDGE.ps1'
);

function toWindowsPowerShellPath(filePath) {
  const normalized = path.resolve(filePath);
  const mntMatch = normalized.match(/^\/mnt\/([a-zA-Z])\/(.*)$/);
  if (mntMatch) {
    const drive = mntMatch[1].toUpperCase();
    const tail = mntMatch[2].replace(/\//g, '\\');
    return `${drive}:\\${tail}`;
  }
  return normalized.replace(/\//g, '\\');
}

const RAM_BRIDGE_POWERSHELL_PATH = toWindowsPowerShellPath(RAM_BRIDGE_PATH);

export function getBridgeDiagnostics() {
  return {
    bridge_path_wsl: RAM_BRIDGE_PATH,
    bridge_path_windows: RAM_BRIDGE_POWERSHELL_PATH,
    bridge_exists: fs.existsSync(RAM_BRIDGE_PATH),
    backend_dir: __dirname,
  };
}

function assertBridgePathExists() {
  if (!fs.existsSync(RAM_BRIDGE_PATH)) {
    throw new Error(
      [
        'RAM_API_BRIDGE.ps1 not found.',
        `Resolved path: ${RAM_BRIDGE_PATH}`,
        `Backend dir: ${__dirname}`,
        'Expected relative path from backend/: ../../tools/RAM_API_BRIDGE.ps1',
      ].join(' ')
    );
  }
}

// Check if RAM_API_BRIDGE.ps1 exists
if (!fs.existsSync(RAM_BRIDGE_PATH)) {
  console.error(`⚠️  WARNING: RAM_API_BRIDGE.ps1 not found at: ${RAM_BRIDGE_PATH}`);
  console.error(`Please ensure the file exists before running.`);
} else {
  console.log(`✓ RAM_API_BRIDGE.ps1 found at: ${RAM_BRIDGE_PATH}`);
  console.log(`✓ PowerShell bridge path: ${RAM_BRIDGE_POWERSHELL_PATH}`);
}

/**
 * Call RAM with user message via PowerShell subprocess
 * @param {string} userMessage - The user's input
 * @param {object} options - Configuration options
 * @returns {Promise<string>} RAM's response
 */
export async function callRAM(userMessage, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      assertBridgePathExists();

      // Escape special characters for PowerShell
      const escapedMessage = userMessage
        .replace(/\\/g, '\\\\')  // Backslash
        .replace(/"/g, '\\"')     // Double quote (for PowerShell)
        .replace(/\$/g, '`$')     // Dollar sign
        .replace(/`/g, '``');     // Backtick

      // PowerShell command - use single quotes to handle spaces in path
      const psCommand = `& '${RAM_BRIDGE_POWERSHELL_PATH}' -Message "${escapedMessage}"`;

      // Debug logging
      console.log(`[Bridge] Executing: ${psCommand.substring(0, 80)}...`);
      console.log(`[Bridge] Path: ${RAM_BRIDGE_POWERSHELL_PATH}`);

      // Spawn PowerShell process
      const ps = spawn('powershell.exe', ['-NoProfile', '-Command', psCommand], {
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: false,
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
          const errorMsg = stderr ? stderr.trim() : `Exit code ${code}`;
          reject(new Error(`PowerShell failed: ${errorMsg}`));
          return;
        }

        if (!stdout.trim()) {
          reject(new Error('No response from RAM - check if RAM_CHAT.ps1 exists and is executable'));
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
        reject(new Error(`Failed to spawn PowerShell: ${err.message}`));
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

export async function healthCheckDetailed() {
  const diagnostics = getBridgeDiagnostics();
  try {
    const response = await callRAM('health check', { maxWait: 5000 });
    return {
      healthy: Boolean(response && response.length > 0),
      diagnostics,
      error: null,
    };
  } catch (error) {
    console.error('Health check failed:', error.message);
    return {
      healthy: false,
      diagnostics,
      error: error.message,
    };
  }
}

export default {
  callRAM,
  getBridgeDiagnostics,
  textToSpeech,
  healthCheck,
  healthCheckDetailed,
};
