import React, { useState } from 'react';
import CardTableRow from './CardTableRow';
import AddColumnModal from './AddColumnModal';
import EditColumnModal from './EditColumnModal';
import ColumnHeader from './ColumnHeader';
import styles from './CardTable.module.css';
import { getColumnWidth } from '../../config/columnConfig';

/**
 * Table component for displaying card data
 * Features sorting, selection, and inline editing
 */
const CardTable = ({
  cards = [],
  selectedCards = [],
  isEditing = false,
  isProcessingCards = false,
  customAttributes = [],
  columnNames = {},
  columnOrder = [],
  sortConfig = { key: 'id', direction: 'asc' },
  onSelectCard,
  onSelectAll,
  onSort,
  onEditCard,
  onAddAttribute,
  onRenameColumn,
  onDeleteAttribute,
  onUpdateColumnOptions,
  onMoveColumn
}) => {
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [editingColumnName, setEditingColumnName] = useState('');
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false);
  const [editingColumnData, setEditingColumnData] = useState(null);

  // Handle column editing (open modal for custom columns or inline editing for built-in columns)
  const handleColumnEdit = (columnId, currentName, e = { stopPropagation: () => {} }) => {
    if (e.stopPropagation) {
      e.stopPropagation(); // Prevent sort from triggering
    }
    
    // Find the column data from visibleColumns
    const columnData = visibleColumns.find(col => col.id === columnId);
    
    if (columnData && columnData.isCustom) {
      // For custom columns, find the attribute data and open the modal
      setEditingColumnData(columnData.attributeData);
      setIsEditColumnModalOpen(true);
    } else {
      // For built-in columns, use inline editing
      setEditingColumnId(columnId);
      setEditingColumnName(currentName);
    }
  };

  // Save column name changes
  const handleColumnNameSave = (columnId, e = { preventDefault: () => {} }) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (onRenameColumn && editingColumnName.trim()) {
      onRenameColumn(columnId, editingColumnName.trim());
    }
    setEditingColumnId(null);
    setEditingColumnName('');
  };

  // Handle column header click for sorting
  const handleSort = (key) => {
    // Calculate next direction based on parent's current sortConfig
    let direction = 'asc';
    
    if (sortConfig.key === key) {
      // If clicking the same column that's already being sorted, toggle direction
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    // Call parent's onSort handler
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
  
  // Get class name for the table based on edit mode
  const getTableClass = () => {
    return `${styles.cardTable} ${isEditing ? styles.editMode : ''}`;
  };

  // Handle saving column changes from the modal
  const handleSaveColumnChanges = (columnId, updates) => {
    if (onRenameColumn && updates.name) {
      onRenameColumn(columnId, updates.name);
    }
    
    // Update options if provided and if there's a handler for it
    if (updates.options && typeof onUpdateColumnOptions === 'function') {
      onUpdateColumnOptions(columnId, updates.options);
    }
  };

  // Get class name for sortable header
  const getSortHeaderClass = (key) => {
    return `${styles.sortable} ${sortConfig.key === key ? styles.sortActive : ''}`;
  };

  // Get sort icon direction
  const getSortIconDirection = (key) => {
    // If this is the active sort column, show the current direction
    if (sortConfig.key === key) {
      return sortConfig.direction;
    }
    
    // For non-active columns, default to descending (↓)
    return 'desc';
  };
  
  // Get default column name
  const getDefaultColumnName = (columnId) => {
    switch (columnId) {
      case 'id': return 'Card ID';
      case 'name': return 'Card Name';
      case 'filename': return 'Filename';
      case 'dateAdded': return 'Date Added';
      case 'rarity': return 'Rarity';
      default: return columnId;
    }
  };

  const handleAddAttributeClick = () => {
    // Open the add column modal instead of immediately adding a column
    setIsAddColumnModalOpen(true);
  };
  
  // Handle column addition from the modal
  const handleAddColumn = (columnConfig) => {
    if (onAddAttribute) {
      onAddAttribute(columnConfig);
    }
  };
  
  // Handle column deletion
  const handleDeleteColumn = (columnId, e = { stopPropagation: () => {} }) => {
    if (e.stopPropagation) {
      e.stopPropagation(); // Prevent sort from triggering if event is provided
    }
    
    if (window.confirm(`Are you sure you want to delete this column?`)) {
      if (onDeleteAttribute) {
        onDeleteAttribute(columnId);
      }
    }
  };
  

  // Define which built-in columns should be visible in the table
  const visibleBuiltInColumns = ['name', 'dateAdded']; // Removed 'id', 'filename', and 'rarity'
  
  // Create a unified array of all visible columns (both built-in and custom attributes)
  const visibleColumns = columnOrder.map(columnId => {
    // If it's a custom attribute, return the full attribute object
    const customAttr = customAttributes.find(attr => attr.id === columnId);
    if (customAttr) {
      return {
        id: columnId,
        isCustom: true,
        name: customAttr.name,
        type: customAttr.type,
        options: customAttr.options,
        attributeData: customAttr, // Keep original data for edit modal
        width: getColumnWidth(columnId, customAttr) // Get optimal width based on content type
      };
    }
    
    // If it's a visible built-in column, return basic info with appropriate width
    if (visibleBuiltInColumns.includes(columnId)) {
      return {
        id: columnId,
        isCustom: false,
        name: columnNames?.[columnId] || getDefaultColumnName(columnId),
        width: getColumnWidth(columnId) // Get optimal width based on column type
      };
    }
    
    // Skip any columns that should not be visible
    return null;
  }).filter(Boolean); // Remove any null entries

  // Add refs for synchronized scrolling
  const topScrollRef = React.useRef(null);
  const bottomScrollRef = React.useRef(null);
  const topScrollContentRef = React.useRef(null);
  const tableRef = React.useRef(null);
  const tableContainerRef = React.useRef(null);
  
  // State to track if scrolling is needed
  const [isScrollingNeeded, setIsScrollingNeeded] = useState(false);

  // Handle scroll synchronization
  const handleTopScroll = () => {
    if (topScrollRef.current && bottomScrollRef.current) {
      bottomScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
  };

  const handleBottomScroll = () => {
    if (topScrollRef.current && bottomScrollRef.current) {
      topScrollRef.current.scrollLeft = bottomScrollRef.current.scrollLeft;
    }
  };

  // Check if scrolling is needed and update top scroll width
  const updateScrollState = () => {
    if (tableRef.current && topScrollContentRef.current && tableContainerRef.current) {
      // Set the width of the top scroll content to match the table
      const tableWidth = tableRef.current.offsetWidth;
      topScrollContentRef.current.style.width = `${tableWidth}px`;
      
      // Check if scrolling is needed
      const containerWidth = tableContainerRef.current.clientWidth;
      const needsScrolling = tableWidth > containerWidth;
      
      setIsScrollingNeeded(needsScrolling);
    }
  };

  // Update scroll state when table changes
  React.useEffect(() => {
    // Update initially
    updateScrollState();

    // Update on window resize
    window.addEventListener('resize', updateScrollState);
    
    // Observe table for changes 
    const resizeObserver = new ResizeObserver(updateScrollState);
    if (tableRef.current) {
      resizeObserver.observe(tableRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateScrollState);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={styles.tableWrapper}>
      {/* Top scrollbar container - only shown when scrolling is needed */}
      {isScrollingNeeded && (
        <div 
          className={styles.topScrollContainer} 
          ref={topScrollRef} 
          onScroll={handleTopScroll}
        >
          <div 
            className={styles.topScrollContent} 
            ref={topScrollContentRef}
          ></div>
        </div>
      )}

      {/* Main table container */}
      <div className={styles.tableContainerWrapper}>
        {/* Add column button outside of scrollable area but positioned relative to it */}
        <button 
          className={styles.addColumnButton}
          onClick={handleAddAttributeClick}
          title="Add new attribute column"
        >
          +
        </button>
        <div 
          className={styles.tableContainer} 
          ref={(el) => {
            bottomScrollRef.current = el;
            tableContainerRef.current = el;
          }}
          onScroll={handleBottomScroll}
        >
        {isProcessingCards && (
          <div className={styles.tableLoadingOverlay}>
            <div className={styles.loadingSpinner}></div>
            <div className={styles.loadingText}>Processing cards...</div>
          </div>
        )}
        <table className={getTableClass()} ref={tableRef}>
          <colgroup>
            <col style={{ width: '40px' }} /> {/* Checkbox column */}
            <col style={{ width: '60px' }} /> {/* Image column */}
            {visibleColumns.map(column => (
              <col key={`col-${column.id}`} style={{ width: `${column.width}px` }} />
            ))}
            <col /> {/* Spacer column to extend background */}
          </colgroup>
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
            {/* Render all column headers using visibleColumns */}
            {visibleColumns.map((column, index) => (
              <ColumnHeader
                key={column.id}
                id={column.id}
                name={column.name}
                sortable={true}
                sortDirection={getSortIconDirection(column.id)}
                isEditing={isEditing}
                isBeingEdited={editingColumnId === column.id}
                editValue={editingColumnName}
                canMoveLeft={index > 0}
                canMoveRight={index < visibleColumns.length - 1}
                onSort={() => handleSort(column.id)}
                onMove={({ id, direction }) => onMoveColumn(id, direction)}
                onEdit={(action) => {
                  switch(action.type) {
                    case 'start':
                      if (column.isCustom) {
                        handleColumnEdit(action.id, action.name, { stopPropagation: () => {} });
                      } else {
                        setEditingColumnId(action.id);
                        setEditingColumnName(action.name);
                      }
                      break;
                    case 'change':
                      setEditingColumnName(action.value);
                      break;
                    case 'save':
                    case 'blur':
                      if (onRenameColumn && editingColumnName.trim()) {
                        onRenameColumn(action.id, editingColumnName.trim());
                      }
                      setEditingColumnId(null);
                      setEditingColumnName('');
                      break;
                  }
                }}
                onDelete={column.isCustom ? (id) => {
                  if (window.confirm(`Are you sure you want to delete this column?`)) {
                    if (onDeleteAttribute) {
                      onDeleteAttribute(id);
                    }
                  }
                } : null}
              >
                {/* Button moved to outer container */}
              </ColumnHeader>
            ))}
            
            {/* Add an extra header placeholder when there are no columns */}
            {visibleColumns.length === 0 && (
              <th key="add-column-placeholder" className={styles.addColumnHeader}>
                {/* Button moved outside */}
              </th>
            )}
            
            {/* Empty spacer header to extend background */}
            <th className={styles.headerSpacer}></th>
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
                visibleColumns={visibleColumns}
                onSelect={(isSelected) => handleSelectCard(card.id, isSelected)}
                onEdit={(updatedData) => handleEditCard(card.id, updatedData)}
              />
            ))
          ) : (
            <tr>
              <td colSpan={3 + visibleColumns.length} className={styles.emptyMessage}>
                No cards found. Add some cards to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      </div>
      
      {/* Add Column Modal */}
      <AddColumnModal
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
        onAddColumn={handleAddColumn}
      />

      {/* Edit Column Modal */}
      <EditColumnModal
        isOpen={isEditColumnModalOpen}
        onClose={() => setIsEditColumnModalOpen(false)}
        onSave={handleSaveColumnChanges}
        columnId={editingColumnData?.id}
        columnData={editingColumnData}
      />
    </div>
  );
};

export default CardTable;