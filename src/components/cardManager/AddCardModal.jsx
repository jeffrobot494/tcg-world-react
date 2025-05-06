import React, { useState, useRef } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import styles from './AddCardModal.module.css';

/**
 * Modal for adding new cards to the Card Manager
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility of the modal
 * @param {function} props.onClose - Function to call when modal is closed
 * @param {function} props.onAddCards - Function to call with the number of cards to add and image files
 */
const AddCardModal = ({ isOpen, onClose, onAddCards }) => {
  const [cardCount, setCardCount] = useState(1);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    const numValue = parseInt(value, 10);
    
    // Clear error when input changes
    setError('');
    
    // Allow empty input for typing
    if (value === '') {
      setCardCount('');
      return;
    }
    
    // Validate input is a number
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }
    
    setCardCount(numValue);
  };

  // Handle image upload button click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setCardCount(selectedFiles.length);
    }
  };

  // Helper function to upload files with progress
  const uploadFiles = async (files, onProgress) => {
    // In a mock environment, simulate real upload
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        onProgress(Math.min(progress, 100));
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            resolve({ success: true, fileData: [...files] });
          }, 500); // Small delay to show 100% before proceeding
        }
      }, 200);
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate number is between 1 and 100
    const numValue = parseInt(cardCount, 10);
    
    if (isNaN(numValue) || numValue < 1) {
      setError('Please enter a number greater than 0');
      return;
    }
    
    if (numValue > 100) {
      setError('Please enter a number less than or equal to 100');
      return;
    }
    
    // Start upload process
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Upload files and track real progress
      const filesToUpload = files.length > 0 ? files : Array(numValue).fill(null);
      const uploadResult = await uploadFiles(filesToUpload, (progress) => {
        setUploadProgress(progress);
      });
      
      // Call onAddCards with upload result
      await onAddCards(uploadResult);
      
      // Reset form and close modal
      setCardCount(1);
      setFiles([]);
      setIsUploading(false);
      setUploadProgress(0);
      onClose();
    } catch (error) {
      console.error('Error uploading cards:', error);
      setError('Upload failed: ' + (error.message || 'An unknown error occurred'));
      setIsUploading(false);
    }
  };

  // Reset form when modal is closed
  const handleClose = () => {
    // Don't close if currently uploading
    if (isUploading) return;
    
    setCardCount(1);
    setError('');
    setFiles([]);
    setUploadProgress(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Cards">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Upload Images
          </label>
          <p className={styles.uploadInstructions}>
            Upload multiple images. A new card will be created for each image.
          </p>
          
          <div className={styles.uploadSection}>
            <Button 
              type="button" 
              variant="secondary"
              onClick={handleUploadClick}
              className={styles.uploadButton}
            >
              Select Images
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className={styles.fileInput}
            />
            {files.length > 0 && (
              <span className={styles.fileCount}>
                {files.length} {files.length === 1 ? 'image' : 'images'} selected
              </span>
            )}
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="cardCount" className={styles.label}>
            How many cards would you like to add?
          </label>
          <input
            id="cardCount"
            type="number"
            min="1"
            max="100"
            className={styles.input}
            value={cardCount}
            onChange={handleInputChange}
          />
          {error && <p className={styles.error}>{error}</p>}
          <p className={styles.hint}>Enter a number between 1 and 100</p>
        </div>
        
        {isUploading && (
          <div className={styles.uploadingContainer}>
            <div className={styles.progressBarContainer}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className={styles.progressText}>
              Uploading... {Math.round(uploadProgress)}%
            </div>
          </div>
        )}
        
        <div className={styles.buttonGroup}>
          <Button
            variant="secondary"
            type="button"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Add Cards'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCardModal;