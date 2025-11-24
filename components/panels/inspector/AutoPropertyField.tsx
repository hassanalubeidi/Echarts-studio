import React from 'react';
import { PropertyRow } from '../../ui/controls/PropertyRow';
import { Switch } from '../../ui/controls/Switch';
import { ColorInput } from '../../ui/controls/ColorInput';
import { NumberInput } from '../../ui/controls/NumberInput';
import { SelectInput } from '../../ui/controls/SelectInput';
import { TextInput } from '../../ui/controls/TextInput';

interface AutoPropertyFieldProps {
  path: string;
  propKey: string;
  value: any;
  onChange: (path: string, val: any) => void;
}

export const AutoPropertyField: React.FC<AutoPropertyFieldProps> = ({ path, propKey, value, onChange }) => {
  const fullPath = path ? `${path}.${propKey}` : propKey;
  const label = propKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  
  // Boolean
  if (typeof value === 'boolean' || propKey === 'show' || propKey === 'silent' || propKey === 'animation') {
    return (
      <PropertyRow label={label}>
        <Switch value={value} onChange={(v) => onChange(fullPath, v)} />
      </PropertyRow>
    );
  }
  
  // Colors
  if (propKey.toLowerCase().includes('color') || propKey === 'stroke' || propKey === 'fill') {
    return (
      <PropertyRow label={label}>
        <ColorInput value={value} onChange={(v) => onChange(fullPath, v)} />
      </PropertyRow>
    );
  }

  // Numbers
  if (typeof value === 'number' || propKey === 'width' || propKey === 'height' || propKey === 'z' || propKey === 'zlevel' || propKey === 'opacity') {
    return (
      <PropertyRow label={label}>
        <NumberInput 
          value={value} 
          onChange={(v) => onChange(fullPath, v)} 
          step={propKey.includes('opacity') ? 0.1 : 1} 
        />
      </PropertyRow>
    );
  }

  // Series Type Dropdown
  if (propKey === 'type' && path.startsWith('series')) {
    return (
      <PropertyRow label={label}>
        <SelectInput 
          value={value} 
          options={['line', 'bar', 'pie', 'scatter', 'candlestick', 'heatmap', 'matrix']} 
          onChange={(v) => onChange(fullPath, v)} 
        />
      </PropertyRow>
    );
  }

  // Default Text
  return (
    <PropertyRow label={label}>
      <TextInput value={value} onChange={(v) => onChange(fullPath, v)} />
    </PropertyRow>
  );
};