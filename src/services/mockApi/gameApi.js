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
 * Mock Game API that simulates CRUD operations for games
 */
export const gameApi = {
  // Get all games
  getGames: async () => {
    await delay(300); // Simulate network delay
    
    return successResponse(store.games);
  },
  
  // Get a specific game
  getGame: async (gameId) => {
    await delay(200);
    
    const game = store.games.find(g => g.id === gameId);
    
    if (!game) {
      return errorResponse('GAME_NOT_FOUND', 'Game not found');
    }
    
    return successResponse(game);
  },
  
  // Create a new game
  createGame: async (gameData) => {
    await delay(500);
    
    // Generate a new ID
    const newId = `game_${Date.now().toString(36)}`;
    
    // Create the new game object
    const newGame = {
      id: newId,
      ...gameData,
      creatorId: "user_001", // Hardcoded for now
      cardCount: 0,
      deckCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to games array
    store.games.push(newGame);
    
    return successResponse(newGame);
  },
  
  // Update a game
  updateGame: async (gameId, gameData) => {
    await delay(300);
    
    // Find the game to update
    const gameIndex = store.games.findIndex(g => g.id === gameId);
    
    if (gameIndex === -1) {
      return errorResponse('GAME_NOT_FOUND', 'Game not found');
    }
    
    // Create updated game object
    const updatedGame = {
      ...store.games[gameIndex],
      ...gameData,
      updatedAt: new Date().toISOString()
    };
    
    // Update the games array
    store.games[gameIndex] = updatedGame;
    
    return successResponse(updatedGame);
  },
  
  // Delete a game
  deleteGame: async (gameId) => {
    await delay(400);
    
    // Check if game exists
    const gameExists = store.games.some(g => g.id === gameId);
    
    if (!gameExists) {
      return errorResponse('GAME_NOT_FOUND', 'Game not found');
    }
    
    // Clean up related data first (cards and decks for this game)
    store.cleanupDeletedGame(gameId);
    
    // Then remove the game
    store.games = store.games.filter(g => g.id !== gameId);
    
    return successResponse({
      message: 'Game deleted successfully'
    });
  }
};