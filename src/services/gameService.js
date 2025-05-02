import { gameApi } from './mockApi/gameApi';

/**
 * Determine if we should use mocks or real API
 * In a real app, this could be controlled by environment variables
 */
const USE_MOCKS = process.env.NODE_ENV === 'development';

/**
 * Create real API instance for production use
 */
let api;
if (!USE_MOCKS) {
  // Only import axios when we're not using mocks
  const axios = require('axios');
  api = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Game service - provides methods for interacting with the game API
 * This service layer abstracts the source of the data (mock vs real)
 * from the components that use it
 */
export const gameService = {
  // Get all games
  getGames: async () => {
    if (USE_MOCKS) {
      return await gameApi.getGames();
    } else {
      try {
        const response = await api.get('/games');
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: {
            code: error.response?.status || 'UNKNOWN_ERROR',
            message: error.response?.data?.message || 'An unknown error occurred'
          }
        };
      }
    }
  },
  
  // Get a specific game
  getGame: async (gameId) => {
    if (USE_MOCKS) {
      return await gameApi.getGame(gameId);
    } else {
      try {
        const response = await api.get(`/games/${gameId}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: {
            code: error.response?.status || 'UNKNOWN_ERROR',
            message: error.response?.data?.message || 'An unknown error occurred'
          }
        };
      }
    }
  },
  
  // Create a new game
  createGame: async (gameData) => {
    if (USE_MOCKS) {
      return await gameApi.createGame(gameData);
    } else {
      try {
        const response = await api.post('/games', gameData);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: {
            code: error.response?.status || 'UNKNOWN_ERROR',
            message: error.response?.data?.message || 'An unknown error occurred'
          }
        };
      }
    }
  },
  
  // Update a game
  updateGame: async (gameId, gameData) => {
    if (USE_MOCKS) {
      return await gameApi.updateGame(gameId, gameData);
    } else {
      try {
        const response = await api.put(`/games/${gameId}`, gameData);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: {
            code: error.response?.status || 'UNKNOWN_ERROR',
            message: error.response?.data?.message || 'An unknown error occurred'
          }
        };
      }
    }
  },
  
  // Delete a game
  deleteGame: async (gameId) => {
    if (USE_MOCKS) {
      return await gameApi.deleteGame(gameId);
    } else {
      try {
        const response = await api.delete(`/games/${gameId}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: {
            code: error.response?.status || 'UNKNOWN_ERROR',
            message: error.response?.data?.message || 'An unknown error occurred'
          }
        };
      }
    }
  }
};