import React from 'react';
import GameCard from './GameCard';
import styles from './GameGrid.module.css';

const GameGrid = ({
  games = [],
  onGameClick,
  onGameManage,
  onCreateGame,
  className = '',
  ...props
}) => {
  // Empty state when no games are available
  if (!games.length) {
    return (
      <div className={styles.emptyState}>
        <h3 className={styles.emptyStateTitle}>No Games Created Yet</h3>
        <p className={styles.emptyStateText}>
          Create your first game to get started building your TCG world.
        </p>
        <button className="btn" onClick={onCreateGame}>Create New Game</button>
      </div>
    );
  }

  return (
    <div className={`${styles.gameGridContainer} ${className}`} {...props}>
      <div className={styles.gamesGrid}>
        {games.map(game => (
          <GameCard
            key={game.id}
            game={game}
            onClick={onGameClick}
            onManage={onGameManage}
          />
        ))}
      </div>
    </div>
  );
};

export default GameGrid;