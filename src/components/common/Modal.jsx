import React, { useEffect } from 'react';
import styles from './Modal.module.css';

/**
 * Reusable Modal component
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility of the modal
 * @param {function} props.onClose - Function to call when modal is closed
 * @param {string} props.title - Title of the modal
 * @param {React.ReactNode} props.children - Content of the modal
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;