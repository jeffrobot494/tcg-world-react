import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import CardBrowser from '../components/deckBuilder/CardBrowser';
import DeckManager from '../components/deckBuilder/DeckManager';
import ExportDeckModal from '../components/deckBuilder/ExportDeckModal';
import { getGameManagerRoute } from '../router/routes';
import { gameService } from '../services/gameService';
import { cardService } from '../services/cardService';
import styles from './DeckBuilder.module.css';

/**
 * DeckBuilder page component
 * Allows users to build decks by adding cards from the card browser
 */
const DeckBuilder = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  
  // State for game data
  const [gameData, setGameData] = useState({
    id: gameId || '',
    title: 'Loading...',
    icon: '🎮'
  });
  const [gameDataLoading, setGameDataLoading] = useState(true);
  const [gameDataError, setGameDataError] = useState(null);
  
  // State for cards data and UI
  const [allCards, setAllCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [cardsError, setCardsError] = useState(null);
  
  // State for deck
  const [deckCards, setDeckCards] = useState(new Map());
  const [deckName, setDeckName] = useState("New Deck");
  
  // Search and filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0
  });
  
  // UI state
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Fetch game data when component mounts
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setGameDataLoading(true);
        setGameDataError(null);
        
        const response = await gameService.getGame(gameId);
        
        if (response.success) {
          setGameData({
            ...response.data,
            // Ensure icon is available
            icon: response.data.icon || '🎮'
          });
        } else {
          setGameDataError(response.error.message);
          setGameData({
            id: gameId || '',
            title: 'Unknown Game',
            icon: '🎮'
          });
        }
      } catch (err) {
        setGameDataError('Failed to load game data');
        console.error('Error fetching game data:', err);
      } finally {
        setGameDataLoading(false);
      }
    };
    
    if (gameId) {
      fetchGameData();
    }
  }, [gameId]);
  
  // Fetch cards data when component mounts
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setCardsLoading(true);
        setCardsError(null);
        
        const response = await cardService.getCards(gameId);
        
        if (response.success) {
          setAllCards(response.data);
          setPagination(prev => ({
            ...prev,
            totalItems: response.data.length
          }));
        } else {
          setCardsError(response.error.message);
          setAllCards([]);
        }
      } catch (err) {
        setCardsError('Failed to load cards');
        console.error('Error fetching cards:', err);
        setAllCards([]);
      } finally {
        setCardsLoading(false);
      }
    };
    
    if (gameId) {
      fetchCards();
    }
  }, [gameId]);
  
  // Apply search and type filter
  useEffect(() => {
    let filtered = allCards;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(card => 
        card.id.toLowerCase().includes(term) || 
        card.name.toLowerCase().includes(term) || 
        (card.type && card.type.toLowerCase().includes(term)) ||
        (card.rarity && card.rarity.toLowerCase().includes(term))
      );
    }
    
    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter(card => 
        card.type && card.type === typeFilter
      );
    }
    
    setFilteredCards(filtered);
    setPagination(prev => ({
      ...prev,
      totalItems: filtered.length,
      currentPage: 1  // Reset to first page on new search/filter
    }));
  }, [allCards, searchTerm, typeFilter]);
  
  // Apply pagination to filtered cards
  useEffect(() => {
    const { currentPage, itemsPerPage } = pagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCards = filteredCards.slice(startIndex, startIndex + itemsPerPage);
    setDisplayedCards(paginatedCards);
  }, [filteredCards, pagination]);
  
  // Handle search input
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  // Handle type filter change
  const handleTypeFilterChange = (type) => {
    setTypeFilter(type);
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (count) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage: count,
      currentPage: 1  // Reset to first page when changing items per page
    }));
  };
  
  // Handle adding a card to the deck
  const handleAddCardToDeck = (card) => {
    setDeckCards(prev => {
      const newDeck = new Map(prev);
      const currentQty = newDeck.get(card.id) || 0;
      
      // Check if adding would exceed 60 card limit
      const totalCards = Array.from(newDeck.values()).reduce((sum, qty) => sum + qty, 0);
      if (totalCards >= 60) {
        alert('Your deck is full (maximum 60 cards).');
        return prev;
      }
      
      newDeck.set(card.id, currentQty + 1);
      return newDeck;
    });
  };
  
  // Handle removing a card from the deck
  const handleRemoveCardFromDeck = (cardId) => {
    setDeckCards(prev => {
      const newDeck = new Map(prev);
      const currentQty = newDeck.get(cardId);
      
      if (!currentQty) return prev;
      
      if (currentQty <= 1) {
        newDeck.delete(cardId);
      } else {
        newDeck.set(cardId, currentQty - 1);
      }
      
      return newDeck;
    });
  };
  
  // Handle deck name change
  const handleDeckNameChange = (name) => {
    setDeckName(name);
  };
  
  // Clear the entire deck
  const handleClearDeck = () => {
    if (deckCards.size === 0) return;
    
    if (window.confirm('Are you sure you want to clear your deck?')) {
      setDeckCards(new Map());
    }
  };
  
  // Save the current deck
  const handleSaveDeck = () => {
    if (deckCards.size === 0) {
      alert('Your deck is empty. Add some cards first.');
      return;
    }
    
    // In a real app, this would save to a database
    alert(`Deck "${deckName}" saved successfully!`);
  };
  
  // Import a deck from a file
  const handleImportDeck = () => {
    // This would be implemented with file upload
    alert('Import functionality would be implemented here.');
  };
  
  // Navigate back to Game Manager
  const handleBackToGameManager = () => {
    navigate(getGameManagerRoute(gameId));
  };
  
  // Show loading state for both game data and cards
  if (gameDataLoading || cardsLoading) {
    return (
      <div className={styles.deckBuilderContainer}>
        <Navbar 
          gameTitle="Loading..."
          showTcgWorldLink={true}
          onNavigate={handleBackToGameManager}
        />
        <div className={styles.loading}>
          Loading deck builder...
        </div>
      </div>
    );
  }
  
  // Show error state
  if (gameDataError || cardsError) {
    return (
      <div className={styles.deckBuilderContainer}>
        <Navbar 
          gameTitle={gameDataError ? "Error" : gameData.title}
          showTcgWorldLink={true}
          onNavigate={handleBackToGameManager}
        />
        <div className={styles.error}>
          {gameDataError && <p>Error loading game data: {gameDataError}</p>}
          {cardsError && <p>Error loading cards: {cardsError}</p>}
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.deckBuilderContainer}>
      <Navbar 
        gameTitle={gameData.title}
        showTcgWorldLink={true}
        onNavigate={handleBackToGameManager}
      />
      
      <div className={styles.content}>
        <div className={styles.cardBrowserContainer}>
          <CardBrowser 
            cards={displayedCards}
            onSearch={handleSearch}
            onTypeFilterChange={handleTypeFilterChange}
            onAddCard={handleAddCardToDeck}
            pagination={pagination}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            searchTerm={searchTerm}
            typeFilter={typeFilter}
          />
        </div>
        
        <div className={styles.deckManagerContainer}>
          <DeckManager 
            deckName={deckName}
            onDeckNameChange={handleDeckNameChange}
            deckCards={deckCards}
            onRemoveCard={handleRemoveCardFromDeck}
            onAddCard={handleAddCardToDeck}
            onClearDeck={handleClearDeck}
            onImportDeck={handleImportDeck}
            onExportDeck={() => setShowExportModal(true)}
            onSaveDeck={handleSaveDeck}
            allCards={allCards}
          />
        </div>
      </div>
      
      {showExportModal && (
        <ExportDeckModal 
          deckName={deckName}
          deckCards={deckCards}
          allCards={allCards}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};

export default DeckBuilder;