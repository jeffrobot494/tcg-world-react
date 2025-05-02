import React from 'react';
import Card from '../common/Card';
import styles from './ActionCard.module.css';

// Extending Card component for action cards
const ActionCard = ({ 
  title, 
  description, 
  icon, 
  buttonText, 
  onClick,
  className = '',
  ...props 
}) => {
  // Create header content for the Card
  const headerContent = (
    <div className={styles.actionHeader}>
      <h3 className={styles.actionTitle}>{title}</h3>
      <p className={styles.actionDescription}>{description}</p>
    </div>
  );

  return (
    <Card
      className={`${styles.actionCard} ${className}`}
      headerContent={headerContent}
      {...props}
    >
      <div className={styles.actionBody}>
        <button className={styles.actionButton} onClick={onClick}>
          {icon}
          <span>{buttonText}</span>
        </button>
      </div>
    </Card>
  );
};

export default ActionCard;