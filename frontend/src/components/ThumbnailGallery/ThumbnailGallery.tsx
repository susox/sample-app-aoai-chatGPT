import styles from './ThumbnailGallery.module.css'

interface ThumbnailGalleryProps {
  thumbnails: string[];
  removeImage: (index: number) => void;
}

//TODO :: make thumbnail open in a model to see the image in full-screen

const ThumbnailGallery: React.FC<ThumbnailGalleryProps> = ({ thumbnails, removeImage }) => {
  return (
    <div className={styles.thumbnailGallery}>
      {thumbnails.map((image, index) => (
        <div key={index} className={styles.thumbnailContainer}>
          <img src={image} alt={`Thumbnail ${index}`} className={styles.thumbnail} />
          <button className={styles.closeButton} onClick={() => removeImage(index)}>
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default ThumbnailGallery;
