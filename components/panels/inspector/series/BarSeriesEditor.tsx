import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { Switch } from '../../../ui/controls/Switch';
import { NumberInput } from '../../../ui/controls/NumberInput';
import { TextInput } from '../../../ui/controls/TextInput';
import { ColorInput } from '../../../ui/controls/ColorInput';

interface BarSeriesEditorProps {
  series: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const BarSeriesEditor: React.FC<BarSeriesEditorProps> = ({ series, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Bar Specifics" />
      
      <PropertyRow label="Bar Width">
        <TextInput 
          value={series.barWidth || 'auto'} 
          onChange={(v) => onChange(`${path}.barWidth`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Show Background">
        <Switch 
          value={!!series.showBackground} 
          onChange={(v) => onChange(`${path}.showBackground`, v)} 
        />
      </PropertyRow>
      
      {series.showBackground && (
         <PropertyRow label="BG Color">
            <ColorInput 
               value={series.backgroundStyle?.color ?? '#eee'}
               onChange={(v) => onChange(`${path}.backgroundStyle.color`, v)}
            />
         </PropertyRow>
      )}

      <PropertyRow label="Stack Group">
        <TextInput 
          value={series.stack || ''} 
          onChange={(v) => onChange(`${path}.stack`, v)} 
          placeholder="None"
        />
      </PropertyRow>

      <PropertyRow label="Round Cap">
        <Switch 
            value={!!series.roundCap} 
            onChange={(v) => onChange(`${path}.roundCap`, v)} 
        />
      </PropertyRow>
    </>
  );
};