import { ChevronDown } from 'lucide-react';
import styles from './ChatHeader.module.css';

/**
 * ChatHeader component that displays the top navigation bar.
 * Shows the application title "ChatGPT" with a dropdown arrow,
 * and a user avatar on the right side.
 */
export default function ChatHeader() {
  return (
    <header className={styles.header}>
      {/* Left side: App name with dropdown indicator */}
      <div className={styles.left}>
        <span>ChatGPT</span>
        <ChevronDown size={16} />
      </div>
      {/* Right side: User avatar with initials */}
      <div className={styles.right}>
        <div className={styles.avatar}>IT</div>
      </div>
    </header>
  );
}
