import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';

// Import pages
import Dashboard from '../pages/Dashboard';
import GameManager from '../pages/GameManager';
import CardManager from '../pages/CardManager';
import DeckBuilder from '../pages/DeckBuilder';
// Future components to add later:
// import GameEditor from '../pages/GameEditor';

// Import test components
import GameApiTest from '../components/tests/GameApiTest';
import ApiConsistencyTest from '../components/tests/ApiConsistencyTest';

/**
 * Main router component for the TCG World application
 * Sets up all routes and redirects
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        
        {/* Main Dashboard */}
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        
        {/* Game routes */}
        <Route path={ROUTES.GAME.MANAGER} element={<GameManager />} />
        <Route path={ROUTES.GAME.CARDS} element={<CardManager />} />
        <Route path={ROUTES.GAME.DECKS} element={<DeckBuilder />} />
        {/* Add this route when component is created:
        <Route path={ROUTES.GAME.EDITOR} element={<GameEditor />} />
        */}
        
        {/* Test routes - only available in development */}
        <Route path={ROUTES.TEST.GAMES} element={<GameApiTest />} />
        <Route path={ROUTES.TEST.CONSISTENCY} element={<ApiConsistencyTest />} />
        
        {/* Catch-all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;