import React from 'react';
import styles from './Pagination.module.css';

/**
 * Reusable pagination component for table data
 */
const Pagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Generate array of page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxDisplayedPages = 5; // Show max 5 page numbers at once
    
    // If showing all items, return empty array (no pagination needed)
    if (itemsPerPage === Infinity) {
      return pages;
    }
    
    let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
    let endPage = Math.min(startPage + maxDisplayedPages - 1, totalPages);
    
    // Adjust start page if needed
    if (endPage - startPage + 1 < maxDisplayedPages) {
      startPage = Math.max(1, endPage - maxDisplayedPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const value = e.target.value;
    const newItemsPerPage = value === 'all' ? Infinity : Number(value);
    onItemsPerPageChange(newItemsPerPage);
  };

  // Calculate the range of items being displayed
  let firstItem = 0;
  let lastItem = 0;
  
  if (totalItems > 0) {
    // Handle the special case where itemsPerPage is Infinity (All)
    if (itemsPerPage === Infinity) {
      firstItem = 1;
      lastItem = totalItems;
    } else {
      firstItem = (currentPage - 1) * itemsPerPage + 1;
      lastItem = Math.min(currentPage * itemsPerPage, totalItems);
    }
  }
  
  return (
    <div className={styles.pagination}>
      <div className={styles.paginationControls}>
        {/* Show per page dropdown */}
        <div className={styles.perPage}>
          <span>Show:</span>
          <select 
            value={itemsPerPage === Infinity ? 'all' : itemsPerPage} 
            onChange={handleItemsPerPageChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
          <span>per page</span>
        </div>
        
        {/* Separator */}
        <div className={styles.separator}>|</div>
        
        {/* Page info */}
        <div className={styles.pageInfo}>
          Showing {firstItem} to {lastItem} of {totalItems} cards
        </div>
        
        {/* Separator */}
        <div className={styles.separator}>|</div>
        
        {/* Page controls */}
        <div className={styles.pageButtons}>
          {itemsPerPage !== Infinity && (
            <>
              <button 
                className={styles.pageButton}
                onClick={() => handlePageChange(1)} 
                disabled={currentPage === 1 || totalPages === 0}
              >
                First
              </button>
              
              <button 
                className={styles.pageButton}
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1 || totalPages === 0}
              >
                &lt;
              </button>
              
              {getPageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                >
                  {page}
                </button>
              ))}
              
              <button 
                className={styles.pageButton}
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages || totalPages === 0}
              >
                &gt;
              </button>
              
              <button 
                className={styles.pageButton}
                onClick={() => handlePageChange(totalPages)} 
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Last
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pagination;