import React from 'react';
import styles from './CardTable.module.css';

/**
 * Simple column header component for CardTable
 * Focused only on header rendering and basic interactions
 */
const ColumnHeader = ({
  // Essential props for rendering
  id,
  name,
  sortable = true,
  sortDirection = null, // 'asc', 'desc', or null
  isEditing = false,
  
  // Optional for rendering
  isBeingEdited = false,
  editValue = '',
  
  // Actions - only what's needed
  onEdit = null,
  onSort = null,
  onMove = null,
  onDelete = null,
  
  // Layout
  canMoveLeft = false,
  canMoveRight = false,
  
  // Additional content
  children
}) => {
  // Prevent event bubbling when clicking controls
  const stopPropagation = (e) => e.stopPropagation();
  
  return (
    <th 
      className={`${sortable ? styles.sortable : ''} ${sortDirection ? styles.sortActive : ''}`}
      onClick={sortable ? () => onSort && onSort(id) : undefined}
    >
      {isBeingEdited ? (
        <form onSubmit={(e) => {
          e.preventDefault();
          onEdit && onEdit({ type: 'save', id });
        }}>
          <input
            className={styles.columnNameInput}
            type="text"
            value={editValue}
            onChange={(e) => onEdit && onEdit({ 
              type: 'change', 
              id, 
              value: e.target.value 
            })}
            autoFocus
            onBlur={() => onEdit && onEdit({ type: 'blur', id })}
            onClick={stopPropagation}
          />
        </form>
      ) : (
        <>
          <span className={styles.columnName}>{name}</span>
          {sortable && <span className={styles.sortIcon}>
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>}
          
          {isEditing && (
            <div className={styles.columnControls} onClick={stopPropagation}>
              {/* Move buttons */}
              {canMoveLeft && (
                <button 
                  className={styles.moveColumnIcon}
                  onClick={() => onMove && onMove({ id, direction: 'left' })}
                  title="Move column left"
                  aria-label={`Move ${name} column left`}
                >
                  ←
                </button>
              )}
              
              {canMoveRight && (
                <button 
                  className={styles.moveColumnIcon}
                  onClick={() => onMove && onMove({ id, direction: 'right' })}
                  title="Move column right"
                  aria-label={`Move ${name} column right`}
                >
                  →
                </button>
              )}
              
              {/* Edit button */}
              {onEdit && (
                <button 
                  className={styles.editColumnIcon}
                  onClick={() => onEdit({ type: 'start', id, name })}
                  title="Edit column"
                >
                  ✎
                </button>
              )}
              
              {/* Delete button - only if delete handler is provided */}
              {onDelete && (
                <button 
                  className={styles.deleteColumnIcon}
                  onClick={() => onDelete(id)}
                  title="Delete column"
                >
                  ×
                </button>
              )}
            </div>
          )}
          
          {children}
        </>
      )}
    </th>
  );
};

export default ColumnHeader;