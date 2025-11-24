
import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';
import { NumberInput } from '../../../ui/controls/NumberInput';
import { TextInput } from '../../../ui/controls/TextInput';

interface SankeySeriesEditorProps {
  series: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const SankeySeriesEditor: React.FC<SankeySeriesEditorProps> = ({ series, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Sankey Layout" />
      
      <PropertyRow label="Orient">
        <SelectInput 
          value={series.orient || 'horizontal'} 
          options={['horizontal', 'vertical']} 
          onChange={(v) => onChange(`${path}.orient`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Align">
         <SelectInput 
            value={series.nodeAlign || 'justify'}
            options={['justify', 'left', 'right']}
            onChange={(v) => onChange(`${path}.nodeAlign`, v)}
         />
      </PropertyRow>

      <PropertyRow label="Draggable">
         <Switch 
            value={series.draggable !== false}
            onChange={(v) => onChange(`${path}.draggable`, v)}
         />
      </PropertyRow>

      <SectionHeader title="Nodes" />
      <PropertyRow label="Node Width">
         <NumberInput 
            value={series.nodeWidth ?? 20}
            onChange={(v) => onChange(`${path}.nodeWidth`, v)}
            min={0}
         />
      </PropertyRow>
      
      <PropertyRow label="Node Gap">
         <NumberInput 
            value={series.nodeGap ?? 8}
            onChange={(v) => onChange(`${path}.nodeGap`, v)}
            min={0}
         />
      </PropertyRow>

      <SectionHeader title="Focus" />
      <PropertyRow label="Emphasis Focus">
         <SelectInput 
            value={series.emphasis?.focus || 'none'}
            options={['none', 'adjacency', 'series']}
            onChange={(v) => onChange(`${path}.emphasis.focus`, v)}
         />
      </PropertyRow>
    </>
  );
};
