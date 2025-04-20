import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import '../../styles/common/AIAssistant.css';

/**
 * AI Assistant component for natural language interactions
 * 
 * @param {Object} props Component props
 * @param {Function} props.onSubmit Function to call when user submits a message
 * @param {Array} props.suggestions Array of suggestion messages
 * @param {string} props.placeholder Placeholder text for input
 * @param {boolean} props.loading Whether the assistant is processing
 * @param {string} props.assistantName Name of the assistant
 * @param {Array} props.messages Array of message objects with sender and text
 * @returns {JSX.Element} AIAssistant component
 */
const AIAssistant = ({
  onSubmit,
  suggestions = [],
  placeholder = "Type your request...",
  loading = false,
  assistantName = "Zahav AI",
  messages = [],
  onClear,
  className = ""
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSubmit(input);
      setInput('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onSubmit(suggestion);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className={`ai-assistant ${className}`}>
      <div className="ai-assistant-header">
        <div className="ai-assistant-title">
          <div className="ai-assistant-avatar">
            <span>AI</span>
          </div>
          <h3>{assistantName}</h3>
        </div>
        {onClear && (
          <Button 
            variant="text" 
            onClick={onClear}
            className="clear-chat-button"
          >
            Clear Chat
          </Button>
        )}
      </div>

      <div className="ai-assistant-messages">
        {messages.length === 0 ? (
          <div className="ai-assistant-welcome">
            <h4>How can I help you today?</h4>
            <p>I can help you create bookings and set up price alerts using natural language. Just tell me what you need!</p>
            
            {suggestions.length > 0 && (
              <div className="ai-assistant-suggestions">
                <p>Try saying something like:</p>
                <div className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-content">
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="ai-assistant-input">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={loading}
        />
        <Button 
          type="submit" 
          variant="primary" 
          loading={loading}
          disabled={!input.trim() || loading}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default AIAssistant;
