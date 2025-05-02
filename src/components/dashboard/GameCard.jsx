import React from 'react';
import styles from './GameCard.module.css';

const GameCard = ({
  game,
  onClick,
  onManage,
  className = '',
  ...props
}) => {
  const {
    id,
    title,
    description,
    imageUrl,
    cardCount = 0,
    deckCount = 0,
    playerCount = 0,
    lastUpdated,
  } = game;

  // Activity percentage for demo (would normally be calculated)
  const activityPercent = Math.floor(Math.random() * 30) + 5;

  return (
    <div 
      className={`${styles.gameCard} ${className}`}
      onClick={() => onClick(id)}
      {...props}
    >
      <div className={styles.gameImage}>
        <img src={imageUrl} alt={title} />
        <div className={styles.gameOverlay}>
          <div className={styles.gameTitle}>{title}</div>
          <div className={styles.gameCreator}>by You</div>
          <div className={styles.gameStats}>
            <div className={styles.gameStat}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              {playerCount} players
            </div>
            <div className={styles.gameStat}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              {deckCount} decks
            </div>
            <div className={`${styles.gameStat} ${styles.statIncrease}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              Activity: {activityPercent}%
            </div>
          </div>
        </div>
      </div>
      <div className={styles.gameInfo}>
        <p className={styles.gameDescription}>{description}</p>
        <button 
          className={styles.btnOutline}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onManage(id);
          }}
        >
          Manage Game
        </button>
      </div>
    </div>
  );
};

export default GameCard;