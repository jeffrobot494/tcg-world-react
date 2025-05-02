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
    const newItemsPerPage = Number(e.target.value);
    onItemsPerPageChange(newItemsPerPage);
  };

  // Calculate the range of items being displayed
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  return (
    <div className={styles.pagination}>
      <div className={styles.pageInfo}>
        Showing {firstItem} to {lastItem} of {totalItems} items
      </div>
      
      <div className={styles.pageControls}>
        <button 
          className={styles.pageButton}
          onClick={() => handlePageChange(1)} 
          disabled={currentPage === 1}
        >
          First
        </button>
        
        <button 
          className={styles.pageButton}
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Prev
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
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        
        <button 
          className={styles.pageButton}
          onClick={() => handlePageChange(totalPages)} 
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
      
      <div className={styles.perPage}>
        <span>Show:</span>
        <select 
          value={itemsPerPage} 
          onChange={handleItemsPerPageChange}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;