import React from 'react';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-3 mt-4 border-b border-gray-800 pb-1 select-none">
    {title}
  </div>
);