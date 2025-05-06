import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import styles from './AddCardModal.module.css'; // Reuse existing styles
import { COLUMN_TYPES, COLUMN_TYPE_MAPPING } from '../../config/columnConfig';

/**
 * Modal for adding a new column to the Card Manager
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility of the modal
 * @param {function} props.onClose - Function to call when modal is closed
 * @param {function} props.onAddColumn - Function to call with the new column configuration
 */
const AddColumnModal = ({ isOpen, onClose, onAddColumn }) => {
  const [columnName, setColumnName] = useState('');
  const [columnType, setColumnType] = useState(COLUMN_TYPES.TEXT);
  const [error, setError] = useState('');
  
  // Define user-friendly column type descriptions
  const columnTypeDescriptions = {
    [COLUMN_TYPES.TEXT]: 'Free text input (default)',
    [COLUMN_TYPES.NUMBER]: 'Numeric values like Attack, Defense',
    [COLUMN_TYPES.SHORT_TEXT]: 'Short text like Rarity, Type',
    [COLUMN_TYPES.DROPDOWN]: 'Select from predefined options',
    [COLUMN_TYPES.DATE]: 'Date values',
    [COLUMN_TYPES.NAME]: 'Card names or titles'
  };

  // Handle input change
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setColumnName(newName);
    
    if (newName) {
      setError('');
      
      // Auto-detect column type based on name
      const lowerName = newName.toLowerCase();
      
      // Check for number fields
      if (/attack|defense|health|hp|power|strength|toughness|cost|mana|energy|level|points|value|price/.test(lowerName)) {
        setColumnType(COLUMN_TYPES.NUMBER);
      } 
      // Check for date fields
      else if (/date|time|created|updated|published|release/.test(lowerName)) {
        setColumnType(COLUMN_TYPES.DATE);
      }
      // Check for name fields
      else if (/name|title|heading/.test(lowerName)) {
        setColumnType(COLUMN_TYPES.NAME);
      }
      // Check for short text fields
      else if (/type|rarity|class|category|faction|element|color|race|set|edition/.test(lowerName)) {
        setColumnType(COLUMN_TYPES.SHORT_TEXT);
      }
    }
  };

  // Handle type change
  const handleTypeChange = (e) => {
    setColumnType(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate column name
    if (!columnName.trim()) {
      setError('Please enter a column name');
      return;
    }
    
    // Call onAddColumn with the validated data
    onAddColumn({
      name: columnName.trim(),
      type: columnType
    });
    
    // Reset form and close modal
    resetForm();
    onClose();
  };

  // Reset form when modal is closed
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Reset form state
  const resetForm = () => {
    setColumnName('');
    setColumnType(COLUMN_TYPES.TEXT);
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Column">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="columnName" className={styles.label}>
            Column Name
          </label>
          <input
            id="columnName"
            type="text"
            className={styles.input}
            value={columnName}
            onChange={handleNameChange}
            placeholder="Enter column name"
            autoFocus
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="columnType" className={styles.label}>
            Column Type
          </label>
          <select
            id="columnType"
            className={styles.input}
            value={columnType}
            onChange={handleTypeChange}
          >
            <option value={COLUMN_TYPES.TEXT}>Text</option>
            <option value={COLUMN_TYPES.NUMBER}>Number</option>
            <option value={COLUMN_TYPES.SHORT_TEXT}>Short Text</option>
            <option value={COLUMN_TYPES.NAME}>Name</option>
            <option value={COLUMN_TYPES.DATE}>Date</option>
            <option value={COLUMN_TYPES.DROPDOWN}>Dropdown</option>
          </select>
          <p className={styles.hint}>
            {columnTypeDescriptions[columnType]}
            {columnType === COLUMN_TYPES.DROPDOWN && 
              <br />
            }
            {columnType === COLUMN_TYPES.DROPDOWN && 
              '(You can define options after creating the column)'
            }
          </p>
        </div>
        
        <div className={styles.buttonGroup}>
          <Button
            variant="secondary"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button type="submit">
            Add Column
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddColumnModal;