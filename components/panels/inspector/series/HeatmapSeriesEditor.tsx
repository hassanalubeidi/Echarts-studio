import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { Switch } from '../../../ui/controls/Switch';
import { ColorInput } from '../../../ui/controls/ColorInput';
import { NumberInput } from '../../../ui/controls/NumberInput';

interface HeatmapSeriesEditorProps {
  series: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const HeatmapSeriesEditor: React.FC<HeatmapSeriesEditorProps> = ({ series, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Heatmap Specifics" />
      
      <SectionHeader title="Label" />
      <PropertyRow label="Show Label">
        <Switch 
          value={series.label?.show !== false} 
          onChange={(v) => onChange(`${path}.label.show`, v)} 
        />
      </PropertyRow>

      <SectionHeader title="Grid Style" />
      <PropertyRow label="Border Color">
        <ColorInput 
          value={series.itemStyle?.borderColor ?? '#fff'} 
          onChange={(v) => onChange(`${path}.itemStyle.borderColor`, v)} 
        />
      </PropertyRow>
      
      <PropertyRow label="Border Width">
        <NumberInput 
          value={series.itemStyle?.borderWidth ?? 0} 
          onChange={(v) => onChange(`${path}.itemStyle.borderWidth`, v)}
          min={0} 
        />
      </PropertyRow>

      <PropertyRow label="Border Radius">
        <NumberInput 
          value={series.itemStyle?.borderRadius ?? 0} 
          onChange={(v) => onChange(`${path}.itemStyle.borderRadius`, v)} 
          min={0}
        />
      </PropertyRow>

      <SectionHeader title="Highlight" />
      <PropertyRow label="Emphasis Focus">
         <Switch
            value={series.emphasis?.focus === 'series'}
            onChange={(v) => onChange(`${path}.emphasis.focus`, v ? 'series' : 'none')}
         />
      </PropertyRow>
    </>
  );
};