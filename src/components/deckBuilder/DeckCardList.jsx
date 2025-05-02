import React from 'react';
import styles from './DeckCardList.module.css';

/**
 * DeckCardList component
 * Renders the list of cards in the deck, grouped by type
 */
const DeckCardList = ({ deckCards, onRemoveCard, onAddCard }) => {
  // Group cards by type
  const groupedCards = deckCards.reduce((groups, card) => {
    const type = card.type || 'Other';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(card);
    return groups;
  }, {});
  
  // Sort cards within each group by name
  Object.keys(groupedCards).forEach(type => {
    groupedCards[type].sort((a, b) => a.name.localeCompare(b.name));
  });
  
  // Get type indicator class
  const getTypeIndicatorClass = (type) => {
    switch(type) {
      case 'Monster':
        return styles.monsterIndicator;
      case 'Spell':
        return styles.spellIndicator;
      case 'Trap':
        return styles.trapIndicator;
      default:
        return '';
    }
  };
  
  // If deck is empty
  if (deckCards.length === 0) {
    return (
      <div className={styles.emptyDeck}>
        <p>Your deck is empty.</p>
        <p>Add cards from the browser to build your deck.</p>
      </div>
    );
  }
  
  return (
    <div className={styles.deckCardList}>
      {/* Display cards by type */}
      {Object.keys(groupedCards).map(type => (
        <div key={type} className={styles.cardTypeSection}>
          <h3 className={styles.typeHeader}>{type} Cards ({groupedCards[type].length})</h3>
          
          <div className={styles.cardList}>
            {groupedCards[type].map(card => (
              <div key={card.id} className={styles.deckCard}>
                <div className={styles.cardInfo}>
                  <span className={`${styles.typeIndicator} ${getTypeIndicatorClass(card.type)}`}></span>
                  <span className={styles.cardName} title={card.name}>{card.name}</span>
                </div>
                
                <div className={styles.cardQuantity}>
                  <span className={styles.quantityText}>x{card.quantity}</span>
                  <div className={styles.quantityControls}>
                    <button 
                      className={styles.quantityButton}
                      onClick={() => onRemoveCard(card.id)}
                      title="Remove one copy"
                    >
                      −
                    </button>
                    <button 
                      className={styles.quantityButton}
                      onClick={() => onAddCard(card.id)}
                      title="Add one copy"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeckCardList;