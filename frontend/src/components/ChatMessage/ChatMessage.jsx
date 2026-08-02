import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// CSS module styles for the chat message component
import styles from './ChatMessage.module.css';

/**
 * ChatMessage component that renders a single message bubble.
 * User messages are displayed as plain text, while assistant
 * messages are rendered as Markdown for rich formatting.
 * @param {string} role - Either 'user' or 'assistant'
 * @param {string} content - The message text content
 */
export default function ChatMessage({ role, content }) {
  return (
    <div className={`${styles.message} ${styles[role]}`}>
      {/* Avatar icon showing either User or Bot icon based on role */}
      <div className={`${styles.avatar} ${styles[role]}`}>
        {role === 'user' ? (
          <User size={18} color='white' />
        ) : (
          <Bot size={18} color='white' />
        )}
      </div>
      {/* Message content: plain text for user, Markdown for assistant */}
      <div className={styles.content}>
        {role === 'user' ? (
          content
        ) : (
          <div className={styles.markdownBody}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
