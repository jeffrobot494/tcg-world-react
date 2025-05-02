import React, { useState, useEffect } from 'react';
import { gameService } from '../../services/gameService';
import styles from './GameApiTest.module.css';

/**
 * Test component for the Game API
 * Demonstrates how to use the game service to perform CRUD operations
 */
const GameApiTest = () => {
  // State for games data
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for new game form
  const [newGame, setNewGame] = useState({
    title: '',
    description: '',
    icon: '🎮'
  });

  // State for selected game (for editing)
  const [selectedGame, setSelectedGame] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load games on component mount
  useEffect(() => {
    loadGames();
  }, []);

  // Function to load all games
  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await gameService.getGames();
      if (response.success) {
        setGames(response.data);
      } else {
        setError(response.error.message);
      }
    } catch (err) {
      setError('Failed to load games');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (isEditing) {
      setSelectedGame(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setNewGame(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle game creation
  const handleCreateGame = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const response = await gameService.createGame(newGame);
      if (response.success) {
        // Add the new game to the list
        setGames(prev => [...prev, response.data]);
        // Reset the form
        setNewGame({
          title: '',
          description: '',
          icon: '🎮'
        });
      } else {
        setError(response.error.message);
      }
    } catch (err) {
      setError('Failed to create game');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle game update
  const handleUpdateGame = async (e) => {
    e.preventDefault();
    if (!selectedGame) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await gameService.updateGame(selectedGame.id, {
        title: selectedGame.title,
        description: selectedGame.description,
        icon: selectedGame.icon
      });
      
      if (response.success) {
        // Update the game in the list
        setGames(prev => 
          prev.map(game => 
            game.id === selectedGame.id ? response.data : game
          )
        );
        
        // Reset editing state
        setSelectedGame(null);
        setIsEditing(false);
      } else {
        setError(response.error.message);
      }
    } catch (err) {
      setError('Failed to update game');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (game) => {
    setSelectedGame({ ...game });
    setIsEditing(true);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setSelectedGame(null);
    setIsEditing(false);
  };

  // Handle game deletion
  const handleDeleteGame = async (gameId) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        setLoading(true);
        setError(null);
        
        const response = await gameService.deleteGame(gameId);
        if (response.success) {
          // Remove the game from the list
          setGames(prev => prev.filter(game => game.id !== gameId));
        } else {
          setError(response.error.message);
        }
      } catch (err) {
        setError('Failed to delete game');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Game API Test</h1>
      
      {error && (
        <div className={styles.error}>
          Error: {error}
        </div>
      )}
      
      {/* Create/Edit Game Form */}
      <div className={styles.formContainer}>
        <h2>{isEditing ? 'Edit Game' : 'Create New Game'}</h2>
        <form onSubmit={isEditing ? handleUpdateGame : handleCreateGame}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={isEditing ? selectedGame.title : newGame.title}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={isEditing ? selectedGame.description : newGame.description}
              onChange={handleInputChange}
              className={styles.textarea}
              rows="3"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="icon">Icon:</label>
            <select
              id="icon"
              name="icon"
              value={isEditing ? selectedGame.icon : newGame.icon}
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
          
          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              disabled={loading}
              className={styles.button}
            >
              {loading ? 'Processing...' : isEditing ? 'Update Game' : 'Create Game'}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Games List */}
      <div className={styles.gameListContainer}>
        <div className={styles.gameListHeader}>
          <h2>Games List</h2>
          <button 
            onClick={loadGames} 
            disabled={loading}
            className={`${styles.button} ${styles.buttonSmall}`}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {loading && !games.length ? (
          <p className={styles.loading}>Loading games...</p>
        ) : (
          <div className={styles.gameList}>
            {games.map(game => (
              <div key={game.id} className={styles.gameCard}>
                <div className={styles.gameCardHeader}>
                  <h3 className={styles.gameTitle}>
                    <span className={styles.gameIcon}>{game.icon}</span> {game.title}
                  </h3>
                  <div className={styles.gameActions}>
                    <button 
                      onClick={() => handleEditClick(game)}
                      className={`${styles.button} ${styles.buttonSmall}`}
                      title="Edit Game"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteGame(game.id)}
                      className={`${styles.button} ${styles.buttonSmall} ${styles.buttonDanger}`}
                      title="Delete Game"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className={styles.gameDescription}>{game.description}</p>
                <div className={styles.gameStats}>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Cards:</span> {game.cardCount}
                  </div>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Decks:</span> {game.deckCount}
                  </div>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Created:</span> {new Date(game.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            
            {!loading && !games.length && (
              <p className={styles.noData}>No games found. Create one to get started!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameApiTest;