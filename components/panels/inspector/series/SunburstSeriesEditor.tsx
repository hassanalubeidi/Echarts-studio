
import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';
import { TextInput } from '../../../ui/controls/TextInput';

interface SunburstSeriesEditorProps {
  series: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const SunburstSeriesEditor: React.FC<SunburstSeriesEditorProps> = ({ series, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Sunburst Config" />
      
      <PropertyRow label="Radius">
        <TextInput 
          value={Array.isArray(series.radius) ? JSON.stringify(series.radius) : (series.radius || "['0%', '75%']")} 
          onChange={(v) => {
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
        />
      </PropertyRow>

      <PropertyRow label="Center">
         <TextInput 
             value={JSON.stringify(series.center || ['50%', '50%'])}
             onChange={(v) => {
                 try { onChange(`${path}.center`, JSON.parse(v)); } catch {}
             }}
         />
      </PropertyRow>

      <PropertyRow label="Sort">
        <SelectInput 
          value={series.sort || 'desc'} 
          options={['desc', 'asc', null as any]} 
          onChange={(v) => onChange(`${path}.sort`, v)} 
        />
      </PropertyRow>

      <SectionHeader title="Labels" />
      <PropertyRow label="Rotate">
         <SelectInput 
            value={series.label?.rotate || 'radial'}
            options={['radial', 'tangential', 'none']}
            onChange={(v) => onChange(`${path}.label.rotate`, v)}
         />
      </PropertyRow>
      
      <PropertyRow label="Align">
         <SelectInput 
            value={series.label?.align || 'center'}
            options={['center', 'left', 'right']}
            onChange={(v) => onChange(`${path}.label.align`, v)}
         />
      </PropertyRow>

      <SectionHeader title="Interaction" />
      <PropertyRow label="Node Click">
         <SelectInput 
            value={series.nodeClick || 'rootToNode'}
            options={['rootToNode', 'link']}
            onChange={(v) => onChange(`${path}.nodeClick`, v)}
         />
      </PropertyRow>
    </>
  );
};
