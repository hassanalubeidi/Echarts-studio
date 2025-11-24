import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';
import { ColorInput } from '../../../ui/controls/ColorInput';

interface TooltipEditorProps {
  tooltip: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const TooltipEditor: React.FC<TooltipEditorProps> = ({ tooltip, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Trigger" />
      <PropertyRow label="Show">
        <Switch 
          value={tooltip.show !== false} 
          onChange={(v) => onChange(`${path}.show`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Trigger Mode">
        <SelectInput 
          value={tooltip.trigger || 'item'} 
          options={['item', 'axis', 'none']} 
          onChange={(v) => onChange(`${path}.trigger`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Trigger On">
        <SelectInput 
          value={tooltip.triggerOn || 'mousemove|click'} 
          options={['mousemove', 'click', 'mousemove|click', 'none']} 
          onChange={(v) => onChange(`${path}.triggerOn`, v)} 
        />
      </PropertyRow>

      <SectionHeader title="Appearance" />
      <PropertyRow label="Background">
        <ColorInput 
          value={tooltip.backgroundColor ?? 'rgba(50,50,50,0.7)'} 
          onChange={(v) => onChange(`${path}.backgroundColor`, v)} 
        />
      </PropertyRow>
      
      <PropertyRow label="Border Color">
        <ColorInput 
          value={tooltip.borderColor ?? '#333'} 
          onChange={(v) => onChange(`${path}.borderColor`, v)} 
        />
      </PropertyRow>

      <SectionHeader title="Axis Pointer" />
      <PropertyRow label="Type">
         <SelectInput 
            value={tooltip.axisPointer?.type ?? 'line'}
            options={['line', 'cross', 'shadow', 'none']}
            onChange={(v) => onChange(`${path}.axisPointer.type`, v)}
         />
      </PropertyRow>
    </>
  );
};