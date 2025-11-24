import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';
import { NumberInput } from '../../../ui/controls/NumberInput';

interface DataZoomEditorProps {
  dataZoom: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const DataZoomEditor: React.FC<DataZoomEditorProps> = ({ dataZoom, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Data Zoom" />
      <PropertyRow label="Type">
        <SelectInput 
          value={dataZoom.type || 'slider'} 
          options={['slider', 'inside']} 
          onChange={(v) => onChange(`${path}.type`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Orientation">
        <SelectInput 
          value={dataZoom.orient || 'horizontal'} 
          options={['horizontal', 'vertical']} 
          onChange={(v) => onChange(`${path}.orient`, v)} 
        />
      </PropertyRow>

      <SectionHeader title="Range" />
      <PropertyRow label="Start (%)">
        <NumberInput 
          value={dataZoom.start ?? 0} 
          onChange={(v) => onChange(`${path}.start`, v)} 
          min={0} max={100}
        />
      </PropertyRow>
      
      <PropertyRow label="End (%)">
        <NumberInput 
          value={dataZoom.end ?? 100} 
          onChange={(v) => onChange(`${path}.end`, v)} 
          min={0} max={100}
        />
      </PropertyRow>

      <SectionHeader title="Interaction" />
      <PropertyRow label="Realtime">
         <Switch 
            value={dataZoom.realtime !== false}
            onChange={(v) => onChange(`${path}.realtime`, v)}
         />
      </PropertyRow>
      <PropertyRow label="Lock Move">
         <Switch 
            value={!!dataZoom.moveLock}
            onChange={(v) => onChange(`${path}.moveLock`, v)}
         />
      </PropertyRow>
    </>
  );
};