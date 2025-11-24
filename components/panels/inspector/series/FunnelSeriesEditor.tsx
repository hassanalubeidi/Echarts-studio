import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { TextInput } from '../../../ui/controls/TextInput';
import { NumberInput } from '../../../ui/controls/NumberInput';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';

interface FunnelSeriesEditorProps {
  series: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const FunnelSeriesEditor: React.FC<FunnelSeriesEditorProps> = ({ series, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Funnel Geometry" />
      
      <PropertyRow label="Sort">
        <SelectInput 
          value={series.sort || 'descending'} 
          options={['descending', 'ascending', 'none']} 
          onChange={(v) => onChange(`${path}.sort`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Min Size">
        <TextInput 
          value={series.minSize || '0%'} 
          onChange={(v) => onChange(`${path}.minSize`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Max Size">
        <TextInput 
          value={series.maxSize || '100%'} 
          onChange={(v) => onChange(`${path}.maxSize`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Gap">
        <NumberInput 
          value={series.gap || 0} 
          onChange={(v) => onChange(`${path}.gap`, v)} 
          min={0}
        />
      </PropertyRow>

      <PropertyRow label="Align">
        <SelectInput 
          value={series.funnelAlign || 'center'} 
          options={['left', 'center', 'right']} 
          onChange={(v) => onChange(`${path}.funnelAlign`, v)} 
        />
      </PropertyRow>

      <SectionHeader title="Label" />
      <PropertyRow label="Position">
        <SelectInput 
          value={series.label?.position || 'outside'} 
          options={['outside', 'inside', 'insideRight', 'left']} 
          onChange={(v) => onChange(`${path}.label.position`, v)} 
        />
      </PropertyRow>

      <SectionHeader title="Orientation" />
      <PropertyRow label="Orient">
        <SelectInput 
          value={series.orient || 'vertical'} 
          options={['vertical', 'horizontal']} 
          onChange={(v) => onChange(`${path}.orient`, v)} 
        />
      </PropertyRow>
    </>
  );
};