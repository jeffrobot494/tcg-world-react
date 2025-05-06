import React from 'react';
import { useImagePreview } from '../../context/ImagePreviewContext';
import styles from './GlobalImagePreview.module.css';

const GlobalImagePreview = () => {
  const { previewImage } = useImagePreview();

  if (!previewImage) return null;

  return (
    <img
      src={previewImage.url}
      alt={previewImage.alt || 'Preview'}
      className={styles.preview}
    />
  );
};

export default GlobalImagePreview;