import React, { useState, useEffect, useRef } from 'react';
import styles from './CardTableRow.module.css';
import { useImagePreview } from '../../context/ImagePreviewContext';

/**
 * Row component for the Card Table
 * Handles display, selection, and inline editing of card data
 */
const CardTableRow = ({
  card,
  isSelected,
  isEditing = false,
  visibleColumns = [],
  onSelect,
  onEdit
}) => {
  // Local state for editing
  const [editedData, setEditedData] = useState({});
  const [expandedCell, setExpandedCell] = useState(null);
  const { setPreviewImage } = useImagePreview();
  
  // Reference for auto-expanding textareas
  const textareaRefs = useRef({});
  
  // Update local state when card changes
  useEffect(() => {
    if (isEditing) {
      setEditedData({ ...card });
    }
  }, [card, isEditing]);
  
  // Auto-resize textareas in edit mode
  useEffect(() => {
    if (isEditing) {
      // Auto-adjust height of all textareas
      Object.values(textareaRefs.current).forEach(textarea => {
        if (textarea) {
          const adjustHeight = () => {
            // First set to one line height to ensure proper calculation
            textarea.style.height = '1.5em';
            // Then set to content height
            textarea.style.height = `${textarea.scrollHeight}px`;
          };
          
          adjustHeight();
          
          // Also adjust when the content changes
          textarea.addEventListener('input', adjustHeight);
          
          return () => {
            textarea.removeEventListener('input', adjustHeight);
          };
        }
      });
    }
  }, [isEditing, editedData]);

  // Handle checkbox selection
  const handleSelect = (e) => {
    onSelect(e.target.checked);
  };

  // Handle input change in edit mode
  const handleInputChange = (field, value) => {
    let updatedData;
    
    // Check if this is a custom attribute field or a regular field
    // Custom attribute fields are those in visibleColumns with isCustom=true
    if (visibleColumns.some(col => col.isCustom && col.id === field)) {
      // For custom attributes, update the nested attributes object
      updatedData = { 
        ...editedData, 
        attributes: { 
          ...(editedData.attributes || {}), 
          [field]: value 
        } 
      };
    } else {
      // For regular fields, update the top-level property
      updatedData = { ...editedData, [field]: value };
    }
    
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

  // Helper function to render a cell based on column type
  const renderStandardCell = (columnId) => {
    if (columnId === 'id') {
      return card.id;
    } else if (columnId === 'name') {
      return isEditing ? (
        <input
          type="text"
          className={styles.editInput}
          value={editedData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter card name"
        />
      ) : (
        <div className={styles.standardTextCell} title={card.name}>
          <div className={styles.truncatedText}>
            {card.name}
          </div>
        </div>
      );
    } else if (columnId === 'filename') {
      return isEditing ? (
        <input
          type="text"
          className={styles.editInput}
          value={editedData.filename || ''}
          onChange={(e) => handleInputChange('filename', e.target.value)}
          placeholder="Enter filename"
        />
      ) : (
        <div className={styles.standardTextCell} title={card.filename}>
          <div className={styles.truncatedText}>
            {card.filename}
          </div>
        </div>
      );
    } else if (columnId === 'dateAdded') {
      return (
        <div className={styles.standardTextCell} title={card.dateAdded}>
          <div className={styles.truncatedText}>
            {card.dateAdded}
          </div>
        </div>
      );
    } else if (columnId === 'rarity') {
      return isEditing ? (
        <input
          type="text"
          className={styles.editInput}
          value={editedData.rarity || ''}
          onChange={(e) => handleInputChange('rarity', e.target.value)}
          placeholder="Enter rarity"
        />
      ) : (
        <div className={styles.standardTextCell} title={card.rarity}>
          <div className={styles.truncatedText}>
            {card.rarity}
          </div>
        </div>
      );
    }
    return null;
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
      {/* Image cell - editable in edit mode */}
      <td className={styles.imageCell}>
        <div className={styles.thumbnailWrapper}>
          {isEditing ? (
            <>
              <input
                type="file"
                id={`image-upload-${card.id}`}
                className={styles.fileInput}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      // Update the card with the new image
                      const updatedData = { 
                        ...editedData, 
                        imageUrl: event.target.result 
                      };
                      setEditedData(updatedData);
                      onEdit(updatedData);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label 
                htmlFor={`image-upload-${card.id}`} 
                className={styles.uploadLabel}
              >
                <img
                  src={editedData.imageUrl || card.imageUrl}
                  alt={card.name}
                  className={`${styles.thumbnail} ${styles.editableThumbnail}`}
                />
                <div className={styles.uploadOverlay}>
                  <span>Change Image</span>
                </div>
              </label>
            </>
          ) : (
            <div 
              onMouseEnter={() => setPreviewImage({ url: card.imageUrl, alt: card.name })}
              onMouseLeave={() => setPreviewImage(null)}
            >
              <img
                src={card.imageUrl}
                alt={card.name}
                className={styles.thumbnail}
              />
            </div>
          )}
        </div>
      </td>
      
      {/* Render all columns based on visibleColumns array */}
      {visibleColumns.map(column => {
        // Render the appropriate cell based on column type
        if (!column.isCustom) {
          // Built-in column
          return (
            <td key={column.id} className={styles.dataCell}>
              {renderStandardCell(column.id)}
            </td>
          );
        } else {
          // Custom attribute column
          return (
            <td key={column.id} className={styles.dataCell}>
              {isEditing ? (
                column.type === 'dropdown' && column.options?.length > 0 ? (
                  <select
                    className={styles.editSelect}
                    value={editedData.attributes?.[column.id] || ''}
                    onChange={(e) => handleInputChange(column.id, e.target.value)}
                  >
                    <option value="">Select...</option>
                    {column.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  column.type === 'text' ? (
                    <textarea
                      ref={el => textareaRefs.current[column.id] = el}
                      className={styles.autoExpandTextarea}
                      value={editedData.attributes?.[column.id] || ''}
                      onChange={(e) => handleInputChange(column.id, e.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      className={styles.editInput}
                      value={editedData.attributes?.[column.id] || ''}
                      onChange={(e) => handleInputChange(column.id, e.target.value)}
                    />
                  )
                )
              ) : (
                (!isEditing && 
                 column.type === 'text') ? (
                  <div 
                    className={styles.textCell}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedCell(expandedCell === column.id ? null : column.id);
                    }}
                    title={expandedCell === column.id ? "Click to collapse" : "Click to expand"}
                  >
                    <div className={expandedCell === column.id ? styles.expandedText : styles.truncatedText}>
                      {card.attributes?.[column.id] || ''}
                    </div>
                  </div>
                ) : (
                  card.attributes?.[column.id] || ''
                )
              )}
            </td>
          );
        }
      })}
      
      {/* Empty spacer cell */}
      <td className={styles.spacerCell}></td>
    </tr>
  );
};

export default CardTableRow;