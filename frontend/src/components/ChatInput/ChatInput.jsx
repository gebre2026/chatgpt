import { useState } from 'react';
import { Plus, Mic, ArrowUp } from 'lucide-react';
import styles from './ChatInput.module.css';

/**
 * ChatInput component for the message input area.
 * Provides a text input with a send button and loading state.
 * Shows a submit button (ArrowUp) when there is text input,
 * otherwise shows a microphone icon.
 * @param {Function} handleSendMessage - Callback to send the message
 * @param {boolean} isLoading - Whether an AI response is being generated
 */
export default function ChatInput({ handleSendMessage, isLoading }) {
  // Current text input value
  const [input, setInput] = useState('');

  /**
   * Handles form submission: validates input, sends the message,
   * and clears the input field.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // Don't send if input is empty or AI is loading
    if (!input.trim() || isLoading) return;

    handleSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Plus icon for attaching files (placeholder) */}
        <div className={styles.icon}>
          <Plus size={20} />
        </div>

        {/* Text input field */}
        <input
          type="text"
          className={styles.input}
          placeholder="Ask anything"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />

        {/* Show submit button when there is text, otherwise show mic icon */}
        {input.trim() ? (
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            <ArrowUp size={18} />
          </button>
        ) : (
          <>
            <div className={styles.icon}>
              <Mic size={20} />
            </div>
          </>
        )}
      </form>
    </div>
  );
}
