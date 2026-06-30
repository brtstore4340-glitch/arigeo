import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import VoiceInput from './components/VoiceInput';
import ChatBubble from './components/ChatBubble';
import WaveformVisualizer from './components/WaveformVisualizer';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check API health on mount
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const response = await axios.get('/api/health');
      setApiStatus(response.data.ram === 'connected' ? 'connected' : 'disconnected');
    } catch (error) {
      console.error('Health check failed:', error);
      setApiStatus('error');
    }
  };

  const handleVoiceInput = async (transcript) => {
    if (!transcript || !transcript.trim()) {
      console.log('Empty transcript, skipping');
      return;
    }

    console.log('🎯 Processing voice input:', transcript);

    // Add user message
    const userMsg = {
      id: Date.now(),
      text: transcript,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      // Send to backend
      const response = await axios.post('/api/speak', {
        message: transcript,
      });

      // Add RAM response
      const ramMsg = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'ram',
        timestamp: new Date(),
        audio: response.data.audio,
      };

      setMessages((prev) => [...prev, ramMsg]);

      // Play audio if available
      if (response.data.audio) {
        playAudio(response.data.audio);
      } else {
        // Fallback: use browser TTS
        speakText(response.data.response);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = {
        id: Date.now() + 1,
        text: `Error: ${error.response?.data?.error || error.message}`,
        sender: 'system',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = (base64Audio) => {
    try {
      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play().catch((err) => {
        console.warn('Audio playback failed, using TTS:', err);
        // This will be handled by the backend returning null audio
      });
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    const input = e.target.elements.textInput;
    const text = input.value.trim();

    if (!text) return;

    input.value = '';
    await handleVoiceInput(text);
  };

  return (
    <div className="app">
      {/* Background */}
      <div className="holographic-bg">
        <div className="glow-1"></div>
        <div className="glow-2"></div>
        <div className="glow-3"></div>
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="title">
            <span className="title-icon">🗣️</span>
            <span className="title-text">RAM Voice Chat</span>
          </h1>
          <div className="status-badge">
            <span className={`status-dot ${apiStatus}`}></span>
            <span className="status-text">
              {apiStatus === 'connected' && 'Connected to RAM'}
              {apiStatus === 'disconnected' && 'Disconnected'}
              {apiStatus === 'checking' && 'Checking...'}
              {apiStatus === 'error' && 'Connection Error'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="chat-container">
        <div className="messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎤</div>
              <h2>Welcome to RAM Oracle</h2>
              <p className="hint">🔄 Auto-listening active...</p>
              <p>Just speak naturally in Thai or English</p>
              <p className="sub-hint">Responds after 3.5 seconds or sentence end</p>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <section className="input-section">
        {isListening && <WaveformVisualizer />}

        <div className="input-controls">
          {/* Voice Input */}
          <VoiceInput
            onTranscript={handleVoiceInput}
            isListening={isListening}
            setIsListening={setIsListening}
            isProcessing={isProcessing}
          />

          {/* Text Input Fallback */}
          <form onSubmit={handleTextSubmit} className="text-input-form">
            <input
              type="text"
              name="textInput"
              placeholder="Or type message..."
              className="text-input"
              disabled={isProcessing}
              autoComplete="off"
            />
            <button
              type="submit"
              className="send-btn"
              disabled={isProcessing}
            >
              Send
            </button>
          </form>
        </div>

        <div className="input-hints">
          <p>Supported: English & Thai 🇹🇭</p>
        </div>
      </section>
    </div>
  );
}

export default App;
