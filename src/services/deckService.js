import { deckApi } from './mockApi/deckApi';

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
 * Deck service - provides methods for interacting with the deck API
 * This service layer abstracts the source of the data (mock vs real)
 * from the components that use it
 */
export const deckService = {
  // Get all decks for a game
  getDecks: async (gameId, params = {}) => {
    if (USE_MOCKS) {
      return await deckApi.getDecks(gameId, params);
    } else {
      try {
        const response = await api.get(`/games/${gameId}/decks`, { params });
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
  
  // Get a specific deck
  getDeck: async (deckId) => {
    if (USE_MOCKS) {
      return await deckApi.getDeck(deckId);
    } else {
      try {
        const response = await api.get(`/decks/${deckId}`);
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
  
  // Create a new deck
  createDeck: async (gameId, deckData) => {
    if (USE_MOCKS) {
      return await deckApi.createDeck(gameId, deckData);
    } else {
      try {
        const response = await api.post(`/games/${gameId}/decks`, deckData);
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
  
  // Update a deck
  updateDeck: async (deckId, deckData) => {
    if (USE_MOCKS) {
      return await deckApi.updateDeck(deckId, deckData);
    } else {
      try {
        const response = await api.put(`/decks/${deckId}`, deckData);
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
  
  // Delete a deck
  deleteDeck: async (deckId) => {
    if (USE_MOCKS) {
      return await deckApi.deleteDeck(deckId);
    } else {
      try {
        const response = await api.delete(`/decks/${deckId}`);
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
  
  // Export a deck
  exportDeck: async (deckId, format = 'json') => {
    if (USE_MOCKS) {
      return await deckApi.exportDeck(deckId, format);
    } else {
      try {
        const response = await api.get(`/decks/${deckId}/export`, { params: { format } });
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
  
  // Import a deck
  importDeck: async (gameId, importData) => {
    if (USE_MOCKS) {
      return await deckApi.importDeck(gameId, importData);
    } else {
      try {
        const response = await api.post(`/games/${gameId}/decks/import`, { importData });
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