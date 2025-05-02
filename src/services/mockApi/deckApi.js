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
 * Ensures a deck only includes valid cards
 * @param {Object} deck - Deck to sanitize
 * @returns {Object} - Sanitized deck with only valid cards
 */
const sanitizeDeckCards = (deck) => {
  // Filter out any cards that don't exist anymore
  const validCards = deck.cards.filter(deckCard => 
    store.cards.some(card => card.id === deckCard.cardId)
  );
  
  // Update the card count
  const cardCount = validCards.reduce((sum, card) => sum + card.quantity, 0);
  
  // Return updated deck
  return {
    ...deck,
    cards: validCards,
    cardCount
  };
};

/**
 * Expands deck card references to include card details
 * @param {Object} deck - Deck to expand
 * @returns {Object} - Deck with expanded card details
 */
const expandDeckWithCardDetails = (deck) => {
  // Add full card details to each deck card
  const expandedCards = deck.cards.map(deckCard => {
    const cardData = store.cards.find(card => card.id === deckCard.cardId);
    return {
      ...deckCard,
      card: cardData  // Add full card data
    };
  });
  
  // Return deck with expanded cards
  return {
    ...deck,
    expandedCards   // Add as a separate property to maintain original structure
  };
};

/**
 * Deck API with data consistency
 * All deck operations will maintain consistency with cards and games
 */
