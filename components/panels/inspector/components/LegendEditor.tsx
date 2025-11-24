import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { TextInput } from '../../../ui/controls/TextInput';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';
import { NumberInput } from '../../../ui/controls/NumberInput';

interface LegendEditorProps {
  legend: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const LegendEditor: React.FC<LegendEditorProps> = ({ legend, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Legend Layout" />
      <PropertyRow label="Show">
        <Switch 
          value={legend.show !== false} 
          onChange={(v) => onChange(`${path}.show`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Type">
        <SelectInput 
          value={legend.type || 'plain'} 
          options={['plain', 'scroll']} 
          onChange={(v) => onChange(`${path}.type`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Orientation">
        <SelectInput 
          value={legend.orient || 'horizontal'} 
          options={['horizontal', 'vertical']} 
          onChange={(v) => onChange(`${path}.orient`, v)} 
        />
      </PropertyRow>

      <SectionHeader title="Position" />
      <PropertyRow label="Left">
        <TextInput 
          value={legend.left ?? 'center'} 
          onChange={(v) => onChange(`${path}.left`, v)} 
        />
      </PropertyRow>
      <PropertyRow label="Top">
        <TextInput 
          value={legend.top ?? 'auto'} 
          onChange={(v) => onChange(`${path}.top`, v)} 
        />
      </PropertyRow>
      <PropertyRow label="Right">
        <TextInput 
          value={legend.right ?? 'auto'} 
          onChange={(v) => onChange(`${path}.right`, v)} 
        />
      </PropertyRow>
      <PropertyRow label="Bottom">
        <TextInput 
          value={legend.bottom ?? 'auto'} 
          onChange={(v) => onChange(`${path}.bottom`, v)} 
        />
      </PropertyRow>

      <SectionHeader title="Items" />
      <PropertyRow label="Item Gap">
        <NumberInput 
          value={legend.itemGap ?? 10} 
          onChange={(v) => onChange(`${path}.itemGap`, v)} 
          min={0}
        />
      </PropertyRow>
      <PropertyRow label="Item Width">
        <NumberInput 
          value={legend.itemWidth ?? 25} 
          onChange={(v) => onChange(`${path}.itemWidth`, v)} 
          min={0}
        />
      </PropertyRow>
      <PropertyRow label="Item Height">
        <NumberInput 
          value={legend.itemHeight ?? 14} 
          onChange={(v) => onChange(`${path}.itemHeight`, v)} 
          min={0}
        />
      </PropertyRow>
    </>
  );
};