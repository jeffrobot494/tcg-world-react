import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGameManagerRoute } from '../router/routes';
import Navbar from '../components/common/Navbar';
import Header from '../components/common/Header';
import GameGrid from '../components/dashboard/GameGrid';
import styles from './Dashboard.module.css';

// Sample game data for testing
const sampleGames = [
  {
    id: '1',
    title: 'Fantasy Realms',
    description: 'A strategic card game set in a world of magic and mythical creatures. Build your realm and conquer your enemies.',
    imageUrl: 'https://via.placeholder.com/600x400?text=Fantasy+Realms',
    cardCount: 248,
    deckCount: 57,
    playerCount: 132,
    lastUpdated: '2023-05-15',
  },
  {
    id: '2',
    title: 'Cyber Wars',
    description: 'Futuristic cyberpunk card game where corporations battle for control of the digital realm.',
    imageUrl: 'https://via.placeholder.com/600x400?text=Cyber+Wars',
    cardCount: 185,
    deckCount: 23,
    playerCount: 78,
    lastUpdated: '2023-06-22',
  },
  {
    id: '3',
    title: 'Ancient Battles',
    description: 'Step back in time and command historical armies in epic confrontations that shaped civilizations.',
    imageUrl: 'https://via.placeholder.com/600x400?text=Ancient+Battles',
    cardCount: 312,
    deckCount: 41,
    playerCount: 95,
    lastUpdated: '2023-04-03',
  }
];

const Dashboard = () => {
  const [games, setGames] = useState(sampleGames);
  const navigate = useNavigate();
  
  // Game handlers
  const handleCreateGame = () => {
    alert('Create new game functionality would go here');
  };
  
  const handleGameClick = (gameId) => {
    // Navigate to the game manager
    navigate(getGameManagerRoute(gameId));
  };
  
  const handleGameManage = (gameId) => {
    // Navigate to the game manager
    navigate(getGameManagerRoute(gameId));
  };

  return (
    <div className={styles.dashboardContainer}>
      <Navbar />
      <div className={styles.dashboard}>
        <Header
          title="Creator Dashboard"
          subtitle="Manage your games and analyze player engagement"
        />
        
        <button className={styles.createBtn} onClick={handleCreateGame}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          Create New Game
        </button>
        
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Your Games</h3>
          <a href="#" className={styles.viewAll}>View All</a>
        </div>
        
        <GameGrid 
          games={games}
          onGameClick={handleGameClick}
          onGameManage={handleGameManage}
          onCreateGame={handleCreateGame}
        />
      </div>
    </div>
  );
};

export default Dashboard;