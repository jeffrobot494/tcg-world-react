import React from 'react';
import styles from './Card.module.css';

const Card = ({
  children,
  variant = '',
  onClick,
  className = '',
  headerContent,
  footerContent,
  ...props
}) => {
  const cardClasses = [
    styles.card,
    variant ? styles[variant] : '',
    className
  ].join(' ').trim();

  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      {...props}
    >
      {headerContent && (
        <div className={styles.cardHeader}>
          {headerContent}
        </div>
      )}
      
      <div className={styles.cardBody}>
        {children}
      </div>
      
      {footerContent && (
        <div className={styles.cardFooter}>
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default Card;