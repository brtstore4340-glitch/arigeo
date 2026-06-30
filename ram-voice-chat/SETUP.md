# RAM Voice Chat - Setup Guide

## 🚀 Quick Setup (5 minutes)

### Windows PowerShell

```powershell
cd "D:\01 Main Work\Boots\Agentic AI\mission-control\ram-voice-chat"
.\start.ps1
```

This script will:
- Check Node.js is installed
- Install dependencies (frontend + backend)
- Start backend server (port 3001)
- Start frontend dev server (port 3000)
- Open your browser to http://localhost:3000

### Manual Setup (if start.ps1 doesn't work)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
# Should print: "Listening on http://localhost:3001"
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
# Should print: "http://localhost:3000"
```

---

## ✅ Health Check

Once running, verify everything works:

```bash
# Check backend is running
curl http://localhost:3001/api/health

# You should see:
# {"status":"healthy","ram":"connected","timestamp":"..."}
```

---

## 🎤 First Conversation

1. Open http://localhost:3000 in your browser
2. You should see the holographic UI with a mic button
3. Click the **"Speak"** button
4. Say something in English or Thai
5. Wait for RAM's response (with voice if configured)

---

## 🔧 Optional: Enable Voice Output

To get high-quality voice responses, get a free ElevenLabs API key:

1. Visit https://www.elevenlabs.io
2. Sign up (free tier works)
3. Copy your API key
4. In `backend/.env`, add:
   ```env
   ELEVENLABS_API_KEY=sk_live_xxxxxxxxxxxxx
   ```
5. Restart backend: `npm start`

Now responses will play as audio!

---

## 🆘 Troubleshooting

### "Node.js not found"
- Install Node.js 18+ from https://nodejs.org

### "Cannot connect to RAM"
- Make sure `tools/RAM_CHAT.ps1` exists
- Check the path in `backend/ram-bridge.js` line 11

### "Speech Recognition not supported"
- Your browser doesn't support Web Speech API
- Use text input instead (type in the box)
- Works best in Chrome/Edge/Safari

### "Port 3000 or 3001 already in use"
- Close other apps using these ports
- Or change ports in `vite.config.js` and `server.js`

### Backend keeps crashing
- PowerShell might not be in PATH
- Try: `powershell -v` in terminal
- On Linux: Install PowerShell or use WSL

---

## 📁 Project Files

```
ram-voice-chat/
├── backend/          # Express.js API + RAM bridge
├── frontend/         # React Vite app
├── start.ps1         # Auto-start script
├── README.md         # Full documentation
└── SETUP.md          # This file
```

---

## 🎯 Next Steps

1. **Get familiar**: Say a few things to RAM, notice how it responds
2. **Try Thai**: Switch language in VoiceInput.jsx to test Thai support
3. **Configure voice**: Add ElevenLabs API key for voice output
4. **Deploy**: Follow README.md for deployment options

---

## 📞 Support

Issues? Check:
1. Backend logs (Terminal 1)
2. Browser console (F12 → Console tab)
3. `/api/health` endpoint
4. RAM_CHAT.ps1 path

---

**Ready? Run `.\start.ps1` now!** 🚀
