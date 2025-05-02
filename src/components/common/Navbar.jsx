import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import styles from './Navbar.module.css';

const Navbar = ({ gameTitle, showTcgWorldLink = false, onNavigate }) => {
  const navigate = useNavigate();

  const handleTcgWorldClick = (e) => {
    e.preventDefault();
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
            <h1 className={styles.gameTitle}>{gameTitle}</h1>
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