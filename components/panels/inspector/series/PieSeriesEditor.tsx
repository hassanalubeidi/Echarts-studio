import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { Switch } from '../../../ui/controls/Switch';
import { TextInput } from '../../../ui/controls/TextInput';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { NumberInput } from '../../../ui/controls/NumberInput';

interface PieSeriesEditorProps {
  series: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const PieSeriesEditor: React.FC<PieSeriesEditorProps> = ({ series, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Pie Specifics" />
      
      <PropertyRow label="Radius" title="Can be single value '50%' or array ['40%', '70%']">
        <TextInput 
          value={Array.isArray(series.radius) ? JSON.stringify(series.radius) : (series.radius || '75%')} 
          onChange={(v) => {
            // Try to parse array if it looks like one
            if (v.startsWith('[') && v.endsWith(']')) {
                try {
                    onChange(`${path}.radius`, JSON.parse(v));
                } catch {
                    onChange(`${path}.radius`, v);
                }
            } else {
                onChange(`${path}.radius`, v);
            }
          }} 
          placeholder="['0%', '75%']"
        />
      </PropertyRow>

      <PropertyRow label="Center X" title="X position (e.g. '50%')">
         <TextInput 
            value={Array.isArray(series.center) ? series.center[0] : '50%'}
            onChange={(v) => {
                const currentY = Array.isArray(series.center) ? series.center[1] : '50%';
                onChange(`${path}.center`, [v, currentY]);
            }}
         />
      </PropertyRow>
      
      <PropertyRow label="Center Y" title="Y position (e.g. '50%')">
         <TextInput 
            value={Array.isArray(series.center) ? series.center[1] : '50%'}
            onChange={(v) => {
                const currentX = Array.isArray(series.center) ? series.center[0] : '50%';
                onChange(`${path}.center`, [currentX, v]);
            }}
         />
      </PropertyRow>

      <PropertyRow label="Rose Type">
        <SelectInput 
          value={series.roseType || 'false'} 
          options={['false', 'radius', 'area']} 
          onChange={(v) => onChange(`${path}.roseType`, v === 'false' ? false : v)} 
        />
      </PropertyRow>

      <SectionHeader title="Label" />
      <PropertyRow label="Show Label">
        <Switch 
          value={series.label?.show !== false} 
          onChange={(v) => onChange(`${path}.label.show`, v)} 
        />
      </PropertyRow>
      
      <PropertyRow label="Position">
        <SelectInput 
          value={series.label?.position || 'outside'} 
          options={['outside', 'inside', 'center']} 
          onChange={(v) => onChange(`${path}.label.position`, v)} 
        />
      </PropertyRow>

      <SectionHeader title="Interaction" />
      <PropertyRow label="Selected Mode">
         <SelectInput 
            value={series.selectedMode || 'false'}
            options={['false', 'single', 'multiple']}
            onChange={(v) => onChange(`${path}.selectedMode`, v === 'false' ? false : v)}
         />
      </PropertyRow>
      <PropertyRow label="Selected Offset">
         <NumberInput
            value={series.selectedOffset ?? 10}
            onChange={(v) => onChange(`${path}.selectedOffset`, v)}
         />
      </PropertyRow>
    </>
  );
};