import React from 'react';
import CardSearchControls from './CardSearchControls';
import DeckBuilderCardGrid from './DeckBuilderCardGrid';
import Pagination from '../common/Pagination';
import Header from '../common/Header';
import styles from './CardBrowser.module.css';

/**
 * CardBrowser component
 * Container for card search, filtering, grid display and pagination
 */
const CardBrowser = ({ 
  cards, 
  onSearch, 
  onTypeFilterChange,
  onAddCard,
  pagination,
  onPageChange,
  onItemsPerPageChange,
  searchTerm,
  typeFilter
}) => {
  return (
    <div className={styles.cardBrowser}>
      <Header
        title="Card Browser"
        subtitle="Search and add cards to your deck"
        className={styles.header}
      />
      
      <CardSearchControls 
        searchTerm={searchTerm}
        typeFilter={typeFilter}
        onSearch={onSearch}
        onTypeFilterChange={onTypeFilterChange}
      />
      
      <DeckBuilderCardGrid 
        cards={cards}
        onCardClick={onAddCard}
      />
      
      <div className={styles.paginationContainer}>
        <Pagination 
          currentPage={pagination.currentPage}
          itemsPerPage={pagination.itemsPerPage}
          totalItems={pagination.totalItems}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </div>
    </div>
  );
};

export default CardBrowser;