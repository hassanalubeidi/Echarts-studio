import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';
import { TextInput } from '../../../ui/controls/TextInput';
import { NumberInput } from '../../../ui/controls/NumberInput';

interface BrushEditorProps {
  brush: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const BrushEditor: React.FC<BrushEditorProps> = ({ brush, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Brush Tools" />
      <PropertyRow label="Toolbox" title="Available brush types">
        <TextInput 
          value={Array.isArray(brush.toolbox) ? JSON.stringify(brush.toolbox) : (brush.toolbox || "['rect', 'polygon', 'keep', 'clear']")} 
          onChange={(v) => {
             try {
                 // Simple validation to ensure array format if user types manually
                 if (v.startsWith('[') && v.endsWith(']')) {
                     onChange(`${path}.toolbox`, JSON.parse(v.replace(/'/g, '"')));
                 } else {
                     onChange(`${path}.toolbox`, [v]);
                 }
             } catch {
                 // Fallback
             }
          }} 
          placeholder="['rect', 'polygon', ...]"
        />
      </PropertyRow>

      <PropertyRow label="Brush Link" title="Link brushes across series or 'all'">
        <TextInput 
           value={brush.brushLink || 'None'}
           onChange={(v) => onChange(`${path}.brushLink`, v === 'None' ? null : v)}
        />
      </PropertyRow>

      <SectionHeader title="Behavior" />
      <PropertyRow label="Brush Mode">
         <SelectInput 
            value={brush.brushMode || 'single'}
            options={['single', 'multiple']}
            onChange={(v) => onChange(`${path}.brushMode`, v)}
         />
      </PropertyRow>

      <PropertyRow label="Transformable">
         <Switch 
            value={brush.transformable !== false}
            onChange={(v) => onChange(`${path}.transformable`, v)}
         />
      </PropertyRow>
      
      <PropertyRow label="Throttle Type">
         <SelectInput 
            value={brush.throttleType || 'fixRate'}
            options={['fixRate', 'debounce']}
            onChange={(v) => onChange(`${path}.throttleType`, v)}
         />
      </PropertyRow>
      
      <PropertyRow label="Throttle Delay">
         <NumberInput 
            value={brush.throttleDelay ?? 0}
            onChange={(v) => onChange(`${path}.throttleDelay`, v)}
            min={0}
         />
      </PropertyRow>

      <PropertyRow label="Remove on Click">
         <Switch 
            value={!!brush.removeOnClick}
            onChange={(v) => onChange(`${path}.removeOnClick`, v)}
         />
      </PropertyRow>
    </>
  );
};