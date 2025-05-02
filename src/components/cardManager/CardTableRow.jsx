import React, { useState, useEffect } from 'react';
import styles from './CardTableRow.module.css';

/**
 * Row component for the Card Table
 * Handles display, selection, and inline editing of card data
 */
const CardTableRow = ({
  card,
  isSelected,
  isEditing = false,
  onSelect,
  onEdit
}) => {
  // Local state for editing
  const [editedData, setEditedData] = useState({});

  // Update local state when card changes
  useEffect(() => {
    if (isEditing) {
      setEditedData({ ...card });
    }
  }, [card, isEditing]);

  // Handle checkbox selection
  const handleSelect = (e) => {
    onSelect(e.target.checked);
  };

  // Handle input change in edit mode
  const handleInputChange = (field, value) => {
    const updatedData = { ...editedData, [field]: value };
    setEditedData(updatedData);
    
    if (onEdit) {
      onEdit(updatedData);
    }
  };

  // Get the appropriate class for card type
  const getCardTypeClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'monster':
        return styles.cardTypeMonster;
      case 'spell':
        return styles.cardTypeSpell;
      case 'trap':
        return styles.cardTypeTrap;
      default:
        return '';
    }
  };

  return (
    <tr className={`${styles.cardRow} ${isSelected ? styles.selectedRow : ''}`}>
      <td className={styles.checkboxCell}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={isSelected}
          onChange={handleSelect}
        />
      </td>
      <td className={styles.imageCell}>
        <img
          src={card.imageUrl}
          alt={card.name}
          className={styles.thumbnail}
        />
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            className={styles.editInput}
            value={editedData.id || ''}
            onChange={(e) => handleInputChange('id', e.target.value)}
          />
        ) : (
          card.id
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            className={styles.editInput}
            value={editedData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        ) : (
          card.name
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            className={styles.editInput}
            value={editedData.filename || ''}
            onChange={(e) => handleInputChange('filename', e.target.value)}
          />
        ) : (
          card.filename
        )}
      </td>
      <td className={getCardTypeClass(card.type)}>
        {isEditing ? (
          <select
            className={styles.editSelect}
            value={editedData.type || ''}
            onChange={(e) => handleInputChange('type', e.target.value)}
          >
            <option value="Monster">Monster</option>
            <option value="Spell">Spell</option>
            <option value="Trap">Trap</option>
          </select>
        ) : (
          card.type
        )}
      </td>
      <td>
        {isEditing ? (
          <select
            className={styles.editSelect}
            value={editedData.rarity || ''}
            onChange={(e) => handleInputChange('rarity', e.target.value)}
          >
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Ultra Rare">Ultra Rare</option>
          </select>
        ) : (
          card.rarity
        )}
      </td>
      <td>{card.dateAdded}</td>
    </tr>
  );
};

export default CardTableRow;