import React from 'react';

interface SwitchProps {
  value: boolean;
  onChange: (val: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({ value, onChange }) => (
  <div 
    className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${value ? 'bg-accent-600' : 'bg-gray-700'}`}
    onClick={() => onChange(!value)}
  >
    <div 
      className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-200 ${value ? 'left-4.5 translate-x-0' : 'left-0.5'}`}
      style={{ left: value ? 'calc(100% - 14px)' : '2px' }}
    />
  </div>
);