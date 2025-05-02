import React, { useState, useRef } from 'react';
import Button from '../common/Button';
import DeckCardList from './DeckCardList';
import styles from './DeckManager.module.css';

/**
 * DeckManager component
 * Manages deck name, actions, and card list
 */
const DeckManager = ({
  deckName,
  onDeckNameChange,
  deckCards,
  onRemoveCard,
  onAddCard,
  onClearDeck,
  onImportDeck,
  onExportDeck,
  onSaveDeck,
  allCards
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempDeckName, setTempDeckName] = useState(deckName);
  const nameInputRef = useRef(null);
  
  // Calculate total cards in deck
  const totalCards = Array.from(deckCards.values()).reduce((sum, qty) => sum + qty, 0);
  
  // Handle edit name button click
  const handleEditName = () => {
    setTempDeckName(deckName);
    setIsEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 0);
  };
  
  // Handle name input change
  const handleNameChange = (e) => {
    setTempDeckName(e.target.value);
  };
  
  // Handle name save
  const handleNameSave = () => {
    if (tempDeckName.trim()) {
      onDeckNameChange(tempDeckName);
    }
    setIsEditingName(false);
  };
  
  // Handle key press in name input
  const handleNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
    }
  };
  
  // Find card data by ID
  const getCardById = (cardId) => {
    return allCards.find(card => card.id === cardId);
  };
  
  // Convert deck cards Map to array of cards with quantities
  const getDeckCardsList = () => {
    return Array.from(deckCards.entries()).map(([id, quantity]) => {
      const card = getCardById(id);
      return card ? { ...card, quantity } : null;
    }).filter(Boolean);
  };

  return (
    <div className={styles.deckManager}>
      <div className={styles.deckHeader}>
        <div className={styles.deckNameContainer}>
          {isEditingName ? (
            <input
              ref={nameInputRef}
              type="text"
              className={styles.deckNameInput}
              value={tempDeckName}
              onChange={handleNameChange}
              onBlur={handleNameSave}
              onKeyDown={handleNameKeyPress}
              maxLength={30}
            />
          ) : (
            <h2 className={styles.deckName}>{deckName}</h2>
          )}
          <button 
            className={styles.editNameButton}
            onClick={handleEditName}
            title="Edit deck name"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        </div>
        
        <div className={styles.deckActions}>
          <Button onClick={onImportDeck} size="small">Import</Button>
          <Button onClick={onExportDeck} size="small">Export</Button>
          <Button onClick={onClearDeck} variant="secondary" size="small">Clear</Button>
          <Button onClick={onSaveDeck} size="small">Save</Button>
        </div>
      </div>
      
      <div className={styles.deckContent}>
        <DeckCardList 
          deckCards={getDeckCardsList()}
          onRemoveCard={onRemoveCard}
          onAddCard={cardId => {
            const card = getCardById(cardId);
            if (card) onAddCard(card);
          }}
        />
      </div>
      
      <div className={styles.deckStats}>
        <div className={styles.cardCounter}>
          <span className={totalCards >= 60 ? styles.maxCards : ''}>
            {totalCards}
          </span>
          <span>/60 Cards</span>
        </div>
      </div>
    </div>
  );
};

export default DeckManager;