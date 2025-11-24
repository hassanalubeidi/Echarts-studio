import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder }) => (
  <input 
    type="text" 
    value={value || ''} 
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-32 bg-gray-800 border border-gray-700 hover:border-gray-600 text-[11px] text-white rounded-sm px-1.5 py-0.5 focus:border-accent-500 focus:ring-1 focus:ring-accent-500/50 outline-none transition-colors"
  />
);