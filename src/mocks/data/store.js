/**
 * Central data store for mock API
 * This file contains the single source of truth for all mock data
 * All API handlers will access this store to ensure data consistency
 */

// Import initial data
import { games as initialGames } from './games';

// Helper for UUID generation
const generateId = (prefix) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Initial card data
 * These are sample cards for the games in our mock database
 */
const initialCards = [
  // Fantasy Realms cards
  {
    id: "card_001",
    gameId: "game_001",
    name: "Dragon Knight",
    type: "Monster",
    rarity: "Rare",
    image: null,
    description: "A powerful knight with dragon armor",
    attributes: {
      attack: 1500,
      defense: 1200,
      cost: 4
    },
    createdAt: "2023-01-15T08:30:00Z",
    updatedAt: "2023-01-15T08:30:00Z"
  },
  {
    id: "card_002",
    gameId: "game_001",
    name: "Magic Barrier",
    type: "Spell",
    rarity: "Common",
    image: null,
    description: "Protect a creature from the next attack",
    attributes: {
      cost: 2
    },
    createdAt: "2023-01-15T09:15:00Z",
    updatedAt: "2023-01-15T09:15:00Z"
  },
  {
    id: "card_003",
    gameId: "game_001",
    name: "Shadow Trap",
    type: "Trap",
    rarity: "Uncommon",
    image: null,
    description: "When an opponent attacks, reduce their attack by half",
    attributes: {
      cost: 3
    },
    createdAt: "2023-01-16T11:20:00Z",
    updatedAt: "2023-01-16T11:20:00Z"
  },
  
  // Cyber Wars cards
  {
    id: "card_101",
    gameId: "game_002",
    name: "Cyber Soldier",
    type: "Monster",
    rarity: "Common",
    image: null,
    description: "A basic soldier with cybernetic enhancements",
    attributes: {
      attack: 1000,
      defense: 1000,
      cost: 3
    },
    createdAt: "2023-02-22T10:30:00Z",
    updatedAt: "2023-02-22T10:30:00Z"
  },
  {
    id: "card_102",
    gameId: "game_002",
    name: "Firewall",
    type: "Spell",
    rarity: "Rare",
    image: null,
    description: "Prevent all damage to your creatures for one turn",
    attributes: {
      cost: 4
    },
    createdAt: "2023-02-22T14:45:00Z",
    updatedAt: "2023-02-22T14:45:00Z"
  },
  
  // Ancient Battles cards
  {
    id: "card_201",
    gameId: "game_003",
    name: "Roman Legionnaire",
    type: "Monster",
    rarity: "Common",
    image: null,
    description: "Disciplined infantry soldier of the Roman Empire",
    attributes: {
      attack: 800,
      defense: 1200,
      cost: 2
    },
    createdAt: "2023-03-12T09:45:00Z",
    updatedAt: "2023-03-12T09:45:00Z"
  },
  {
    id: "card_202",
    gameId: "game_003",
    name: "Cavalry Charge",
    type: "Spell",
    rarity: "Uncommon",
    image: null,
    description: "Double the attack of all your mounted units this turn",
    attributes: {
      cost: 3
    },
    createdAt: "2023-03-12T10:30:00Z",
    updatedAt: "2023-03-12T10:30:00Z"
  }
];

/**
 * Initial deck data
 * These are sample decks for the games in our mock database
 */
const initialDecks = [
  {
    id: "deck_001",
    gameId: "game_001",
    creatorId: "user_001",
    name: "Dragon Dominance",
    description: "A powerful dragon-focused deck",
    cards: [
      { cardId: "card_001", quantity: 3 },
      { cardId: "card_002", quantity: 2 },
      { cardId: "card_003", quantity: 1 }
    ],
    cardCount: 6,
    isPublic: true,
    createdAt: "2023-02-05T14:20:00Z",
    updatedAt: "2023-03-10T11:45:00Z"
  },
  {
    id: "deck_002",
    gameId: "game_002",
    creatorId: "user_001",
    name: "Cyber Defense",
    description: "A defensive cyber deck",
    cards: [
      { cardId: "card_101", quantity: 4 },
      { cardId: "card_102", quantity: 2 }
    ],
    cardCount: 6,
    isPublic: true,
    createdAt: "2023-03-15T09:30:00Z",
    updatedAt: "2023-03-15T09:30:00Z"
  },
  {
    id: "deck_003",
    gameId: "game_003",
    creatorId: "user_002",
    name: "Roman Legion",
    description: "A deck focused on Roman military tactics",
    cards: [
      { cardId: "card_201", quantity: 3 },
      { cardId: "card_202", quantity: 2 }
    ],
    cardCount: 5,
    isPublic: false,
    createdAt: "2023-04-10T16:45:00Z",
    updatedAt: "2023-04-10T16:45:00Z"
  }
];

/**
 * Central store object
 * This is the single source of truth for all mock data
 */
const store = {
  // Core data collections
  games: [...initialGames],
  cards: [...initialCards],
  decks: [...initialDecks],
  
  // Reset data to initial state (useful for testing)
  reset: () => {
    store.games = [...initialGames];
    store.cards = [...initialCards];
    store.decks = [...initialDecks];
  },
  
  // Helper functions for relational integrity
  
  // Update card counts in games
  updateGameCardCount: (gameId) => {
    const gameIndex = store.games.findIndex(g => g.id === gameId);
    if (gameIndex === -1) return;
    
    // Count cards for this game
    const cardCount = store.cards.filter(c => c.gameId === gameId).length;
    
    // Update the game
    store.games[gameIndex] = {
      ...store.games[gameIndex],
      cardCount,
      updatedAt: new Date().toISOString()
    };
  },
  
  // Update deck counts in games
  updateGameDeckCount: (gameId) => {
    const gameIndex = store.games.findIndex(g => g.id === gameId);
    if (gameIndex === -1) return;
    
    // Count decks for this game
    const deckCount = store.decks.filter(d => d.gameId === gameId).length;
    
    // Update the game
    store.games[gameIndex] = {
      ...store.games[gameIndex],
      deckCount,
      updatedAt: new Date().toISOString()
    };
  },
  
  // Enforce referential integrity when a card is deleted
  removeDeletedCardFromDecks: (cardId) => {
    // Filter the card out of all decks
    store.decks.forEach((deck, index) => {
      // Check if the deck contains this card
      const containsCard = deck.cards.some(c => c.cardId === cardId);
      
      if (containsCard) {
        // Remove the card
        const updatedCards = deck.cards.filter(c => c.cardId !== cardId);
        
        // Recalculate card count
        const cardCount = updatedCards.reduce((sum, card) => sum + card.quantity, 0);
        
        // Update the deck
        store.decks[index] = {
          ...deck,
          cards: updatedCards,
          cardCount,
          updatedAt: new Date().toISOString()
        };
      }
    });
  },
  
  // Enforce referential integrity when a game is deleted
  cleanupDeletedGame: (gameId) => {
    // Remove all cards for this game
    store.cards = store.cards.filter(card => card.gameId !== gameId);
    
    // Remove all decks for this game
    store.decks = store.decks.filter(deck => deck.gameId !== gameId);
  }
};

export default store;