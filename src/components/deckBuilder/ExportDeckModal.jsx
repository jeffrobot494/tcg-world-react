import React, { useState } from 'react';
import Button from '../common/Button';
import styles from './ExportDeckModal.module.css';

/**
 * ExportDeckModal component
 * Modal for exporting the deck in various formats
 */
const ExportDeckModal = ({
  deckName,
  deckCards,
  allCards,
  onClose
}) => {
  const [copiedField, setCopiedField] = useState(null);
  
  // Generate random deck ID (in real app, this would come from backend)
  const deckId = `deck_${Math.random().toString(36).substring(2, 10)}`;
  
  // Generate shareable URL
  const shareableUrl = `https://tcg-world.com/decks/${deckId}`;
  
  // Generate deck image URL (placeholder)
  const deckImageUrl = `https://tcg-world.com/deck-image/${deckId}.png`;
  
  // Get a card by its ID
  const getCardById = (cardId) => {
    return allCards.find(card => card.id === cardId);
  };
  
  // Generate text version of deck
  const getDeckText = () => {
    const lines = [`// ${deckName} - TCG World Deck`];
    
    // Group cards by type
    const cardsByType = {};
    
    deckCards.forEach((quantity, cardId) => {
      const card = getCardById(cardId);
      if (!card) return;
      
      const type = card.type || 'Other';
      if (!cardsByType[type]) {
        cardsByType[type] = [];
      }
      
      cardsByType[type].push({ ...card, quantity });
    });
    
    // Add cards by type
    Object.keys(cardsByType).forEach(type => {
      lines.push(`\n// ${type} Cards`);
      
      cardsByType[type].sort((a, b) => a.name.localeCompare(b.name))
        .forEach(card => {
          lines.push(`${card.quantity} ${card.name} (${card.id})`);
        });
    });
    
    return lines.join('\n');
  };
  
  // Handle copying to clipboard
  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        alert('Failed to copy to clipboard');
      });
  };
  
  // Handle download as text file
  const handleDownload = () => {
    const deckText = getDeckText();
    const blob = new Blob([deckText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deckName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Export Deck: {deckName}</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            title="Close"
          >
            &times;
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.exportOption}>
            <h3 className={styles.optionTitle}>Deck Image URL</h3>
            <p className={styles.optionDescription}>
              Share this URL to show an image of your deck
            </p>
            <div className={styles.copyField}>
              <input
                type="text"
                readOnly
                value={deckImageUrl}
                className={styles.copyInput}
              />
              <Button
                variant="secondary"
                onClick={() => handleCopy(deckImageUrl, 'image')}
                className={styles.copyButton}
              >
                {copiedField === 'image' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
          
          <div className={styles.exportOption}>
            <h3 className={styles.optionTitle}>Sharable Deck URL</h3>
            <p className={styles.optionDescription}>
              Share this URL to let others view and import your deck
            </p>
            <div className={styles.copyField}>
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className={styles.copyInput}
              />
              <Button
                variant="secondary"
                onClick={() => handleCopy(shareableUrl, 'share')}
                className={styles.copyButton}
              >
                {copiedField === 'share' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
          
          <div className={styles.exportOption}>
            <h3 className={styles.optionTitle}>Deck as Text</h3>
            <p className={styles.optionDescription}>
              Copy or download your deck as a text file
            </p>
            <div className={styles.textareaField}>
              <textarea
                readOnly
                value={getDeckText()}
                className={styles.exportTextarea}
              />
              <div className={styles.textareaButtons}>
                <Button
                  variant="secondary"
                  onClick={() => handleCopy(getDeckText(), 'text')}
                >
                  {copiedField === 'text' ? 'Copied!' : 'Copy Text'}
                </Button>
                <Button onClick={handleDownload}>
                  Download as File
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default ExportDeckModal;