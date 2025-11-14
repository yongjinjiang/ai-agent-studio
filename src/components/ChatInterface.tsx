import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types/agent';
import './ChatInterface.css';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onReset: () => void;
  isRunning: boolean;
}

/**
 * Chat Interface Component
 * Displays conversation and handles user input
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onReset,
  isRunning,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isRunning) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>Agent Chat</h2>
        <button onClick={onReset} className="btn-secondary" disabled={isRunning}>
          Reset
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>👋 Start a conversation with your agent!</p>
          </div>
        ) : (
          messages
            .filter((msg) => msg.role !== 'system')
            .map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))
        )}
        {isRunning && (
          <div className="message assistant">
            <div className="message-bubble">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isRunning}
          className="chat-input"
        />
        <button type="submit" disabled={isRunning || !input.trim()} className="btn-send">
          Send
        </button>
      </form>
    </div>
  );
};

/**
 * Message Bubble Component
 * Renders individual messages with role-specific styling
 */
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const roleClass = message.role;

  return (
    <div className={`message ${roleClass}`}>
      <div className="message-bubble">
        {message.role === 'tool' && (
          <div className="tool-badge">🔧 {message.toolName}</div>
        )}
        <div className="message-content">{message.content}</div>
        <div className="message-timestamp">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
