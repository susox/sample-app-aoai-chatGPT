import { useState } from 'react';
import styles from './ThumbnailGallery.module.css'

interface ThumbnailGalleryProps {
  thumbnails: string[];
  removeImage?: (index: number) => void;
  showRemoveButton?: boolean;
}

//TODO :: make thumbnail open in a model to see the image in full-screen

const ThumbnailGallery: React.FC<ThumbnailGalleryProps> = ({ thumbnails, removeImage, showRemoveButton = true }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };


  return (
    <div>
      <div className={styles.thumbnailGallery}>
        {thumbnails.map((image, index) => (
          <div key={index} className={styles.thumbnailContainer}>
            <img src={image} alt={`Thumbnail ${index}`} className={styles.thumbnail} onClick={() => openModal(image)} />
            {showRemoveButton && removeImage && (
              <button className={styles.closeButton} onClick={() => removeImage(index)}>
                &times;
              </button>
          )}
          </div>
        ))}
      </div>

      {isModalOpen && selectedImage && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <img src={selectedImage} alt="Selected" className={styles.modalImage} />
              <button onClick={closeModal} className={styles.closeButton}>
                &times;
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default ThumbnailGallery;
