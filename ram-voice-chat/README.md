# RAM Voice Chat 🎤🗣️

**Holographic Jarvis-style voice interface for the RAM Oracle system**

Connect to RAM_CHAT.ps1 via voice input → microphone → transcribe → send to RAM → TTS response

---

## 🎯 Features

- ✅ **Voice Input** - Real-time speech recognition (English + Thai)
- ✅ **Voice Output** - Text-to-speech response playback
- ✅ **Holographic UI** - Jarvis-inspired glassmorphism design
- ✅ **Live Waveform** - Animated visualization while listening
- ✅ **Local RAM Integration** - Calls RAM_CHAT.ps1 via subprocess
- ✅ **Thai Language Support** - Native support for Thai text/speech
- ✅ **Responsive Design** - Works on desktop, tablet, mobile

---

## 📋 Architecture

```
Frontend (React)
├── Voice Input (Web Speech API)
├── Chat UI (Holographic bubbles)
└── Waveform Visualizer

     ↓ API Calls ↓

Backend (Express.js)
├── /api/chat - Text chat
├── /api/speak - Chat + voice response
├── /api/tts - Text-to-speech
└── RAM Bridge

     ↓ Subprocess ↓

RAM_CHAT.ps1 (PowerShell)
└── Local Oracle Agent
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (for frontend + backend)
- **PowerShell** 5+ (for RAM_CHAT.ps1)
- **RAM_CHAT.ps1** in `../../tools/` directory

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Edit .env if you want TTS (optional)
# ELEVENLABS_API_KEY=sk_live_xxx

npm start
# Server runs on http://localhost:3001
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

### Access

Open http://localhost:3000 in your browser

---

## 🎤 How to Use

1. **Click the Mic Button** - "Speak" button starts listening
2. **Say Something** - Speak clearly in English or Thai
3. **Wait for Response** - Audio animates while processing
4. **Hear RAM Speak** - Response plays automatically via TTS
5. **Continue Conversation** - Click mic again to respond

### Text Alternative

If voice isn't working, type in the text input field below the mic button.

---

## 🔧 Configuration

### Environment Variables

Create `.env` in `backend/`:

```env
# Server
PORT=3001

# Optional: ElevenLabs TTS (for high-quality voice output)
ELEVENLABS_API_KEY=sk_live_xxxxxxxxxxxxx
VOICE_ID=EXAVITQu4EsNXXpSD7XK  # Sarah voice by default
```

**Get a free ElevenLabs API key:**
1. Visit https://www.elevenlabs.io
2. Sign up (free tier includes quota)
3. Copy your API key
4. Paste in `.env`

### Language Support

Edit `VoiceInput.jsx` line 24 to change recognition language:

```javascript
recognition.lang = 'en-US';  // English (default)
// recognition.lang = 'th-TH';  // Thai
```

---

## 📁 Project Structure

```
ram-voice-chat/
├── backend/
│   ├── server.js           # Express API server
│   ├── ram-bridge.js       # PowerShell subprocess bridge
│   ├── package.json
│   ├── .env.example
│   └── .env                # Created from .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main app component
│   │   ├── App.css         # Holographic theme
│   │   ├── main.jsx        # React entry
│   │   ├── index.css       # Global styles
│   │   └── components/
│   │       ├── VoiceInput.jsx       # Mic button + Web Speech API
│   │       ├── VoiceInput.css
│   │       ├── ChatBubble.jsx       # Message display
│   │       ├── ChatBubble.css
│   │       ├── WaveformVisualizer.jsx  # Animated visualization
│   │       └── WaveformVisualizer.css
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   ├── package.json
│   └── dist/               # Built app (after npm run build)
│
└── README.md               # This file
```

---

## 🌐 API Endpoints

### Backend API (runs on port 3001)

#### Health Check
```bash
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "ram": "connected",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

#### Chat (Text Only)
```bash
POST /api/chat
Content-Type: application/json

{ "message": "Hello RAM" }
```

Response:
```json
{
  "response": "Hello! How can I help?",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "language": "auto"
}
```

