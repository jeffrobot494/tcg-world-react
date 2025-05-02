/**
 * Routes for the TCG World application
 * These constants are used throughout the app to ensure consistency
 * and make it easier to update routes in one place.
 */

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  GAME: {
    ROOT: '/games/:gameId',
    MANAGER: '/games/:gameId/manager',
    CARDS: '/games/:gameId/cards',
    DECKS: '/games/:gameId/decks',
    EDITOR: '/games/:gameId/editor'
  },
  // Test routes for development
  TEST: {
    GAMES: '/api-test/games',
    CARDS: '/api-test/cards',
    DECKS: '/api-test/decks',
    CONSISTENCY: '/api-test/consistency'
  }
};

/**
 * Helper functions for generating dynamic routes with game IDs
 * These ensure that routes are generated correctly and consistently
 */
export const getGameRoute = (gameId) => `/games/${gameId}`;
export const getGameManagerRoute = (gameId) => `/games/${gameId}/manager`;
export const getGameCardsRoute = (gameId) => `/games/${gameId}/cards`;
export const getGameDecksRoute = (gameId) => `/games/${gameId}/decks`;
export const getGameEditorRoute = (gameId) => `/games/${gameId}/editor`;