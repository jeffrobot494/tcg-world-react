# TCG World React Application Views

This document outlines all the views that will be implemented in the TCG World React application. TCG World is a platform for indie TCG creators to build, publish, and manage their own trading card games. The platform is designed to scale to potentially hundreds of different TCGs, each with their own unique content, rules, and cards.

## Core Views

1. **Home View**
   - Landing page for the application
   - Overview of features
   - Quick access to common functions

2. **Login View**
   - User authentication form
   - "Remember me" option
   - Links to signup and password recovery

3. **Signup View**
   - New user registration form
   - Terms and conditions acceptance
   - Email verification flow

4. **Password Recovery View**
   - Forgot password form
   - Reset password process
   - Confirmation screen

9. **User Profile View**
   - Account information
   - Preferences management
   - Avatar/profile customization
   - Account linking options

10. **Settings View**
    - Theme selection (light/dark)
    - Display preferences
    - Notification settings
    - Language options
    - Accessibility settings

## Secondary Views

### Player-focused Views

XX. **Deckbuilder View**
	- View the deckbuilder for a specific Game
	- Create and save decks
	- Import and export the deck

14. **Collection Stats View**
    - Detailed statistics about card collection
    - Charts and visualizations
    - Completion progress
    - Rarity distribution

15. **TCG Rules View**
    - Format-specific rules
    - Banned/restricted list
    - Deck construction guidelines
    - FAQ and official rulings
    - Note: Each game has its own Rules view with unique content
	
11. **Game Splash View**
    - Customizable landing page for each TCG
    - Creator-defined branding and styling
    - Game description, story, and features
    - Promotional content and artwork showcase
    - Call-to-action for players
    - Player counts and activity metrics
    - Quick links to deck builder and rules
    - Community highlights and tournament information
    - Note: Each game has its own unique Splash view that the creator can fully customize

5. **Player Dashboard View**
   - Personalized greeting and overview
   - TCG discovery and browsing interface
   - Featured and popular TCGs
   - Recent decks and activity across multiple games
   - User-specific statistics and insights
   - Quick actions menu

### Creator-focused Views

18. **TCG Creation View**
    - Game creation wizard
    - Rule system definition
    - Card attribute schema design
    - Format and restriction management
    - Game branding and customization

19. **Creator Analytics View**
    - Player engagement metrics
    - Deck creation statistics
    - Card usage analytics
    - User growth and retention data
    - Community activity tracking

6. **Card Manager View**
   - Creator interface for uploading and removing cards
   - Card attribute editing functionality
   - Custom metadata schema definition per game
   - Metadata management for searching
   - Image upload and optimization
   - Batch card management capabilities
   - Card categorization specific to each TCG
   - Card template creation and management

7. **Card Detail View**
   - Full card information
   - High-resolution image
   - Card statistics and attributes
   - Edit metadata and attributes

XX. **Creator Dashboard View**
   - View all your games
   - Links to game pages, card managers
   - Settings
   - Simple Analytics

XX. **Game Splash Editor View**
   - Edit your game's splash View
   - Text field for submitting prompt to LLM
   - LLM returns html and css injected into page
   - Full-screen preview of Game Splash View
   - WYSIWYG text and image Editor