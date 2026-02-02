import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
  title?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', filled = false, size, title }) => {
  return (
    <span 
      className={`material-symbols-outlined ${filled ? 'filled' : ''} ${className}`}
      style={size ? { fontSize: `${size}px` } : undefined}
      title={title}
    >
      {name}
    </span>
  );
};