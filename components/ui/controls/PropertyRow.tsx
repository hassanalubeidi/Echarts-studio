import React from 'react';
import { Label } from './Label';

interface PropertyRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const PropertyRow: React.FC<PropertyRowProps> = ({ label, children, className = '', title }) => (
  <div className={`flex items-center justify-between mb-2 group min-h-[24px] ${className}`}>
    <Label title={title || label}>{label}</Label>
    <div className="flex-none flex items-center justify-end max-w-[60%]">{children}</div>
  </div>
);