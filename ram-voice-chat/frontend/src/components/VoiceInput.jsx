import React, { useEffect, useRef } from 'react';
import './VoiceInput.css';

const VoiceInput = ({ onTranscript, isListening, setIsListening, isProcessing }) => {
  const recognitionRef = useRef(null);
  const isSupportedRef = useRef(false);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported');
      return;
    }

    isSupportedRef.current = true;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // Can switch to 'th-TH' for Thai

    let interimTranscript = '';

    recognition.onstart = () => {
      setIsListening(true);
      interimTranscript = '';
    };

    recognition.onresult = (event) => {
      let isFinal = false;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          isFinal = true;
        } else {
          interimTranscript += transcript;
        }

        // Log interim results
        if (event.results[i].isFinal) {
          console.log('Recognized (final):', transcript);
        }
      }

      // Send final transcript
      if (isFinal && interimTranscript.trim()) {
        recognition.stop();
        onTranscript(interimTranscript);
        interimTranscript = '';
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [setIsListening, onTranscript]);

  const handleMicClick = () => {
    if (!isSupportedRef.current) {
      alert('Speech Recognition not supported in this browser');
      return;
    }

    if (isProcessing) {
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="voice-input">
      <button
        className={`mic-button ${isListening ? 'listening' : ''} ${
          isProcessing ? 'processing' : ''
        }`}
        onClick={handleMicClick}
        disabled={isProcessing}
        title={isListening ? 'Click to stop listening' : 'Click to start listening'}
      >
        <span className="mic-icon">🎤</span>
        <span className="mic-label">
          {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Speak'}
        </span>
      </button>
    </div>
  );
};

export default VoiceInput;
