import React from 'react';

interface LabelProps {
  children: React.ReactNode;
  title?: string;
}

export const Label: React.FC<LabelProps> = ({ children, title }) => (
  <label 
    className="text-[11px] text-gray-400 group-hover:text-gray-300 transition-colors flex-1 mr-2 truncate cursor-default" 
    title={title}
  >
    {children}
  </label>
);