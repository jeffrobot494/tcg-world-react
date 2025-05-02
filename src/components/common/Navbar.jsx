import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES, getGameManagerRoute } from '../../router/routes';
import { gameService } from '../../services/gameService';
import styles from './Navbar.module.css';

const Navbar = ({ gameTitle: propGameTitle, showTcgWorldLink = false, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Extract gameId from URL if available
  const pathParts = location.pathname.split('/');
  const gameIdIndex = pathParts.indexOf('games') + 1;
  const gameId = gameIdIndex > 0 && gameIdIndex < pathParts.length ? pathParts[gameIdIndex] : null;
  
  // Check if we're already on the Game Manager page
  const isGameManagerPage = gameId && location.pathname === getGameManagerRoute(gameId);
  
  // Fetch game data if gameId is available but no gameTitle was provided
  useEffect(() => {
    const fetchGameData = async () => {
      // Skip fetching if we already have a game title from props or no gameId
      if (propGameTitle || !gameId) return;
      
      try {
        setLoading(true);
        const response = await gameService.getGame(gameId);
        
        if (response.success) {
          setGameData(response.data);
          setError(null);
        } else {
          setError(response.error.message);
        }
      } catch (err) {
        setError('Failed to load game data');
        console.error('Error fetching game data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGameData();
  }, [gameId, propGameTitle]);
  
  // Determine game title to display (from props, API, or fallback)
  const gameTitle = propGameTitle || (gameData ? gameData.title : loading ? 'Loading...' : 'Unknown Game');

  const handleTcgWorldClick = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate();
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };
  
  const handleGameTitleClick = (e) => {
    e.preventDefault();
    // If we're already on the Game Manager page, do nothing
    if (isGameManagerPage) {
      return;
    }
    // Otherwise, use the same navigation as TCG World link
    if (onNavigate) {
      onNavigate();
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        {showTcgWorldLink ? (
          <>
            <a 
              href="#" 
              onClick={handleTcgWorldClick} 
              className={styles.tcgWorldLink}
            >
              <div className={styles.tcgWorldIcon}>🃏</div>
              <span>TCG World</span>
            </a>
            <div className={styles.navDivider}></div>
            <a 
              href="#" 
              onClick={handleGameTitleClick}
              className={`${styles.gameTitleLink} ${isGameManagerPage ? styles.currentPage : ''}`}
            >
              <h1 className={`${styles.gameTitle} ${loading ? styles.loadingTitle : ''}`}>{gameTitle}</h1>
            </a>
          </>
        ) : (
          <h1 className={styles.logo}>TCG World</h1>
        )}
      </div>
      
      <div className={styles.navLinks}>
        <a 
          href="#" 
          onClick={handleDashboardClick} 
          className={styles.navLink}
        >
          {showTcgWorldLink ? 'Dashboard' : 'Home'}
        </a>
        <div className={styles.profileIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;