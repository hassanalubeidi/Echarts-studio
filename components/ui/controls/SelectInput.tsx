
import React from 'react';

interface SelectInputProps {
  value: string | number;
  options: (string | number | { label: string; value: string | number })[];
  onChange: (val: string) => void;
}

export const SelectInput: React.FC<SelectInputProps> = ({ value, options, onChange }) => (
  <select 
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-32 bg-gray-800 border border-gray-700 hover:border-gray-600 text-[11px] text-white rounded-sm px-1 py-0.5 focus:border-accent-500 focus:ring-1 focus:ring-accent-500/50 outline-none cursor-pointer transition-colors"
  >
    {options.map((o, i) => {
        const label = (typeof o === 'object' && o !== null) ? o.label : String(o);
        const val = (typeof o === 'object' && o !== null) ? o.value : String(o);
        return <option key={`${val}-${i}`} value={val}>{label}</option>;
    })}
  </select>
);
