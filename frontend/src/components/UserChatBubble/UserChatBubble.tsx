import styles from './UserChatBubble.module.css';
import ThumbnailGallery from '../ThumbnailGallery/ThumbnailGallery';

interface UserChatBubbleProps {
    message: string;
    images: string[];
}

const UserChatBubble: React.FC<UserChatBubbleProps> = ({ message, images }) => {
  return (
    <div className={styles.chatMessageUser} tabIndex={0}>
        <div className={styles.chatMessageUserMessage}>
            {message && (
                <div className={styles.chatMessageUserText}>{message}</div>
            )}
            {images.length > 0 && (
                <div className={styles.chatMessageUserImages}>
                    <ThumbnailGallery thumbnails={images} showRemoveButton={false} />
                </div>
            )}
        </div>
    </div>
  );
};

export default UserChatBubble;