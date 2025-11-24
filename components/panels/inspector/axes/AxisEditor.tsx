import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { TextInput } from '../../../ui/controls/TextInput';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';
import { NumberInput } from '../../../ui/controls/NumberInput';
import { ColorInput } from '../../../ui/controls/ColorInput';

interface AxisEditorProps {
  axis: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const AxisEditor: React.FC<AxisEditorProps> = ({ axis, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Axis Configuration" />
      
      <PropertyRow label="Show">
        <Switch 
          value={axis.show !== false} 
          onChange={(v) => onChange(`${path}.show`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Type">
        <SelectInput 
          value={axis.type || 'value'} 
          options={['value', 'category', 'time', 'log']} 
          onChange={(v) => onChange(`${path}.type`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Position">
        <SelectInput 
          value={axis.position || (path.includes('xAxis') ? 'bottom' : 'left')} 
          options={['top', 'bottom', 'left', 'right']} 
          onChange={(v) => onChange(`${path}.position`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Inverse">
        <Switch 
          value={!!axis.inverse} 
          onChange={(v) => onChange(`${path}.inverse`, v)} 
        />
      </PropertyRow>

      <SectionHeader title="Scale & Bounds" />
      <PropertyRow label="Min" title="Value or 'dataMin'">
        <TextInput 
          value={axis.min ?? ''} 
          onChange={(v) => {
              const num = parseFloat(v);
              onChange(`${path}.min`, isNaN(num) ? v : num);
          }} 
          placeholder="auto"
        />
      </PropertyRow>
      <PropertyRow label="Max" title="Value or 'dataMax'">
        <TextInput 
          value={axis.max ?? ''} 
          onChange={(v) => {
              const num = parseFloat(v);
              onChange(`${path}.max`, isNaN(num) ? v : num);
          }} 
          placeholder="auto"
        />
      </PropertyRow>

      <SectionHeader title="Title / Name" />
      <PropertyRow label="Name">
        <TextInput 
          value={axis.name || ''} 
          onChange={(v) => onChange(`${path}.name`, v)} 
        />
      </PropertyRow>
      <PropertyRow label="Name Location">
        <SelectInput 
          value={axis.nameLocation || 'end'} 
          options={['start', 'middle', 'end']} 
          onChange={(v) => onChange(`${path}.nameLocation`, v)} 
        />
      </PropertyRow>

      <SectionHeader title="Lines" />
      <PropertyRow label="Axis Line">
         <Switch 
            value={axis.axisLine?.show !== false}
            onChange={(v) => onChange(`${path}.axisLine.show`, v)}
         />
      </PropertyRow>
      <PropertyRow label="Grid Line">
         <Switch 
            value={axis.splitLine?.show !== false}
            onChange={(v) => onChange(`${path}.splitLine.show`, v)}
         />
      </PropertyRow>
      {axis.splitLine?.show !== false && (
          <PropertyRow label="Grid Color">
             <ColorInput 
                value={axis.splitLine?.lineStyle?.color ?? '#333'}
                onChange={(v) => onChange(`${path}.splitLine.lineStyle.color`, v)}
             />
          </PropertyRow>
      )}

      <SectionHeader title="Label" />
      <PropertyRow label="Show Label">
         <Switch 
            value={axis.axisLabel?.show !== false}
            onChange={(v) => onChange(`${path}.axisLabel.show`, v)}
         />
      </PropertyRow>
      <PropertyRow label="Rotation">
         <NumberInput 
            value={axis.axisLabel?.rotate ?? 0}
            onChange={(v) => onChange(`${path}.axisLabel.rotate`, v)}
            min={-90} max={90}
         />
      </PropertyRow>
      <PropertyRow label="Color">
         <ColorInput 
            value={axis.axisLabel?.color ?? '#aaa'}
            onChange={(v) => onChange(`${path}.axisLabel.color`, v)}
         />
      </PropertyRow>
    </>
  );
};