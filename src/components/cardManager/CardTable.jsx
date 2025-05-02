import React, { useState } from 'react';
import CardTableRow from './CardTableRow';
import styles from './CardTable.module.css';

/**
 * Table component for displaying card data
 * Features sorting, selection, and inline editing
 */
const CardTable = ({
  cards = [],
  selectedCards = [],
  isEditing = false,
  onSelectCard,
  onSelectAll,
  onSort,
  onEditCard
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'asc'
  });

  // Handle column header click for sorting
  const handleSort = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key, direction });
    
    if (onSort) {
      onSort(key, direction);
    }
  };

  // Check if all cards are selected
  const isAllSelected = cards.length > 0 && selectedCards.length === cards.length;

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    
    if (onSelectAll) {
      onSelectAll(isChecked);
    }
  };

  // Handle individual card selection
  const handleSelectCard = (cardId, isSelected) => {
    if (onSelectCard) {
      onSelectCard(cardId, isSelected);
    }
  };

  // Handle card edit
  const handleEditCard = (cardId, updatedData) => {
    if (onEditCard) {
      onEditCard(cardId, updatedData);
    }
  };

  // Get class name for sortable header
  const getSortHeaderClass = (key) => {
    return `${styles.sortable} ${sortConfig.key === key ? styles.sortActive : ''}`;
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return '↕';
    }
    
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.cardTable}>
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
            </th>
            <th>Image</th>
            <th 
              className={getSortHeaderClass('id')}
              onClick={() => handleSort('id')}
            >
              Card ID
              <span className={styles.sortIcon}>{getSortIcon('id')}</span>
            </th>
            <th 
              className={getSortHeaderClass('name')}
              onClick={() => handleSort('name')}
            >
              Card Name
              <span className={styles.sortIcon}>{getSortIcon('name')}</span>
            </th>
            <th 
              className={getSortHeaderClass('filename')}
              onClick={() => handleSort('filename')}
            >
              Filename
              <span className={styles.sortIcon}>{getSortIcon('filename')}</span>
            </th>
            <th 
              className={getSortHeaderClass('type')}
              onClick={() => handleSort('type')}
            >
              Type
              <span className={styles.sortIcon}>{getSortIcon('type')}</span>
            </th>
            <th 
              className={getSortHeaderClass('rarity')}
              onClick={() => handleSort('rarity')}
            >
              Rarity
              <span className={styles.sortIcon}>{getSortIcon('rarity')}</span>
            </th>
            <th 
              className={getSortHeaderClass('dateAdded')}
              onClick={() => handleSort('dateAdded')}
            >
              Date Added
              <span className={styles.sortIcon}>{getSortIcon('dateAdded')}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {cards.length > 0 ? (
            cards.map(card => (
              <CardTableRow 
                key={card.id}
                card={card}
                isSelected={selectedCards.includes(card.id)}
                isEditing={isEditing}
                onSelect={(isSelected) => handleSelectCard(card.id, isSelected)}
                onEdit={(updatedData) => handleEditCard(card.id, updatedData)}
              />
            ))
          ) : (
            <tr>
              <td colSpan="8" className={styles.emptyMessage}>
                No cards found. Add some cards to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CardTable;