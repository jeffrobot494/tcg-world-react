import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Header from '../components/common/Header';
import CardManagerControls from '../components/cardManager/CardManagerControls';
import CardTable from '../components/cardManager/CardTable';
import Pagination from '../components/common/Pagination';
import { ROUTES, getGameManagerRoute } from '../router/routes';
import { gameService } from '../services/gameService';
import sampleCards from '../data/sampleCards';
import styles from './CardManager.module.css';

/**
 * Card Manager page component
 * Manages the display, filtering, sorting, and editing of game cards
 */
const CardManager = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  
  // State for game data
  const [gameData, setGameData] = useState({
    id: gameId || '1',
    title: 'Loading...',
    icon: '🎮'
  });
  const [gameDataLoading, setGameDataLoading] = useState(true);
  const [gameDataError, setGameDataError] = useState(null);
  
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
            id: gameId || '1',
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
  
  // State for cards data and UI
  const [cards, setCards] = useState(sampleCards);
  const [filteredCards, setFilteredCards] = useState([]);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [selectedCardIds, setSelectedCardIds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'asc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: sampleCards.length
  });

  // Apply search, sort, and pagination to get displayed cards
  useEffect(() => {
    // Step 1: Apply search filter
    let filtered = cards;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = cards.filter(card => 
        card.id.toLowerCase().includes(term) || 
        card.name.toLowerCase().includes(term) || 
        card.filename.toLowerCase().includes(term) ||
        card.type.toLowerCase().includes(term) ||
        card.rarity.toLowerCase().includes(term)
      );
    }
    setFilteredCards(filtered);
    setPagination(prev => ({
      ...prev,
      totalItems: filtered.length,
      currentPage: 1  // Reset to first page on new search
    }));
  }, [cards, searchTerm]);

  // Apply sort and pagination
  useEffect(() => {
    // Step 1: Sort the filtered cards
    const sortedCards = [...filteredCards].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    // Step 2: Apply pagination
    const { currentPage, itemsPerPage } = pagination;
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedCards = sortedCards.slice(start, start + itemsPerPage);
    
    setDisplayedCards(paginatedCards);
  }, [filteredCards, sortConfig, pagination]);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle filtering (placeholder)
  const handleFilter = () => {
    alert('Filter functionality would go here');
  };

  // Handle adding a new card (placeholder)
  const handleAddCard = () => {
    alert('Add card functionality would go here');
  };

  // Handle card editing
  const handleEditCards = () => {
    setIsEditing(!isEditing);
  };

  // Handle card deletion (placeholder)
  const handleDeleteCards = () => {
    if (selectedCardIds.length === 0) return;
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedCardIds.length} card(s)?`
    );
    
    if (confirmDelete) {
      // Remove the selected cards
      const updatedCards = cards.filter(card => !selectedCardIds.includes(card.id));
      setCards(updatedCards);
      setSelectedCardIds([]);
    }
  };

  // Handle exporting cards (placeholder)
  const handleExportCards = () => {
    alert('Export functionality would go here');
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

  // Handle card selection
  const handleSelectCard = (cardId, isSelected) => {
    if (isSelected) {
      setSelectedCardIds(prev => [...prev, cardId]);
    } else {
      setSelectedCardIds(prev => prev.filter(id => id !== cardId));
    }
  };

  // Handle select all cards
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const allCardIds = displayedCards.map(card => card.id);
      setSelectedCardIds(allCardIds);
    } else {
      setSelectedCardIds([]);
    }
  };

  // Handle sorting
  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
  };

  // Handle navigation back to Game Manager
  const handleBackToGameManager = () => {
    navigate(getGameManagerRoute(gameId));
  };

  return (
    <div className={styles.cardManagerContainer}>
      <Navbar 
        gameTitle={gameData.title}
        showTcgWorldLink={true}
        onNavigate={handleBackToGameManager}
      />
      
      <div className={styles.content}>
        <Header 
          title="Card Manager"
          subtitle="Manage, edit, and organize your game's cards"
          icon={gameData.icon}
          iconBackground="#7c3aed"
          className={styles.header}
        />
        
        <CardManagerControls 
          onSearch={handleSearch}
          onFilter={handleFilter}
          onAddCard={handleAddCard}
          onEditCards={handleEditCards}
          onDeleteCards={handleDeleteCards}
          onExportCards={handleExportCards}
          selectedCount={selectedCardIds.length}
          isEditing={isEditing}
        />
        
        <CardTable 
          cards={displayedCards}
          selectedCards={selectedCardIds}
          isEditing={isEditing}
          onSelectCard={handleSelectCard}
          onSelectAll={handleSelectAll}
          onSort={handleSort}
        />
        
        <Pagination 
          currentPage={pagination.currentPage}
          itemsPerPage={pagination.itemsPerPage}
          totalItems={pagination.totalItems}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
};

export default CardManager;