import { Bot } from 'lucide-react';
import ChatMessage from '../ChatMessage/ChatMessage';
import styles from './MessageList.module.css';

/**
 * MessageList component that renders the scrollable list of messages.
 * Shows an empty state prompt when there are no messages,
 * renders each message using ChatMessage, and displays a
 * loading indicator while waiting for an AI response.
 * @param {Array} conversations - Array of message objects with id, role, content
 * @param {boolean} isLoading - Whether an AI response is being generated
 * @param {React.Ref} messagesEndRef - Ref for auto-scrolling to bottom
 */
export default function MessageList({
  conversations,
  isLoading,
  messagesEndRef,
}) {
  return (
    <div className={styles.messages}>
      {/* Show empty state prompt or render message list */}
      {conversations.length === 0 ? (
        <div className={styles.empty}>What are you working on?</div>
      ) : (
        conversations.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))
      )}

      {/* Loading indicator with animated dots while AI is generating */}
      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingAvatar}>
            <Bot size={18} color="white" />
          </div>
          <div className={styles.loading}>
            <div className={styles.loadingDot}></div>
            <div className={styles.loadingDot}></div>
            <div className={styles.loadingDot}></div>
          </div>
        </div>
      )}

      {/* Invisible element used as scroll anchor for auto-scrolling */}
      <div ref={messagesEndRef} />
    </div>
  );
}
