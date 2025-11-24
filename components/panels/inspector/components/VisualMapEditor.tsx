import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';
import { NumberInput } from '../../../ui/controls/NumberInput';
import { TextInput } from '../../../ui/controls/TextInput';

interface VisualMapEditorProps {
  visualMap: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const VisualMapEditor: React.FC<VisualMapEditorProps> = ({ visualMap, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Visual Mapping" />
      <PropertyRow label="Type">
        <SelectInput 
          value={visualMap.type || 'continuous'} 
          options={['continuous', 'piecewise']} 
          onChange={(v) => onChange(`${path}.type`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Calculable">
         <Switch 
            value={!!visualMap.calculable}
            onChange={(v) => onChange(`${path}.calculable`, v)}
         />
      </PropertyRow>

      <SectionHeader title="Domain" />
      <PropertyRow label="Min">
        <NumberInput 
          value={visualMap.min ?? 0} 
          onChange={(v) => onChange(`${path}.min`, v)} 
        />
      </PropertyRow>
      
      <PropertyRow label="Max">
        <NumberInput 
          value={visualMap.max ?? 100} 
          onChange={(v) => onChange(`${path}.max`, v)} 
        />
      </PropertyRow>
      
      <PropertyRow label="Dimension">
         <TextInput 
            value={visualMap.dimension ?? ''}
            onChange={(v) => onChange(`${path}.dimension`, v)}
            placeholder="auto"
         />
      </PropertyRow>

      <SectionHeader title="Position" />
      <PropertyRow label="Orient">
        <SelectInput 
          value={visualMap.orient || 'vertical'} 
          options={['vertical', 'horizontal']} 
          onChange={(v) => onChange(`${path}.orient`, v)} 
        />
      </PropertyRow>
      
      <PropertyRow label="Left">
        <TextInput 
          value={visualMap.left ?? 'auto'} 
          onChange={(v) => onChange(`${path}.left`, v)} 
        />
      </PropertyRow>
      <PropertyRow label="Bottom">
        <TextInput 
          value={visualMap.bottom ?? 'auto'} 
          onChange={(v) => onChange(`${path}.bottom`, v)} 
        />
      </PropertyRow>
    </>
  );
};