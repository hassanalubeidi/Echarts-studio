import React from 'react';

interface ColorInputProps {
  value: string;
  onChange: (val: string) => void;
}

export const ColorInput: React.FC<ColorInputProps> = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    <div 
      className="w-4 h-4 rounded-sm border border-gray-600 shadow-sm cursor-pointer hover:border-accent-500" 
      style={{ backgroundColor: value }}
      title={value}
    ></div>
    <input 
      type="text" 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)}
      className="w-24 bg-gray-800 border border-gray-700 hover:border-gray-600 text-[11px] text-white rounded-sm px-1.5 py-0.5 focus:border-accent-500 focus:ring-1 focus:ring-accent-500/50 outline-none font-mono transition-colors"
      placeholder="none"
    />
  </div>
);