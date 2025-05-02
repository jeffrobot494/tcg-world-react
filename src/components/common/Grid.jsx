import React from 'react';
import styles from './Grid.module.css';

const Grid = ({
  children,
  size = '', // xs, sm, md, lg, xl
  gap = 'md', // sm, md, lg
  className = '',
  ...props
}) => {
  const gridClasses = [
    styles.grid,
    size ? styles[size] : '',
    gap ? styles[`gap${gap.charAt(0).toUpperCase() + gap.slice(1)}`] : '',
    className
  ].join(' ').trim();

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
};

export default Grid;