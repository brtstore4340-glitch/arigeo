import React, { useEffect, useRef, useState } from 'react';
import './VoiceInput.css';

const VoiceInput = ({ onTranscript, isListening, setIsListening, isProcessing }) => {
  const recognitionRef = useRef(null);
  const isSupportedRef = useRef(false);
  const silenceTimerRef = useRef(null);
  const lastSpeechTimeRef = useRef(Date.now());
  const accumulatedTranscriptRef = useRef('');
  const isSilentRef = useRef(false);
  const [autoMode, setAutoMode] = useState(true);

  const SILENCE_THRESHOLD = 3500; // 3.5 seconds
  const SENTENCE_ENDINGS = /[.!?]+$/;

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported');
      isSupportedRef.current = false;
      return;
    }

    isSupportedRef.current = true;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'th-TH'; // Thai by default, can be switched

    let interimTranscript = '';

    recognition.onstart = () => {
      setIsListening(true);
      interimTranscript = '';
      accumulatedTranscriptRef.current = '';
      isSilentRef.current = false;
      console.log('🎤 Listening started (auto-mode)');
    };

    recognition.onresult = (event) => {
      // Clear silence timer - user is speaking
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      isSilentRef.current = false;
      lastSpeechTimeRef.current = Date.now();

      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Accumulate final results
      if (finalText.trim()) {
        accumulatedTranscriptRef.current += (accumulatedTranscriptRef.current ? ' ' : '') + finalText;
        console.log('✓ Final:', finalText);
        console.log('📝 Accumulated:', accumulatedTranscriptRef.current);
      }

      // Set silence timer - will trigger response after 3.5 seconds
      if (autoMode && accumulatedTranscriptRef.current.trim()) {
        silenceTimerRef.current = setTimeout(() => {
          const shouldRespond = shouldTriggerResponse(accumulatedTranscriptRef.current);

          if (shouldRespond) {
            console.log('⏱️ Silence threshold reached - sending response');
            sendResponse();
          }
        }, SILENCE_THRESHOLD);
      }
    };

    recognition.onerror = (event) => {
      console.error('❌ Speech error:', event.error);
      // Continue listening even on error
      if (autoMode) {
        setTimeout(() => recognition.start(), 100);
      }
    };

    recognition.onend = () => {
      console.log('🔇 Recognition ended - restarting...');
      // Auto-restart in continuous mode
      if (autoMode) {
        setTimeout(() => recognition.start(), 100);
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    // Auto-start listening
    setTimeout(() => recognition.start(), 500);

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [autoMode]);

  const shouldTriggerResponse = (text) => {
    if (!text.trim()) return false;

    // Trigger if:
    // 1. Text ends with sentence punctuation
    if (SENTENCE_ENDINGS.test(text.trim())) {
      console.log('📄 Sentence ending detected');
      return true;
    }

    // 2. Silence for 3.5 seconds
    if (Date.now() - lastSpeechTimeRef.current >= SILENCE_THRESHOLD) {
      console.log('⏸️ Silence detected');
      return true;
    }

    return false;
  };

  const sendResponse = () => {
    const finalText = accumulatedTranscriptRef.current.trim();

    if (!finalText || isProcessing) {
      return;
    }

    console.log('🚀 Sending:', finalText);

    // Reset for next utterance
    accumulatedTranscriptRef.current = '';
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    // Send to parent
    onTranscript(finalText);
  };

  const toggleMode = () => {
    setAutoMode(!autoMode);
    console.log(`Switched to: ${!autoMode ? 'Auto' : 'Manual'} mode`);
  };

  return (
    <div className="voice-input">
      <button
        className={`mic-button ${isListening ? 'listening' : ''} ${
          isProcessing ? 'processing' : ''
        } ${autoMode ? 'auto-mode' : ''}`}
        onClick={toggleMode}
        title={autoMode ? 'Auto-listening active (click to switch to manual)' : 'Manual mode (click to switch to auto)'}
      >
        <span className="mic-icon">🎤</span>
        <span className="mic-label">
          {isProcessing && 'Processing...'}
          {!isProcessing && isListening && autoMode && 'Auto-listening...'}
          {!isProcessing && isListening && !autoMode && 'Listening...'}
          {!isProcessing && !isListening && 'Starting...'}
        </span>
        <span className="mode-badge">{autoMode ? '🔄' : '👆'}</span>
      </button>
    </div>
  );
};

export default VoiceInput;
