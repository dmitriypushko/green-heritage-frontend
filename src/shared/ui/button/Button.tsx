import React from 'react';
import styles from './button.module.css'; // Будем использовать модульные стили

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick,
  variant = 'primary', 
  ...props 
}) => {
  return (
    <button onClick={onClick} {...props} 
            className={`${styles.btn} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
};