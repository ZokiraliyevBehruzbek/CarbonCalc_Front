import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-green-100 p-8 transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] ${className}`}>
      {children}
    </div>
  );
};