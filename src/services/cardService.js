import { cardApi } from './mockApi/cardApi';

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
 * Card service - provides methods for interacting with the card API
 * This service layer abstracts the source of the data (mock vs real)
 * from the components that use it
 */
export const cardService = {
  // Get all cards for a game
  getCards: async (gameId, params = {}) => {
    if (USE_MOCKS) {
      return await cardApi.getCards(gameId, params);
    } else {
      try {
        const response = await api.get(`/games/${gameId}/cards`, { params });
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
  
  // Get a specific card
  getCard: async (cardId) => {
    if (USE_MOCKS) {
      return await cardApi.getCard(cardId);
    } else {
      try {
        const response = await api.get(`/cards/${cardId}`);
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
  
  // Create a new card
  createCard: async (gameId, cardData) => {
    if (USE_MOCKS) {
      return await cardApi.createCard(gameId, cardData);
    } else {
      try {
        const response = await api.post(`/games/${gameId}/cards`, cardData);
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
  
  // Update a card
  updateCard: async (cardId, cardData) => {
    if (USE_MOCKS) {
      return await cardApi.updateCard(cardId, cardData);
    } else {
      try {
        const response = await api.put(`/cards/${cardId}`, cardData);
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
  
  // Delete a card
  deleteCard: async (cardId) => {
    if (USE_MOCKS) {
      return await cardApi.deleteCard(cardId);
    } else {
      try {
        const response = await api.delete(`/cards/${cardId}`);
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
  
  // Bulk delete cards
  deleteCards: async (cardIds) => {
    if (USE_MOCKS) {
      return await cardApi.deleteCards(cardIds);
    } else {
      try {
        const response = await api.post(`/cards/bulk-delete`, { cardIds });
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