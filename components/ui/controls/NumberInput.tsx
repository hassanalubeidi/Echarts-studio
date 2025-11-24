import React from 'react';

interface NumberInputProps {
  value: number;
  onChange: (val: number) => void;
  step?: number;
  min?: number;
  max?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, step = 1, min, max }) => (
  <input 
    type="number" 
    step={step}
    min={min}
    max={max}
    value={value ?? 0} 
    onChange={(e) => onChange(parseFloat(e.target.value))}
    className="w-20 bg-gray-800 border border-gray-700 hover:border-gray-600 text-[11px] text-white rounded-sm px-1.5 py-0.5 focus:border-accent-500 focus:ring-1 focus:ring-accent-500/50 outline-none font-mono text-right transition-colors appearance-none"
  />
);