#### Chat + Voice (Recommended)
```bash
POST /api/speak
Content-Type: application/json

{ "message": "Hello RAM" }
```

Response:
```json
{
  "message": "Hello RAM",
  "response": "Hello! How can I help?",
  "audio": "//NExAASnQIAkqkA..." // Base64 MP3 (if ElevenLabs configured)
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

#### Text-to-Speech
```bash
POST /api/tts
Content-Type: application/json

{ "text": "Hello world" }
```

Response: `audio/mpeg` binary (MP3 file)

#### Thai Support
```bash
POST /api/chat/thai
Content-Type: application/json

{ "message": "สวัสดี" }
```

---

## 🎨 UI Design Features

### Holographic Theme
- **Primary Color**: Cyan (#00ffc8)
- **Secondary Color**: Blue (#0064ff)
- **Tertiary Color**: Purple (#c800ff)
- **Background**: Dark Navy (#0a1932)

### Components

**Mic Button**
- Glowing border
- Listening state animation
- Processing state indicator
- Responsive sizing

**Chat Bubbles**
- Glassmorphism effect
- Gradient backgrounds
- Holographic top accent line
- Smooth fade-in animation

**Waveform Visualizer**
- Canvas-based bars
- Gradient colors
- Glow effects
- Continuous animation while listening

**Header**
- Glowing title
- Status badge with connection indicator
- Floating background effects

---

## 🐛 Troubleshooting

### "Speech Recognition not supported"
- Your browser doesn't support Web Speech API
- Works in: Chrome, Edge, Safari (iOS 14+), Samsung Internet
- Fallback: Use text input instead

### "Cannot connect to RAM"
- Make sure RAM_CHAT.ps1 exists at: `../../tools/RAM_CHAT.ps1`
- Start backend: `npm start` in `backend/` directory
- Check backend is running: `curl http://localhost:3001/api/health`

### "No audio output"
- ElevenLabs key not configured (OK - uses browser TTS)
- Browser speaker is muted
- Check browser console for errors
- Try text input first

### "Backend exits with error"
- PowerShell not available (Windows/WSL only)
- RAM_CHAT.ps1 syntax error
- Check PowerShell is in PATH: `powershell -v`

---

## 📚 Integration with RAM

The system calls `RAM_CHAT.ps1` with:

```powershell
& "$RAM_CHAT_PATH" -Message "user input"
```

Expected response: JSON or plain text

```json
{
  "message": "RAM response text",
  "language": "thai" | "english",
  "confidence": 0.95
}
```

---

## 🚢 Deployment

### Frontend Only (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Full Stack (Heroku/Railway)

```bash
# Build frontend
cd frontend && npm run build && cd ..

# Deploy with backend
# Make sure backend connects to RAM_CHAT.ps1
```

### Local Persistent

Use PM2 to keep running:

```bash
npm install -g pm2

cd backend
pm2 start server.js --name "ram-voice-backend"

cd ../frontend
pm2 start "npm run dev" --name "ram-voice-frontend"

pm2 save
pm2 startup
```

---

## 📖 Next Steps

- [ ] Add conversation history persistence
- [ ] Implement voice command shortcuts
- [ ] Add custom voice selection
- [ ] Thai language optimization
- [ ] Mobile app wrapper (React Native)
- [ ] Desktop app (Electron)
- [ ] Real-time collaboration
- [ ] Recording & playback

---

## 📝 License

MIT

---

## 🙏 Credits

- **RAM Oracle**: khun-ram-oracle system
- **Voice**: Web Speech API + ElevenLabs
- **Design**: Inspired by Jarvis/Iron Man UI
- **Tech**: React + Vite + Express + Node.js

---

## 📞 Support

For issues:
1. Check `/api/health` endpoint
2. Review browser console (F12)
3. Check backend logs
4. Verify RAM_CHAT.ps1 path
5. Test with text input first

---

**Ready to speak with RAM?** 🗣️✨

Start the backend and frontend, then open http://localhost:3000
