import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import styles from './AddCardModal.module.css'; // Reuse existing styles

/**
 * Modal for editing column properties, including dropdown options
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility of the modal
 * @param {function} props.onClose - Function to call when modal is closed
 * @param {function} props.onSave - Function to call with updated column data
 * @param {string} props.columnId - ID of the column being edited
 * @param {Object} props.columnData - Current data for the column being edited
 */
const EditColumnModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  columnId, 
  columnData 
}) => {
  const [columnName, setColumnName] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [newOption, setNewOption] = useState('');
  const [error, setError] = useState('');

  // Initialize form with column data when opened
  useEffect(() => {
    if (isOpen && columnData) {
      setColumnName(columnData.name || '');
      setDropdownOptions(columnData.options || []);
    }
  }, [isOpen, columnData]);

  // Handle adding a new dropdown option
  const handleAddOption = () => {
    if (newOption.trim()) {
      setDropdownOptions([...dropdownOptions, newOption.trim()]);
      setNewOption('');
    }
  };

  // Handle adding option on Enter key
  const handleOptionKeyPress = (e) => {
    if (e.key === 'Enter' && newOption.trim()) {
      e.preventDefault(); // Prevent form submission
      handleAddOption();
    }
  };

  // Handle removing a dropdown option
  const handleRemoveOption = (index) => {
    const updatedOptions = [...dropdownOptions];
    updatedOptions.splice(index, 1);
    setDropdownOptions(updatedOptions);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate column name
    if (!columnName.trim()) {
      setError('Please enter a column name');
      return;
    }
    
    // Save changes
    onSave(columnId, {
      name: columnName.trim(),
      options: dropdownOptions
    });
    
    onClose();
  };

  // Reset form and close modal
  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Column">
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
            onChange={(e) => setColumnName(e.target.value)}
            placeholder="Enter column name"
            autoFocus
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>
        
        {/* Only show options section for dropdown columns */}
        {columnData && columnData.type === 'dropdown' && (
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Dropdown Options
            </label>
            <div className={styles.optionsList}>
              {dropdownOptions.length === 0 ? (
                <p className={styles.hint}>No options defined yet. Add some options below.</p>
              ) : (
                <ul className={styles.optionItems}>
                  {dropdownOptions.map((option, index) => (
                    <li key={index} className={styles.optionItem}>
                      {option}
                      <button 
                        type="button" 
                        className={styles.removeOptionBtn}
                        onClick={() => handleRemoveOption(index)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className={styles.addOptionForm}>
              <input
                type="text"
                className={styles.input}
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyPress={handleOptionKeyPress}
                placeholder="New option"
              />
              <Button 
                type="button" 
                variant="secondary"
                onClick={handleAddOption}
              >
                Add
              </Button>
            </div>
          </div>
        )}
        
        <div className={styles.buttonGroup}>
          <Button
            variant="secondary"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditColumnModal;