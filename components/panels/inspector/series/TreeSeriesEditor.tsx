
import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';
import { NumberInput } from '../../../ui/controls/NumberInput';

interface TreeSeriesEditorProps {
  series: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const TreeSeriesEditor: React.FC<TreeSeriesEditorProps> = ({ series, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Tree Layout" />
      <PropertyRow label="Layout">
        <SelectInput 
          value={series.layout || 'orthogonal'} 
          options={['orthogonal', 'radial']} 
          onChange={(v) => onChange(`${path}.layout`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Orient">
        <SelectInput 
          value={series.orient || 'LR'} 
          options={['LR', 'RL', 'TB', 'BT']} 
          onChange={(v) => onChange(`${path}.orient`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Roam">
         <Switch 
            value={!!series.roam}
            onChange={(v) => onChange(`${path}.roam`, v)}
         />
      </PropertyRow>

      <PropertyRow label="Expand/Collapse">
         <Switch 
            value={series.expandAndCollapse !== false}
            onChange={(v) => onChange(`${path}.expandAndCollapse`, v)}
         />
      </PropertyRow>

      <PropertyRow label="Initial Depth">
         <NumberInput 
            value={series.initialTreeDepth ?? 2}
            onChange={(v) => onChange(`${path}.initialTreeDepth`, v)}
            min={-1}
         />
      </PropertyRow>

      <SectionHeader title="Node Style" />
      <PropertyRow label="Symbol">
         <SelectInput 
            value={series.symbol || 'circle'}
            options={['emptyCircle', 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow']}
            onChange={(v) => onChange(`${path}.symbol`, v)}
         />
      </PropertyRow>
      <PropertyRow label="Symbol Size">
         <NumberInput 
            value={typeof series.symbolSize === 'number' ? series.symbolSize : 7}
            onChange={(v) => onChange(`${path}.symbolSize`, v)}
            min={0}
         />
      </PropertyRow>
    </>
  );
};
