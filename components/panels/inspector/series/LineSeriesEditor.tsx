import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { Switch } from '../../../ui/controls/Switch';
import { NumberInput } from '../../../ui/controls/NumberInput';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { ColorInput } from '../../../ui/controls/ColorInput';

interface LineSeriesEditorProps {
  series: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const LineSeriesEditor: React.FC<LineSeriesEditorProps> = ({ series, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Line Specifics" />
      
      <PropertyRow label="Smooth Line">
        <Switch 
          value={!!series.smooth} 
          onChange={(v) => onChange(`${path}.smooth`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Step Type">
        <SelectInput 
          value={series.step || 'false'} 
          options={['false', 'start', 'middle', 'end']} 
          onChange={(v) => onChange(`${path}.step`, v === 'false' ? false : v)} 
        />
      </PropertyRow>

      <PropertyRow label="Show Symbol">
        <SelectInput
            value={series.symbol || 'circle'}
            options={['none', 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow']}
            onChange={(v) => onChange(`${path}.symbol`, v)}
        />
      </PropertyRow>

      <PropertyRow label="Symbol Size">
        <NumberInput 
          value={typeof series.symbolSize === 'number' ? series.symbolSize : 4} 
          onChange={(v) => onChange(`${path}.symbolSize`, v)} 
          min={0}
        />
      </PropertyRow>

      <SectionHeader title="Line Style" />
      <PropertyRow label="Width">
         <NumberInput 
            value={series.lineStyle?.width ?? 2}
            onChange={(v) => onChange(`${path}.lineStyle.width`, v)}
            min={0}
         />
      </PropertyRow>
      <PropertyRow label="Type">
         <SelectInput 
            value={series.lineStyle?.type ?? 'solid'}
            options={['solid', 'dashed', 'dotted']}
            onChange={(v) => onChange(`${path}.lineStyle.type`, v)}
         />
      </PropertyRow>
       <PropertyRow label="Color">
         <ColorInput 
            value={series.lineStyle?.color ?? '#000'}
            onChange={(v) => onChange(`${path}.lineStyle.color`, v)}
         />
      </PropertyRow>
    </>
  );
};