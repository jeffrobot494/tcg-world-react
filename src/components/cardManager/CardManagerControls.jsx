import React, { useState } from 'react';
import Button from '../common/Button';
import styles from './CardManagerControls.module.css';

/**
 * Controls for the Card Manager
 * Includes search, filter, add, edit, delete, and export functionalities
 */
const CardManagerControls = ({
  onSearch,
  onFilter,
  onAddCard,
  onEditCards,
  onDeleteCards,
  onExportCards,
  selectedCount = 0,
  isEditing = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <>
      {/* Top controls: Search, Filter, Add Card, Export */}
      <div className={styles.controlsGroup}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search cards..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        
        <Button 
          variant="secondary"
          onClick={onFilter}
          className={styles.iconButton}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46V19l4 2v-8.54L22 3"></polygon>
          </svg>
          Filter
        </Button>
        
        <Button 
          onClick={onAddCard}
          className={styles.iconButton}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Card
        </Button>
        
        <Button 
          variant="secondary"
          onClick={onExportCards}
          className={styles.iconButton}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export to CSV
        </Button>
      </div>

      {/* Table actions: Edit, Delete */}
      <div className={styles.controlsGroup}>
        <Button 
          onClick={onEditCards}
          className={`${styles.iconButton} ${selectedCount === 0 ? styles.disabled : ''}`}
          disabled={selectedCount === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          {isEditing ? 'Save' : `Edit ${selectedCount > 0 ? `(${selectedCount})` : ''}`}
        </Button>
        
        <Button 
          variant="secondary"
          onClick={onDeleteCards}
          className={`${styles.iconButton} ${selectedCount === 0 ? styles.disabled : ''}`}
          disabled={selectedCount === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Delete Selected {selectedCount > 0 ? `(${selectedCount})` : ''}
        </Button>
      </div>
    </>
  );
};

export default CardManagerControls;