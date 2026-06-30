import React, { useEffect, useState } from 'react';
import './ChatBubble.css';

const ChatBubble = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`message-container ${message.sender} ${isVisible ? 'visible' : ''}`}
    >
      <div className={`message-bubble ${message.sender}`}>
        <div className="message-content">
          {message.sender === 'user' && (
            <div className="user-badge">You</div>
          )}
          {message.sender === 'ram' && (
            <div className="ram-badge">🗣️ RAM</div>
          )}
          {message.sender === 'system' && (
            <div className="system-badge">⚠️ System</div>
          )}

          <p className="message-text">{message.text}</p>

          <div className="message-footer">
            <time className="message-time">
              {formatTime(message.timestamp)}
            </time>
          </div>
        </div>

        {/* Holographic accent */}
        <div className="bubble-accent"></div>
      </div>
    </div>
  );
};

export default ChatBubble;
