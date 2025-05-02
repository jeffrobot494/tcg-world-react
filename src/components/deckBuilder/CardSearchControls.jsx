import React, { useState } from 'react';
import Button from '../common/Button';
import styles from './CardSearchControls.module.css';

/**
 * CardSearchControls component
 * Provides search input and type filter dropdown for card browser
 */
const CardSearchControls = ({
  searchTerm,
  typeFilter,
  onSearch,
  onTypeFilterChange
}) => {
  const [inputValue, setInputValue] = useState(searchTerm);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Handle search input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue);
  };
  
  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(inputValue);
    }
  };
  
  // Handle type filter change
  const handleTypeChange = (e) => {
    onTypeFilterChange(e.target.value);
  };
  
  return (
    <div className={styles.searchControls}>
      <div className={styles.searchContainer}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search cards..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <div 
            className={styles.infoIcon}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            {showTooltip && (
              <div className={styles.tooltip}>
                <strong>Search Tips:</strong>
                <ul>
                  <li>Search by card name, type, or rarity</li>
                  <li>Use the type filter to narrow results</li>
                  <li>Click on a card to add it to your deck</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <Button 
          onClick={handleSubmit}
          className={styles.searchButton}
        >
          Search
        </Button>
      </div>
      
      <select 
        className={styles.typeFilter}
        value={typeFilter}
        onChange={handleTypeChange}
      >
        <option value="">All Types</option>
        <option value="Monster">Monster</option>
        <option value="Spell">Spell</option>
        <option value="Trap">Trap</option>
      </select>
    </div>
  );
};

export default CardSearchControls;