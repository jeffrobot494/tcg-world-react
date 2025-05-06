/**
 * Configuration for column types and widths in the Card Manager
 * Defines different column widths based on the content type
 */

export const COLUMN_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  DROPDOWN: 'dropdown',
  DATE: 'date',
  SHORT_TEXT: 'short-text',
  NAME: 'name'
};

export const COLUMN_WIDTHS = {
  [COLUMN_TYPES.TEXT]: 180,      // Regular text columns
  [COLUMN_TYPES.NUMBER]: 60,     // Number columns like Attack, Defense
  [COLUMN_TYPES.DROPDOWN]: 120,  // Dropdown selections
  [COLUMN_TYPES.DATE]: 130,      // Date columns
  [COLUMN_TYPES.SHORT_TEXT]: 100, // Short text like Rarity, Type
  [COLUMN_TYPES.NAME]: 160       // Card name
};

// Mapping of column IDs to types
export const COLUMN_TYPE_MAPPING = {
  // Default columns
  'name': COLUMN_TYPES.NAME,
  'id': COLUMN_TYPES.TEXT,
  'dateAdded': COLUMN_TYPES.DATE,
  'rarity': COLUMN_TYPES.SHORT_TEXT,
  
  // Common attribute columns (can be expanded)
  'attack': COLUMN_TYPES.NUMBER,
  'defense': COLUMN_TYPES.NUMBER,
  'health': COLUMN_TYPES.NUMBER,
  'cost': COLUMN_TYPES.NUMBER,
  'type': COLUMN_TYPES.SHORT_TEXT
};

/**
 * Get the column type based on column ID and attribute data
 * @param {string} columnId - The ID of the column
 * @param {Object} attributeData - Optional attribute data for custom columns
 * @returns {string} The column type
 */
export function getColumnType(columnId, attributeData = null) {
  // First check the mapping
  if (COLUMN_TYPE_MAPPING[columnId]) {
    return COLUMN_TYPE_MAPPING[columnId];
  }
  
  // If not in mapping, infer from the attribute data
  if (attributeData) {
    if (attributeData.type === 'dropdown') {
      return COLUMN_TYPES.DROPDOWN;
    }
    
    // Check if it might be a number field by looking at the attribute name
    const numberFields = ['attack', 'defense', 'hp', 'health', 'power', 'toughness', 
                         'cost', 'mana', 'energy', 'level', 'value', 'price', 'points'];
    
    if (numberFields.some(field => columnId.toLowerCase().includes(field))) {
      return COLUMN_TYPES.NUMBER;
    }
  }
  
  // Default to regular text
  return COLUMN_TYPES.TEXT;
}

/**
 * Get the column width based on column ID and attribute data
 * @param {string} columnId - The ID of the column
 * @param {Object} attributeData - Optional attribute data for custom columns
 * @returns {number} The column width in pixels
 */
export function getColumnWidth(columnId, attributeData = null) {
  const type = getColumnType(columnId, attributeData);
  return COLUMN_WIDTHS[type] || COLUMN_WIDTHS[COLUMN_TYPES.TEXT]; // Default to text width
}