import React from 'react';
import Card from '../common/Card';
import styles from './DeckBuilderCardGrid.module.css';

/**
 * DeckBuilderCardGrid component
 * Displays cards in a grid with click-to-add functionality
 */
const DeckBuilderCardGrid = ({ cards, onCardClick }) => {
  // Function to get appropriate icon based on card type
  const getCardTypeIcon = (type) => {
    switch(type) {
      case 'Monster':
        return '👹';
      case 'Spell':
        return '✨';
      case 'Trap':
        return '⚠️';
      default:
        return '🃏';
    }
  };
  
  // Function to get appropriate CSS class based on card type
  const getCardTypeClass = (type) => {
    switch(type) {
      case 'Monster':
        return styles.monsterCard;
      case 'Spell':
        return styles.spellCard;
      case 'Trap':
        return styles.trapCard;
      default:
        return '';
    }
  };
  
  return (
    <div className={styles.cardGrid}>
      {cards.length > 0 ? (
        cards.map(card => (
          <div 
            key={card.id}
            className={styles.cardContainer}
            onClick={() => onCardClick(card)}
          >
            <Card>
              <div className={`${styles.cardImage} ${getCardTypeClass(card.type)}`}>
                <div className={styles.cardIcon}>{getCardTypeIcon(card.type)}</div>
                <div className={styles.cardBanner}>{card.name}</div>
              </div>
              <div className={styles.cardInfo}>
                <p className={styles.cardName}>{card.name}</p>
                <p className={styles.cardType}>
                  {card.type} - {card.rarity}
                </p>
              </div>
            </Card>
          </div>
        ))
      ) : (
        <div className={styles.noResults}>
          <p>No cards match your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default DeckBuilderCardGrid;