import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGameManagerRoute } from '../router/routes';
import { gameService } from '../services/gameService';
import Navbar from '../components/common/Navbar';
import Header from '../components/common/Header';
import GameGrid from '../components/dashboard/GameGrid';
import styles from './Dashboard.module.css';

// Function to convert API game format to the format expected by GameCard
const formatGameForUI = (apiGame) => {
  return {
    id: apiGame.id,
    title: apiGame.title,
    description: apiGame.description || 'No description available',
    imageUrl: `https://via.placeholder.com/600x400?text=${encodeURIComponent(apiGame.title)}`,
    icon: apiGame.icon,
    cardCount: apiGame.cardCount || 0,
    deckCount: apiGame.deckCount || 0,
    playerCount: Math.floor(Math.random() * 100) + 10, // Random player count for now
    lastUpdated: apiGame.updatedAt ? new Date(apiGame.updatedAt).toLocaleDateString() : 'Unknown',
  };
};

const Dashboard = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Fetch games when component mounts
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await gameService.getGames();
        
        if (response.success) {
          // Format games for UI
          const formattedGames = response.data.map(formatGameForUI);
          setGames(formattedGames);
        } else {
          setError(response.error.message);
        }
      } catch (err) {
        setError('Failed to load games. Please try again later.');
        console.error('Error fetching games:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGames();
  }, []);
  
  // State for new game modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGame, setNewGame] = useState({
    title: '',
    description: '',
    icon: '🎮'
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  
  // Handle creating a new game
  const handleCreateGame = () => {
    setShowCreateModal(true);
  };
  
  // Handle input change for new game form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGame(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission for new game
  const handleSubmitNewGame = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      setCreateError(null);
      
      const response = await gameService.createGame(newGame);
      
      if (response.success) {
        // Add the new game to our list
        const formattedGame = formatGameForUI(response.data);
        setGames(prev => [...prev, formattedGame]);
        
        // Reset form and close modal
        setNewGame({
          title: '',
          description: '',
          icon: '🎮'
        });
        setShowCreateModal(false);
      } else {
        setCreateError(response.error.message);
      }
    } catch (err) {
      setCreateError('Failed to create game. Please try again.');
      console.error('Error creating game:', err);
    } finally {
      setCreating(false);
    }
  };
  
  // Close the create game modal
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setCreateError(null);
  };
  
  const handleGameClick = (gameId) => {
    console.log('handleGameClick called with gameId:', gameId);
    console.log('Navigating to:', getGameManagerRoute(gameId));
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
        
        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Retry
            </button>
          </div>
        )}
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading your games...</p>
          </div>
        ) : (
          <GameGrid 
            games={games}
            onGameClick={handleGameClick}
            onGameManage={handleGameManage}
            onCreateGame={handleCreateGame}
          />
        )}
      </div>
      
      {/* Create Game Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Create New Game</h3>
              <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
            </div>
            
            {createError && (
              <div className={styles.errorMessage}>
                <p>{createError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmitNewGame}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Game Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newGame.title}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                  placeholder="Enter your game's name"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newGame.description}
                  onChange={handleInputChange}
                  rows="3"
                  className={styles.textarea}
                  placeholder="Describe your game in a few sentences"
                ></textarea>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="icon">Icon</label>
                <select
                  id="icon"
                  name="icon"
                  value={newGame.icon}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="🎮">🎮 Game</option>
                  <option value="🧙‍♂️">🧙‍♂️ Fantasy</option>
                  <option value="🤖">🤖 Sci-Fi</option>
                  <option value="⚔️">⚔️ Battle</option>
                  <option value="🧩">🧩 Puzzle</option>
                </select>
              </div>
              
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={styles.cancelButton}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Game'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;