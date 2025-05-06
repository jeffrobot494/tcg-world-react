import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Header from '../components/common/Header';
import CardManagerControls from '../components/cardManager/CardManagerControls';
import CardTable from '../components/cardManager/CardTable';
import Pagination from '../components/common/Pagination';
import AddCardModal from '../components/cardManager/AddCardModal';
import { ROUTES, getGameManagerRoute } from '../router/routes';
import { gameService } from '../services/gameService';
import { cardService } from '../services/cardService';
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
  
  // State for cards data and UI
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [selectedCardIds, setSelectedCardIds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customAttributes, setCustomAttributes] = useState([]);
  const [isProcessingCards, setIsProcessingCards] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [columnNames, setColumnNames] = useState({
    id: 'Card ID',
    name: 'Card Name',
    filename: 'Filename',
    rarity: 'Rarity',
    dateAdded: 'Date Added'
  });
  // State for column ordering - does not include checkbox or image columns which remain fixed
  // Note: 'id', 'filename', and 'rarity' are kept in the column order to maintain data structure, but hidden from view
  const [columnOrder, setColumnOrder] = useState([
    'id', 'name', 'filename', 'rarity', 'dateAdded'
  ]);
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'asc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  });
  
  // State for cards loading
  const [cardsLoading, setCardsLoading] = useState(true);
  const [cardsError, setCardsError] = useState(null);
  
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
  
  // Fetch cards data when component mounts
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setCardsLoading(true);
        setCardsError(null);
        
        const response = await cardService.getCards(gameId);
        
        if (response.success) {
          setCards(response.data);
          setPagination(prev => ({
            ...prev,
            totalItems: response.data.length
          }));
        } else {
          setCardsError(response.error.message);
          setCards([]);
        }
      } catch (err) {
        setCardsError('Failed to load cards');
        console.error('Error fetching cards:', err);
        setCards([]);
      } finally {
        setCardsLoading(false);
      }
    };
    
    if (gameId) {
      fetchCards();
    }
  }, [gameId]);

  // Apply search filter to get filtered cards
  useEffect(() => {
    // Step 1: Apply search filter
    let filtered = cards;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = cards.filter(card => 
        card.id.toLowerCase().includes(term) || 
        card.name.toLowerCase().includes(term) || 
        card.filename.toLowerCase().includes(term) ||
        card.rarity.toLowerCase().includes(term)
      );
    }
    setFilteredCards(filtered);
    setPagination(prev => ({
      ...prev,
      totalItems: filtered.length,
      // Only reset to first page on new search, not when cards change
      currentPage: searchTerm !== '' ? 1 : prev.currentPage
    }));
  }, [cards, searchTerm]);

  // Helper function to get any field value from a card
  const getCardFieldValue = (card, fieldId) => {
    // Check if this is a custom attribute field
    const isCustomAttribute = customAttributes.some(attr => attr.id === fieldId);
    if (isCustomAttribute) {
      return card.attributes?.[fieldId] || '';
    }
    // Otherwise it's a built-in field
    return card[fieldId] || '';
  };

  // Apply sort and pagination  
  useEffect(() => {
    // Step 1: Sort the filtered cards
    const sortedCards = [...filteredCards].sort((a, b) => {
      const aValue = getCardFieldValue(a, sortConfig.key);
      const bValue = getCardFieldValue(b, sortConfig.key);
      
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
    
    // Handle "All" option (Infinity)
    if (itemsPerPage === Infinity) {
      setDisplayedCards(sortedCards);
    } else {
      const start = (currentPage - 1) * itemsPerPage;
      const paginatedCards = sortedCards.slice(start, start + itemsPerPage);
      setDisplayedCards(paginatedCards);
    }
  }, [filteredCards, sortConfig, pagination]);

  // Update column order when custom attributes change
  useEffect(() => {
    setColumnOrder(prevOrder => {
      // Get custom columns that are already in the order
      const existingCustomColumns = prevOrder.filter(colId => 
        !['id', 'name', 'filename', 'rarity', 'dateAdded'].includes(colId) && 
        customAttributes.some(attr => attr.id === colId)
      );
      
      // Add any new custom attributes not already in the order
      const newCustomAttributes = customAttributes
        .filter(attr => !prevOrder.includes(attr.id))
        .map(attr => attr.id);
      
      // Make sure all default columns are included
      const defaultColumns = ['id', 'name', 'filename', 'rarity', 'dateAdded'];
      const missingDefaults = defaultColumns.filter(col => !prevOrder.includes(col));
      
      // Use existing order, add any missing defaults, and add new custom attributes
      return [...prevOrder, ...missingDefaults, ...newCustomAttributes];
    });
  }, [customAttributes]);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle filtering (placeholder)
  const handleFilter = () => {
    alert('Filter functionality would go here');
  };

  // Handle opening the Add Card modal
  const handleAddCard = () => {
    setIsAddCardModalOpen(true);
  };
  
  // Generate a new unique card ID
  const generateCardId = (index = 0) => {
    // Find the highest existing ID number to ensure new IDs are unique
    const existingIds = cards.map(card => {
      // Extract numeric part from card IDs like "0001" or "card_123"
      const idMatch = card.id.match(/\d+/);
      return idMatch ? parseInt(idMatch[0], 10) : 0;
    });
    
    const highestId = Math.max(0, ...existingIds);
    const nextId = highestId + 1 + index; // Add index to ensure multiple new cards get unique IDs
    
    // Format ID with leading zeros (e.g., 0001, 0002)
    return nextId.toString().padStart(4, '0');
  };
  
  // Handle adding new cards
  const handleAddCards = async (uploadResult) => {
    setIsProcessingCards(true);
    
    try {
      const today = new Date();
      
      // Format date with hours and minutes: "YYYY-MM-DD HH:MM"
      const dateString = today.toISOString().slice(0, 16).replace('T', ' ');
      
      // Get files from upload result or create empty ones for blank cards
      const { fileData } = uploadResult;
      const count = fileData.length;
      
      // Create and add each new card one by one
      const newCards = [];
      
      for (let index = 0; index < count; index++) {
        const cardId = generateCardId(index);
        
        // Get image data if available
        const imageFile = fileData[index] || null;
        
        // Initialize attributes with empty values for each custom attribute
        const attributes = {};
        customAttributes.forEach(attr => {
          attributes[attr.id] = '';
        });
        
        const newCard = {
          id: cardId,
          gameId: gameId,
          name: imageFile ? imageFile.name.split('.')[0].replace(/_/g, ' ') : '', // Convert underscores to spaces in name
          type: 'Monster',
          rarity: 'Common',
          filename: imageFile ? imageFile.name : '',
          imageUrl: imageFile ? URL.createObjectURL(imageFile) : null,
          description: '',
          attributes,
          dateAdded: dateString,
          createdAt: today.toISOString(),
          updatedAt: today.toISOString()
        };
        
        // Add to local array for state update
        newCards.push(newCard);
        
        // Also sync with mock API store by creating the card in the API
        try {
          await cardService.createCard(gameId, newCard);
        } catch (err) {
          console.error('Error adding card to API store:', err);
        }
      }
      
      // Add the new cards to state
      setCards(prevCards => [...newCards, ...prevCards]);
    } catch (error) {
      console.error('Error processing cards:', error);
      // Could add UI error message here
    } finally {
      setIsProcessingCards(false);
    }
    
    // Reset to first page when adding new cards
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  // Handle card editing - toggle edit mode
  const handleEditCards = () => {
    // If currently editing, exit edit mode and save changes
    if (isEditing) {
      // In a real app, you would save the changes to the server here
      console.log("Saving card changes...");
      
      // For now, we're just toggling the edit mode
      // The changes are already saved to local state through the CardTableRow component
    }
    
    // Toggle edit mode
    setIsEditing(!isEditing);
  };

  // Handle card deletion
  const handleDeleteCards = async () => {
    if (selectedCardIds.length === 0) return;
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedCardIds.length} card(s)?`
    );
    
    if (confirmDelete) {
      try {
        // Call the API to delete cards
        const response = await cardService.deleteCards(selectedCardIds);
        
        if (response.success) {
          // Remove the deleted cards from local state
          const updatedCards = cards.filter(card => !selectedCardIds.includes(card.id));
          setCards(updatedCards);
          setSelectedCardIds([]);
          
          // If no cards were deleted but the response was successful, show a message
          if (response.data && response.data.deletedCount === 0) {
            alert(response.data.message || "No cards were deleted.");
          }
        } else {
          alert(`Error deleting cards: ${response.error.message}`);
        }
      } catch (err) {
        console.error('Error deleting cards:', err);
        alert('An error occurred while deleting cards');
      }
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
      // Only select the currently displayed cards
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
  
  // Handle editing a specific card
  const handleEditCard = (cardId, updatedData) => {
    // Update the card in the cards array
    setCards(prevCards => {
      return prevCards.map(card => {
        if (card.id === cardId) {
          // Carefully merge the updatedData to preserve nested attributes
          const updatedCard = { ...card, ...updatedData };
          
          // Special handling for attributes to ensure they're properly merged
          if (updatedData.attributes) {
            updatedCard.attributes = {
              ...(card.attributes || {}),
              ...updatedData.attributes
            };
          }
          
          return updatedCard;
        }
        return card;
      });
    });
  };

  // Handle renaming a column
  const handleRenameColumn = (columnId, newName) => {
    // Update display names in columnNames state
    setColumnNames(prev => ({
      ...prev,
      [columnId]: newName
    }));
    
    // Also update the name in customAttributes if it's a custom column
    setCustomAttributes(prevAttributes => 
      prevAttributes.map(attr => 
        attr.id === columnId ? { ...attr, name: newName } : attr
      )
    );
  };
  
  // Handle deleting a custom attribute column
  const handleDeleteAttribute = (attributeId) => {
    // Remove the attribute from the customAttributes array
    setCustomAttributes(prevAttributes => 
      prevAttributes.filter(attr => attr.id !== attributeId)
    );
    
    // Remove the attribute from each card's attributes object
    setCards(prevCards => {
      return prevCards.map(card => {
        if (card.attributes && card.attributes[attributeId]) {
          const newAttributes = { ...card.attributes };
          delete newAttributes[attributeId];
          return { ...card, attributes: newAttributes };
        }
        return card;
      });
    });
    
    // Also remove from columnNames if it exists there
    setColumnNames(prev => {
      const updated = { ...prev };
      delete updated[attributeId];
      return updated;
    });
  };

  // Handle column reordering
  const handleMoveColumn = (columnId, direction) => {
    setColumnOrder(prevOrder => {
      const newOrder = [...prevOrder];
      const currentIndex = newOrder.indexOf(columnId);
      
      if (currentIndex === -1) return prevOrder;
      
      // Can't move first column left or last column right
      if (
        (direction === 'left' && currentIndex === 0) || 
        (direction === 'right' && currentIndex === newOrder.length - 1)
      ) {
        return prevOrder;
      }
      
      // Swap positions
      const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
      [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
      
      return newOrder;
    });
  };

  // Handle updating column dropdown options
  const handleUpdateColumnOptions = (columnId, options) => {
    // Update the options in customAttributes
    setCustomAttributes(prevAttributes => 
      prevAttributes.map(attr => 
        attr.id === columnId ? { ...attr, options } : attr
      )
    );
  };

  // Handle adding a new attribute column
  const handleAddAttribute = (columnConfig = { name: 'New attribute', type: 'text' }) => {
    // Generate a unique ID for the new attribute
    const newAttributeId = `attr_${Date.now()}`;
    
    // Create the new attribute with config values
    const newAttribute = {
      id: newAttributeId,
      name: columnConfig.name,
      key: newAttributeId,
      type: columnConfig.type || 'text',
      options: columnConfig.type === 'dropdown' ? [] : undefined
    };
    
    // Add the new attribute to the state
    setCustomAttributes(prevAttributes => [...prevAttributes, newAttribute]);
    
    // Initialize this attribute with empty values for all cards
    setCards(prevCards => {
      return prevCards.map(card => ({
        ...card,
        attributes: {
          ...card.attributes,
          [newAttributeId]: ''
        }
      }));
    });
  };

  // Handle navigation back to Game Manager
  const handleBackToGameManager = () => {
    navigate(getGameManagerRoute(gameId));
  };

  // Show loading state
  if (gameDataLoading || cardsLoading) {
    return (
      <div className={styles.cardManagerContainer}>
        <Navbar 
          gameTitle="Loading..."
          showTcgWorldLink={true}
          onNavigate={handleBackToGameManager}
        />
        <div className={styles.content}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (gameDataError || cardsError) {
    return (
      <div className={styles.cardManagerContainer}>
        <Navbar 
          gameTitle={gameData.title}
          showTcgWorldLink={true}
          onNavigate={handleBackToGameManager}
        />
        <div className={styles.content}>
          <div className={styles.error}>
            {gameDataError && <p>Game Error: {gameDataError}</p>}
            {cardsError && <p>Cards Error: {cardsError}</p>}
          </div>
        </div>
      </div>
    );
  }

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
        
        {displayedCards.length === 0 ? (
          <div className={styles.noCards}>
            {searchTerm ? 'No cards match your search criteria' : 'No cards found for this game'}
          </div>
        ) : (
          <CardTable 
            cards={displayedCards}
            selectedCards={selectedCardIds}
            isEditing={isEditing}
            isProcessingCards={isProcessingCards}
            customAttributes={customAttributes}
            columnNames={columnNames}
            columnOrder={columnOrder}
            sortConfig={sortConfig}
            onSelectCard={handleSelectCard}
            onSelectAll={handleSelectAll}
            onSort={handleSort}
            onEditCard={handleEditCard}
            onAddAttribute={handleAddAttribute}
            onRenameColumn={handleRenameColumn}
            onDeleteAttribute={handleDeleteAttribute}
            onUpdateColumnOptions={handleUpdateColumnOptions}
            onMoveColumn={handleMoveColumn}
          />
        )}
        
        <Pagination 
          currentPage={pagination.currentPage}
          itemsPerPage={pagination.itemsPerPage}
          totalItems={pagination.totalItems}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
        
        {/* Add Card Modal */}
        <AddCardModal 
          isOpen={isAddCardModalOpen}
          onClose={() => setIsAddCardModalOpen(false)}
          onAddCards={handleAddCards}
        />
      </div>
    </div>
  );
};

export default CardManager;