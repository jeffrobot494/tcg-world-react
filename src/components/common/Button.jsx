import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false,
  type = 'button',
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const buttonClasses = [
    styles.button,
    styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    fullWidth ? styles.fullWidth : '',
    className
  ].join(' ').trim();
  
  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;