import React from 'react';
import styles from './Header.module.css';

const Header = ({ 
  title, 
  subtitle, 
  icon, 
  iconBackground,
  className = '', 
  ...props 
}) => {
  return (
    <div className={`${styles.header} ${className}`} {...props}>
      <div className={styles.titleContainer}>
        {icon && (
          <div 
            className={styles.icon} 
            style={{ backgroundColor: iconBackground || 'var(--accent)' }}
          >
            {icon}
          </div>
        )}
        <h1 className={styles.title}>{title}</h1>
      </div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
  );
};

export default Header;