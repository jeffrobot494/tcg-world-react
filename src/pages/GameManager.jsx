import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ROUTES, 
  getGameCardsRoute, 
  getGameDecksRoute, 
  getGameEditorRoute 
} from '../router/routes';
import Navbar from '../components/common/Navbar';
import Header from '../components/common/Header';
import Grid from '../components/common/Grid';
import ActionCard from '../components/gameManager/ActionCard';
import styles from './GameManager.module.css';

// Sample game data for reference - in a real app, this would come from an API
const sampleGames = [
  {
    id: '1',
    title: 'Fantasy Realms',
    icon: '🧙‍♂️',
  },
  {
    id: '2',
    title: 'Cyber Wars',
    icon: '🤖',
  },
  {
    id: '3',
    title: 'Ancient Battles',
    icon: '⚔️',
  }
];

const GameManager = () => {
  const { gameId } = useParams(); // Get the gameId from URL params
  const navigate = useNavigate();
  
  // Find the game data based on the gameId
  const gameData = sampleGames.find(game => game.id === gameId) || {
    id: gameId || '0',
    title: "Unknown Game",
    icon: "🎮"
  };
  
  // Define actions with proper routes for this specific game
  const gameActions = [
    {
      id: 'card-manager',
      title: 'Card Manager',
      description: 'Upload, edit, and organize your game\'s cards. Manage card attributes, images, and balance your gameplay.',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
              <path d="M12 6v12"></path>
              <path d="M6 12h12"></path>
            </svg>,
      buttonText: 'Manage Cards',
      route: getGameCardsRoute(gameId)
    },
    {
      id: 'deck-builder',
      title: 'Deck Builder',
      description: 'Access your game\'s deck builder to test card interactions, create example decks, and test game balance.',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>,
      buttonText: 'Open Deck Builder',
      route: getGameDecksRoute(gameId)
    },
    {
      id: 'game-page',
      title: 'Game Page Editor',
      description: 'Customize your game\'s public page, upload artwork, write game lore, and showcase features.',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>,
      buttonText: 'Edit Game Page',
      route: getGameEditorRoute(gameId)
    }
  ];
  
  const handleActionClick = (route) => {
    // Navigate to the specified route
    navigate(route);
  };
  
  const handleBackToDashboard = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className={styles.gameManagerContainer}>
      <Navbar 
        gameTitle={gameData.title} 
        showTcgWorldLink={true} 
        onNavigate={handleBackToDashboard}
      />
      
      <div className={styles.content}>
        <Header
          title="Game Manager"
          subtitle="Manage your game, cards, and player experience"
          icon={gameData.icon}
          iconBackground="#7c3aed"
        />
        
        <div className={styles.actionsContainer}>
          <h2 className={styles.sectionHeader}>Manage Your Game</h2>
          
          <Grid size="md" gap="md" className={styles.actionsGrid}>
            {gameActions.map(action => (
              <ActionCard 
                key={action.id}
                title={action.title}
                description={action.description}
                icon={action.icon}
                buttonText={action.buttonText}
                onClick={() => handleActionClick(action.route)}
              />
            ))}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default GameManager;