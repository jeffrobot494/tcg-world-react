import store from '../../mocks/data/store';

/**
 * Helper to simulate network delay
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise} - Promise that resolves after the delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Success response formatter
 * @param {*} data - Response data
 * @param {Object} pagination - Optional pagination info
 * @returns {Object} - Formatted success response
 */
const successResponse = (data, pagination = null) => {
  const response = {
    success: true,
    data
  };
  
  if (pagination) {
    response.pagination = pagination;
  }
  
  return response;
};

/**
 * Error response formatter
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {Object} details - Optional error details
 * @returns {Object} - Formatted error response
 */
const errorResponse = (code, message, details = null) => {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details && { details })
    }
  };
};

/**
 * Card API with relational integrity
 * All card operations will maintain consistency with decks and games
 */
export const cardApi = {
  // Get all cards for a game
  getCards: async (gameId, params = {}) => {
    await delay(400);
    
    // Validate game exists
    const gameExists = store.games.some(g => g.id === gameId);
    if (!gameId || !gameExists) {
      return errorResponse('GAME_NOT_FOUND', 'Game not found');
    }
    
    const { page = 1, limit = 20, search = '', type = '', rarity = '' } = params;
    
    // Get cards for this game
    let filteredCards = store.cards.filter(card => card.gameId === gameId);
    
    // Apply search if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCards = filteredCards.filter(card => 
        card.name.toLowerCase().includes(searchLower) || 
        card.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply type filter if provided
    if (type) {
      filteredCards = filteredCards.filter(card => card.type === type);
    }
    
    // Apply rarity filter if provided
    if (rarity) {
      filteredCards = filteredCards.filter(card => card.rarity === rarity);
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCards = filteredCards.slice(startIndex, endIndex);
    
    // Create pagination object
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(filteredCards.length / limit),
      totalItems: filteredCards.length,
      itemsPerPage: limit
    };
    
    return successResponse(paginatedCards, pagination);
  },
  
  // Get a single card
  getCard: async (cardId) => {
    await delay(200);
    
    const card = store.cards.find(c => c.id === cardId);
    
    if (!card) {
      return errorResponse('CARD_NOT_FOUND', 'Card not found');
    }
    
    return successResponse(card);
  },
  
  // Create a new card
  createCard: async (gameId, cardData) => {
    await delay(500);
    
    // Validate game exists
    const gameExists = store.games.some(g => g.id === gameId);
    if (!gameId || !gameExists) {
      return errorResponse('GAME_NOT_FOUND', 'Game not found');
    }
    
    // Generate new card ID
    const newId = `card_${Date.now().toString(36)}`;
    
    // Create new card
    const newCard = {
      id: newId,
      gameId,
      ...cardData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to cards collection
    store.cards.push(newCard);
    
    // Update card count in the game
    store.updateGameCardCount(gameId);
    
    return successResponse(newCard);
  },
  
  // Update a card
  updateCard: async (cardId, cardData) => {
    await delay(300);
    
    // Find the card
    const cardIndex = store.cards.findIndex(c => c.id === cardId);
    
    if (cardIndex === -1) {
      return errorResponse('CARD_NOT_FOUND', 'Card not found');
    }
    
    const card = store.cards[cardIndex];
    
    // Create updated card
    const updatedCard = {
      ...card,
      ...cardData,
      // Ensure gameId can't be changed
      gameId: card.gameId,
      updatedAt: new Date().toISOString()
    };
    
    // Update the card
    store.cards[cardIndex] = updatedCard;
    
    return successResponse(updatedCard);
  },
  
  // Delete a card
  deleteCard: async (cardId) => {
    await delay(300);
    
    // Find the card
    const card = store.cards.find(c => c.id === cardId);
    
    if (!card) {
      return errorResponse('CARD_NOT_FOUND', 'Card not found');
    }
    
    const { gameId } = card;
    
    // First remove this card from all decks
    store.removeDeletedCardFromDecks(cardId);
    
    // Then remove the card itself
    store.cards = store.cards.filter(c => c.id !== cardId);
    
    // Update card count in the game
    store.updateGameCardCount(gameId);
    
    return successResponse({
      message: 'Card deleted successfully'
    });
  },
  
  // Bulk delete cards
  deleteCards: async (cardIds) => {
    await delay(500);
    
    if (!Array.isArray(cardIds) || cardIds.length === 0) {
      return errorResponse('INVALID_REQUEST', 'No cards specified for deletion');
    }
    
    // Find all valid cards to delete
    const cardsToDelete = store.cards.filter(card => cardIds.includes(card.id));
    
    if (cardsToDelete.length === 0) {
      return errorResponse('CARDS_NOT_FOUND', 'None of the specified cards were found');
    }
    
    // Track affected games to update counts
    const affectedGameIds = new Set();
    
    // Process each card
    cardsToDelete.forEach(card => {
      // Add to affected games
      affectedGameIds.add(card.gameId);
      
      // Remove from decks
      store.removeDeletedCardFromDecks(card.id);
    });
    
    // Remove the cards
    store.cards = store.cards.filter(card => !cardIds.includes(card.id));
    
    // Update card counts for all affected games
    affectedGameIds.forEach(gameId => {
      store.updateGameCardCount(gameId);
    });
    
    return successResponse({
      message: `Successfully deleted ${cardsToDelete.length} cards`
    });
  }
};