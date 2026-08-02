import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Layout components
import Sidebar from './components/Sidebar/Sidebar';
import ChatHeader from './components/ChatHeader/ChatHeader';
import MessageList from './components/MessageList/MessageList';
import ChatInput from './components/ChatInput/ChatInput';

// Global styles
import './App.css';

/**
 * API base URL resolution:
 * - In development (Vite proxy): requests go to /api (proxied to backend)
 * - In production: use VITE_API_URL env var, or fall back to /api
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Main App component that renders the ChatGPT clone UI.
 * Manages conversation state, handles sending messages,
 * and auto-scrolls to the latest message.
 */
function App() {
  // List of conversation messages (user and assistant)
  const [conversations, setConversations] = useState([]);

  // Whether an AI response is currently being generated
  const [isLoading, setIsLoading] = useState(false);

  // Error message to display to the user
  const [error, setError] = useState(null);

  // Ref to auto-scroll to the bottom of the message list
  const messagesEndRef = useRef(null);

  /**
   * Fetches the full conversation history from the backend API.
   */
  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/conversations`);
      if (response.data.status) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Load conversation history when the app first renders
  useEffect(() => {
    async function loadConversations() {
      await fetchConversations();
    }
    loadConversations();
  }, []);

  // Auto-scroll to the bottom whenever new messages arrive or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, isLoading]);

  /**
   * Sends a user message to the backend API and appends the AI response.
   */
  const handleSendMessage = async (question) => {
    // Clear any previous error
    setError(null);

    // Add a temporary user message to show immediately in the UI
    const tempUserMessage = {
      id: Date.now(),
      role: 'user',
      content: question.trim(),
    };
    setConversations((prev) => [...prev, tempUserMessage]);
    
    try {
      setIsLoading(true);

      // Send the question to the backend API
      const response = await axios.post(`${API_BASE_URL}/chat/conversations`, {
        question: question.trim()
      });

      if (response.data.status) {
        // Extract the assistant's reply from the API response
        const assistantMessage = response.data.data.assistantAnswer;

        // Append the assistant's response to the conversation list
        setConversations((prev) => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          content: assistantMessage
        }]);
      } else {
        // Show error message from the server
        setError(response.data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error posting conversation:', error);
      // Show error message to the user
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to connect to server. Please check if the backend is running.';
      setError(errorMessage);
    } finally {
      // Stop the loading indicator regardless of success or failure
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Left sidebar with navigation links */}
      <Sidebar />

      {/* Main chat area */}
      <main className="chat">
        {/* Top header bar with app title and avatar */}
        <ChatHeader />

        {/* Error message display */}
        {error && (
          <div style={{
            backgroundColor: '#ff4444',
            color: 'white',
            padding: '12px 16px',
            margin: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0 4px'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Scrollable list of conversation messages */}
        <MessageList
          conversations={conversations}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />

        {/* Bottom input area for typing and sending messages */}
        <ChatInput
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default App;
