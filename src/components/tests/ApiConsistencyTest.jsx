import React, { useState, useEffect } from 'react';
import { gameService } from '../../services/gameService';
import { cardService } from '../../services/cardService';
import { deckService } from '../../services/deckService';
import styles from './ApiConsistencyTest.module.css';

/**
 * Test component to demonstrate relational integrity between
 * games, cards, and decks in the mock API system
 */
const ApiConsistencyTest = () => {
  // State for API data
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [cards, setCards] = useState([]);
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  
  // Loading and error states
  const [loading, setLoading] = useState({
    games: false,
    cards: false,
    decks: false,
    deck: false
  });
  const [error, setError] = useState({
    games: null,
    cards: null,
    decks: null,
    deck: null
  });
  
  // Load games on component mount
  useEffect(() => {
    fetchGames();
  }, []);
  
  // Load cards and decks when a game is selected
  useEffect(() => {
    if (selectedGame) {
      fetchCards(selectedGame.id);
      fetchDecks(selectedGame.id);
    } else {
      setCards([]);
      setDecks([]);
    }
  }, [selectedGame]);
  
  // Fetch games from the API
  const fetchGames = async () => {
    setLoading(prev => ({ ...prev, games: true }));
    setError(prev => ({ ...prev, games: null }));
    
    try {
      const response = await gameService.getGames();
      
      if (response.success) {
        setGames(response.data);
      } else {
        setError(prev => ({ ...prev, games: response.error.message }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, games: 'Failed to load games' }));
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, games: false }));
    }
  };
  
  // Fetch cards for a game
  const fetchCards = async (gameId) => {
    setLoading(prev => ({ ...prev, cards: true }));
    setError(prev => ({ ...prev, cards: null }));
    
    try {
      const response = await cardService.getCards(gameId);
      
      if (response.success) {
        setCards(response.data);
      } else {
        setError(prev => ({ ...prev, cards: response.error.message }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, cards: 'Failed to load cards' }));
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, cards: false }));
    }
  };
  
  // Fetch decks for a game
  const fetchDecks = async (gameId) => {
    setLoading(prev => ({ ...prev, decks: true }));
    setError(prev => ({ ...prev, decks: null }));
    
    try {
      const response = await deckService.getDecks(gameId);
      
      if (response.success) {
        setDecks(response.data);
      } else {
        setError(prev => ({ ...prev, decks: response.error.message }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, decks: 'Failed to load decks' }));
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, decks: false }));
    }
  };
  
  // Fetch a specific deck with card details
  const fetchDeck = async (deckId) => {
    setLoading(prev => ({ ...prev, deck: true }));
    setError(prev => ({ ...prev, deck: null }));
    
    try {
      const response = await deckService.getDeck(deckId);
      
      if (response.success) {
        setSelectedDeck(response.data);
      } else {
        setError(prev => ({ ...prev, deck: response.error.message }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, deck: 'Failed to load deck details' }));
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, deck: false }));
    }
  };
  
  // Delete a card
  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card? It will also be removed from any decks that use it.')) {
      return;
    }
    
    setLoading(prev => ({ ...prev, cards: true }));
    
    try {
      const response = await cardService.deleteCard(cardId);
      
      if (response.success) {
        // Refresh data to show changes
        if (selectedGame) {
          fetchCards(selectedGame.id);
          fetchDecks(selectedGame.id);
          
          // If a deck is selected, refresh it too
          if (selectedDeck) {
            fetchDeck(selectedDeck.id);
          }
        }
      } else {
        setError(prev => ({ ...prev, cards: response.error.message }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, cards: 'Failed to delete card' }));
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, cards: false }));
    }
  };
  
  // Handle game selection
  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setSelectedDeck(null);
  };
  
  // Handle deck selection
  const handleDeckSelect = (deck) => {
    fetchDeck(deck.id);
  };
  
  // Create a new sample card
  const handleCreateSampleCard = async () => {
    if (!selectedGame) {
      alert('Please select a game first');
      return;
    }
    
    const cardTypes = ['Monster', 'Spell', 'Trap'];
    const rarities = ['Common', 'Uncommon', 'Rare', 'Ultra Rare'];
    
    const newCard = {
      name: `Sample ${cardTypes[Math.floor(Math.random() * cardTypes.length)]} ${Date.now().toString().slice(-4)}`,
      type: cardTypes[Math.floor(Math.random() * cardTypes.length)],
      rarity: rarities[Math.floor(Math.random() * rarities.length)],
      description: `This is a sample card created for testing at ${new Date().toLocaleTimeString()}`,
      attributes: {
        cost: Math.floor(Math.random() * 10) + 1
      }
    };
    
    try {
      const response = await cardService.createCard(selectedGame.id, newCard);
      
      if (response.success) {
        // Refresh cards
        fetchCards(selectedGame.id);
        // Also refresh the game to see updated card count
        fetchGames();
      } else {
        alert(`Error creating card: ${response.error.message}`);
      }
    } catch (err) {
      alert('Failed to create card');
      console.error(err);
    }
  };
  
  // Create a sample deck with existing cards
  const handleCreateSampleDeck = async () => {
    if (!selectedGame) {
      alert('Please select a game first');
      return;
    }
    
    if (cards.length === 0) {
      alert('This game has no cards. Create some cards first.');
      return;
    }
    
    // Choose up to 3 random cards for the deck
    const cardCount = Math.min(3, cards.length);
    const selectedCards = [];
    const usedIndexes = new Set();
    
    // Select random cards
    for (let i = 0; i < cardCount; i++) {
      let index;
      do {
        index = Math.floor(Math.random() * cards.length);
      } while (usedIndexes.has(index));
      
      usedIndexes.add(index);
      selectedCards.push({
        cardId: cards[index].id,
        quantity: Math.floor(Math.random() * 3) + 1
      });
    }
    
    const newDeck = {
      name: `Sample Deck ${Date.now().toString().slice(-4)}`,
      description: `This is a sample deck created for testing at ${new Date().toLocaleTimeString()}`,
      cards: selectedCards,
      isPublic: true
    };
    
    try {
      const response = await deckService.createDeck(selectedGame.id, newDeck);
      
      if (response.success) {
        // Refresh decks
        fetchDecks(selectedGame.id);
        // Also refresh the game to see updated deck count
        fetchGames();
      } else {
        alert(`Error creating deck: ${response.error.message}`);
      }
    } catch (err) {
      alert('Failed to create deck');
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>API Consistency Test</h1>
      <p className={styles.description}>
        This test demonstrates relational integrity between games, cards, and decks.
        Try deleting a card used in a deck and watch it automatically get removed from the deck.
      </p>
      
      {/* Games Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Games</h2>
          <button 
            onClick={fetchGames}
            className={styles.refreshButton}
            disabled={loading.games}
          >
            Refresh
          </button>
        </div>
        
        {error.games && <div className={styles.error}>{error.games}</div>}
        
        {loading.games ? (
          <div className={styles.loading}>Loading games...</div>
        ) : (
          <div className={styles.gameGrid}>
            {games.map(game => (
              <div 
                key={game.id}
                className={`${styles.gameCard} ${selectedGame?.id === game.id ? styles.selectedCard : ''}`}
                onClick={() => handleGameSelect(game)}
              >
                <div className={styles.gameIcon}>{game.icon}</div>
                <div className={styles.gameInfo}>
                  <h3>{game.title}</h3>
                  <div className={styles.gameCounts}>
                    <span>Cards: {game.cardCount}</span>
                    <span>Decks: {game.deckCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Actions */}
      {selectedGame && (
        <div className={styles.actions}>
          <h3>Selected Game: {selectedGame.title}</h3>
          <button onClick={handleCreateSampleCard} className={styles.button}>
            Create Sample Card
          </button>
          <button onClick={handleCreateSampleDeck} className={styles.button}>
            Create Sample Deck
          </button>
        </div>
      )}
      
      {/* Cards and Decks */}
      {selectedGame && (
        <div className={styles.contentGrid}>
          {/* Cards Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Cards</h2>
              <button 
                onClick={() => fetchCards(selectedGame.id)}
                className={styles.refreshButton}
                disabled={loading.cards}
              >
                Refresh
              </button>
            </div>
            
            {error.cards && <div className={styles.error}>{error.cards}</div>}
            
            {loading.cards ? (
              <div className={styles.loading}>Loading cards...</div>
            ) : (
              <div className={styles.cardsList}>
                {cards.length === 0 ? (
                  <div className={styles.emptyState}>No cards found for this game</div>
                ) : (
                  cards.map(card => (
                    <div key={card.id} className={styles.cardItem}>
                      <div className={styles.cardHeader}>
                        <div className={styles.cardName}>
                          <span className={`${styles.cardType} ${styles[card.type.toLowerCase()]}`}></span>
                          {card.name}
                        </div>
                        <button 
                          onClick={() => handleDeleteCard(card.id)}
                          className={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                      <div className={styles.cardDetails}>
                        <div>{card.type} - {card.rarity}</div>
                        <div className={styles.cardId}>ID: {card.id}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          
          {/* Decks Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Decks</h2>
              <button 
                onClick={() => fetchDecks(selectedGame.id)}
                className={styles.refreshButton}
                disabled={loading.decks}
              >
                Refresh
              </button>
            </div>
            
            {error.decks && <div className={styles.error}>{error.decks}</div>}
            
            {loading.decks ? (
              <div className={styles.loading}>Loading decks...</div>
            ) : (
              <div className={styles.decksList}>
                {decks.length === 0 ? (
                  <div className={styles.emptyState}>No decks found for this game</div>
                ) : (
                  decks.map(deck => (
                    <div 
                      key={deck.id} 
                      className={`${styles.deckItem} ${selectedDeck?.id === deck.id ? styles.selectedDeck : ''}`}
                      onClick={() => handleDeckSelect(deck)}
                    >
                      <h3>{deck.name}</h3>
                      <div className={styles.deckInfo}>
                        <span>Cards: {deck.cardCount}</span>
                        <span>Last updated: {new Date(deck.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Selected Deck Details */}
      {selectedDeck && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Deck Contents: {selectedDeck.name}</h2>
            <button 
              onClick={() => fetchDeck(selectedDeck.id)}
              className={styles.refreshButton}
              disabled={loading.deck}
            >
              Refresh
            </button>
          </div>
          
          {error.deck && <div className={styles.error}>{error.deck}</div>}
          
          {loading.deck ? (
            <div className={styles.loading}>Loading deck contents...</div>
          ) : (
            <div className={styles.deckContents}>
              {selectedDeck.cards.length === 0 ? (
                <div className={styles.emptyState}>This deck is empty</div>
              ) : (
                <table className={styles.deckTable}>
                  <thead>
                    <tr>
                      <th>Card ID</th>
                      <th>Card Name</th>
                      <th>Type</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDeck.cards.map(deckCard => {
                      // Find full card info
                      const cardInfo = selectedDeck.expandedCards?.find(
                        c => c.cardId === deckCard.cardId
                      )?.card;
                      
                      return (
                        <tr key={deckCard.cardId}>
                          <td>{deckCard.cardId}</td>
                          <td>{cardInfo ? cardInfo.name : 'Unknown Card'}</td>
                          <td>{cardInfo ? cardInfo.type : 'N/A'}</td>
                          <td>{deckCard.quantity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiConsistencyTest;