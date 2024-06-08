import styles from './UserChatBubble.module.css';

interface UserChatBubbleProps {
  message: string;
}

const UserChatBubble: React.FC<UserChatBubbleProps> = ({ message }) => {
  return (
    <div className={styles.chatMessageUser} tabIndex={0}>
      <div className={styles.chatMessageUserMessage}>{message}</div>
    </div>
  );
};

export default UserChatBubble;