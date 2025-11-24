import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { Switch } from '../../../ui/controls/Switch';
import { NumberInput } from '../../../ui/controls/NumberInput';
import { SelectInput } from '../../../ui/controls/SelectInput';

interface ScatterSeriesEditorProps {
  series: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const ScatterSeriesEditor: React.FC<ScatterSeriesEditorProps> = ({ series, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Scatter Specifics" />
      
      <PropertyRow label="Symbol">
        <SelectInput 
          value={series.symbol || 'circle'} 
          options={['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow']} 
          onChange={(v) => onChange(`${path}.symbol`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Symbol Size">
        <NumberInput 
          value={typeof series.symbolSize === 'number' ? series.symbolSize : 10} 
          onChange={(v) => onChange(`${path}.symbolSize`, v)} 
          min={0}
        />
      </PropertyRow>

      <SectionHeader title="Optimization" />
      <PropertyRow label="Large Mode" title="Enable for >2k points">
        <Switch 
          value={!!series.large} 
          onChange={(v) => onChange(`${path}.large`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Large Threshold">
        <NumberInput 
          value={series.largeThreshold || 2000} 
          onChange={(v) => onChange(`${path}.largeThreshold`, v)} 
          step={100}
        />
      </PropertyRow>
    </>
  );
};