export const deckApi = {
  // Get all decks for a game
  getDecks: async (gameId, params = {}) => {
    await delay(300);
    
    // Validate game exists
    const gameExists = store.games.some(g => g.id === gameId);
    if (!gameId || !gameExists) {
      return errorResponse('GAME_NOT_FOUND', 'Game not found');
    }
    
    const { page = 1, limit = 10 } = params;
    
    // Get decks for this game
    let gameDecks = store.decks.filter(deck => deck.gameId === gameId);
    
    // Sanitize all decks to ensure they only contain valid cards
    gameDecks = gameDecks.map(deck => sanitizeDeckCards(deck));
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDecks = gameDecks.slice(startIndex, endIndex);
    
    // Create pagination object
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(gameDecks.length / limit),
      totalItems: gameDecks.length,
      itemsPerPage: limit
    };
    
    return successResponse(paginatedDecks, pagination);
  },
  
  // Get a specific deck with expanded card details
  getDeck: async (deckId) => {
    await delay(200);
    
    const deck = store.decks.find(d => d.id === deckId);
    
    if (!deck) {
      return errorResponse('DECK_NOT_FOUND', 'Deck not found');
    }
    
    // Sanitize deck to ensure it only contains valid cards
    const sanitizedDeck = sanitizeDeckCards(deck);
    
    // Expand the deck with card details
    const expandedDeck = expandDeckWithCardDetails(sanitizedDeck);
    
    return successResponse(expandedDeck);
  },
  
  // Create a new deck
  createDeck: async (gameId, deckData) => {
    await delay(400);
    
    // Validate game exists
    const gameExists = store.games.some(g => g.id === gameId);
    if (!gameId || !gameExists) {
      return errorResponse('GAME_NOT_FOUND', 'Game not found');
    }
    
    // Validate cards exist
    if (deckData.cards && deckData.cards.length > 0) {
      const invalidCards = deckData.cards.filter(
        deckCard => !store.cards.some(card => card.id === deckCard.cardId)
      );
      
      if (invalidCards.length > 0) {
        return errorResponse('INVALID_CARDS', 'Some cards in the deck do not exist', {
          invalidCardIds: invalidCards.map(card => card.cardId)
        });
      }
    }
    
    // Calculate card count
    const cardCount = deckData.cards ? 
      deckData.cards.reduce((sum, card) => sum + card.quantity, 0) : 0;
    
    // Generate new deck ID
    const newId = `deck_${Date.now().toString(36)}`;
    
    // Create new deck
    const newDeck = {
      id: newId,
      gameId,
      creatorId: "user_001", // Hardcoded for now
      cards: deckData.cards || [],
      cardCount,
      isPublic: deckData.isPublic || false,
      name: deckData.name || "New Deck",
      description: deckData.description || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to decks collection
    store.decks.push(newDeck);
    
    // Update deck count in the game
    store.updateGameDeckCount(gameId);
    
    return successResponse(newDeck);
  },
  
  // Update a deck
  updateDeck: async (deckId, deckData) => {
    await delay(300);
    
    // Find the deck
    const deckIndex = store.decks.findIndex(d => d.id === deckId);
    
    if (deckIndex === -1) {
      return errorResponse('DECK_NOT_FOUND', 'Deck not found');
    }
    
    const deck = store.decks[deckIndex];
    
    // Validate cards exist if provided
    if (deckData.cards && deckData.cards.length > 0) {
      const invalidCards = deckData.cards.filter(
        deckCard => !store.cards.some(card => card.id === deckCard.cardId)
      );
      
      if (invalidCards.length > 0) {
        return errorResponse('INVALID_CARDS', 'Some cards in the deck do not exist', {
          invalidCardIds: invalidCards.map(card => card.cardId)
        });
      }
    }
    
    // Calculate card count if cards provided
    const cardCount = deckData.cards ?
      deckData.cards.reduce((sum, card) => sum + card.quantity, 0) : deck.cardCount;
    
    // Create updated deck
    const updatedDeck = {
      ...deck,
      ...deckData,
      // Ensure gameId and creatorId can't be changed
      gameId: deck.gameId,
      creatorId: deck.creatorId,
      // Update card count if cards were provided
      cardCount: deckData.cards ? cardCount : deck.cardCount,
      updatedAt: new Date().toISOString()
    };
    
    // Update the deck
    store.decks[deckIndex] = updatedDeck;
    
    return successResponse(updatedDeck);
  },
  
  // Delete a deck
  deleteDeck: async (deckId) => {
    await delay(300);
    
    // Find the deck
    const deck = store.decks.find(d => d.id === deckId);
    
    if (!deck) {
      return errorResponse('DECK_NOT_FOUND', 'Deck not found');
    }
    
    const { gameId } = deck;
    
    // Remove the deck
    store.decks = store.decks.filter(d => d.id !== deckId);
    
    // Update deck count in the game
    store.updateGameDeckCount(gameId);
    
    return successResponse({
      message: 'Deck deleted successfully'
    });
  },
  
  // Export a deck
  exportDeck: async (deckId, format = 'json') => {
    await delay(200);
    
    const deck = store.decks.find(d => d.id === deckId);
    
    if (!deck) {
      return errorResponse('DECK_NOT_FOUND', 'Deck not found');
    }
    
    // Sanitize deck to ensure it only contains valid cards
    const sanitizedDeck = sanitizeDeckCards(deck);
    
    // Get game info
    const game = store.games.find(g => g.id === deck.gameId);
    
    // Prepare export data
    const exportData = {
      name: sanitizedDeck.name,
      game: game ? game.title : 'Unknown Game',
      cards: sanitizedDeck.cards.map(deckCard => {
        const cardData = store.cards.find(c => c.id === deckCard.cardId);
        return {
          id: deckCard.cardId,
          name: cardData ? cardData.name : 'Unknown Card',
          type: cardData ? cardData.type : 'Unknown',
          quantity: deckCard.quantity
        };
      })
    };
    
    if (format === 'text') {
      // Create text representation (useful for Tabletop Simulator)
      const textExport = `# ${exportData.name} - ${exportData.game}\n\n` + 
        exportData.cards.map(c => `${c.quantity}x ${c.name} (${c.type})`).join('\n');
      
      return successResponse({ format: 'text', content: textExport });
    }
    
    return successResponse({ format: 'json', content: exportData });
  },
  
  // Import a deck
  importDeck: async (gameId, importData) => {
    await delay(500);
    
    // Validate game exists
    const gameExists = store.games.some(g => g.id === gameId);
    if (!gameId || !gameExists) {
      return errorResponse('GAME_NOT_FOUND', 'Game not found');
    }
    
    try {
      // Parse the import data if it's a string
      const deckData = typeof importData === 'string' ? JSON.parse(importData) : importData;
      
      if (!deckData.name) {
        return errorResponse('INVALID_IMPORT', 'Import data must include a deck name');
      }
      
      // Generate new deck ID
      const newId = `deck_${Date.now().toString(36)}`;
      
      // Process cards - map card names to IDs if possible
      const gameCards = store.cards.filter(card => card.gameId === gameId);
      
      let validCards = [];
      let invalidCards = [];
      
      if (deckData.cards && Array.isArray(deckData.cards)) {
        // If cards are already in the right format with cardId
        if (deckData.cards[0] && deckData.cards[0].cardId) {
          validCards = deckData.cards.filter(deckCard => 
            gameCards.some(card => card.id === deckCard.cardId)
          );
          
          invalidCards = deckData.cards.filter(deckCard => 
            !gameCards.some(card => card.id === deckCard.cardId)
          );
        }
        // If cards are in a format with name but no ID
        else if (deckData.cards[0] && deckData.cards[0].name) {
          deckData.cards.forEach(importCard => {
            const matchingCard = gameCards.find(card => 
              card.name.toLowerCase() === importCard.name.toLowerCase()
            );
            
            if (matchingCard) {
              validCards.push({
                cardId: matchingCard.id,
                quantity: importCard.quantity || 1
              });
            } else {
              invalidCards.push(importCard);
            }
          });
        }
      }
      
      // Calculate card count
      const cardCount = validCards.reduce((sum, card) => sum + card.quantity, 0);
      
      // Create new deck
      const newDeck = {
        id: newId,
        gameId,
        creatorId: "user_001", // Hardcoded for now
        name: deckData.name,
        description: deckData.description || `Imported deck: ${deckData.name}`,
        cards: validCards,
        cardCount,
        isPublic: deckData.isPublic || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to decks collection
      store.decks.push(newDeck);
      
      // Update deck count in the game
      store.updateGameDeckCount(gameId);
      
      // Return response with info about invalid cards
      return successResponse({
        deck: newDeck,
        importSummary: {
          totalCards: validCards.length + invalidCards.length,
          validCards: validCards.length,
          invalidCards: invalidCards.length,
          invalidCardDetails: invalidCards
        }
      });
      
    } catch (error) {
      return errorResponse('IMPORT_ERROR', 'Failed to process import data', {
        error: error.message
      });
    }
  }
};