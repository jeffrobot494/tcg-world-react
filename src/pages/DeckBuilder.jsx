import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import CardBrowser from '../components/deckBuilder/CardBrowser';
import DeckManager from '../components/deckBuilder/DeckManager';
import ExportDeckModal from '../components/deckBuilder/ExportDeckModal';
import { getGameManagerRoute } from '../router/routes';
import sampleCards from '../data/sampleCards';
import styles from './DeckBuilder.module.css';

/**
 * DeckBuilder page component
 * Allows users to build decks by adding cards from the card browser
 */
const DeckBuilder = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  
  // Game data (placeholder - would be fetched based on gameId)
  const gameData = {
    id: gameId || '1',
    title: gameId === '1' ? 'Fantasy Realms' : 
           gameId === '2' ? 'Cyber Wars' : 
           gameId === '3' ? 'Ancient Battles' : 
           'Unknown Game',
    icon: '🎮'
  };
  
  // State management
  const [allCards, setAllCards] = useState(sampleCards);
  const [filteredCards, setFilteredCards] = useState([]);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [deckCards, setDeckCards] = useState(new Map());
  const [deckName, setDeckName] = useState("New Deck");
  
  // Search and filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: allCards.length
  });
  
  // UI state
  const [showExportModal, setShowExportModal] = useState(false);
  
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