import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';
import { TextInput } from '../../../ui/controls/TextInput';
import { NumberInput } from '../../../ui/controls/NumberInput';

interface ToolboxEditorProps {
  toolbox: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const ToolboxEditor: React.FC<ToolboxEditorProps> = ({ toolbox, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Toolbox Layout" />
      <PropertyRow label="Show">
        <Switch 
          value={toolbox.show !== false} 
          onChange={(v) => onChange(`${path}.show`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Orientation">
        <SelectInput 
          value={toolbox.orient || 'horizontal'} 
          options={['horizontal', 'vertical']} 
          onChange={(v) => onChange(`${path}.orient`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Item Size">
        <NumberInput 
          value={toolbox.itemSize ?? 15} 
          onChange={(v) => onChange(`${path}.itemSize`, v)} 
          min={0}
        />
      </PropertyRow>

      <PropertyRow label="Item Gap">
        <NumberInput 
          value={toolbox.itemGap ?? 10} 
          onChange={(v) => onChange(`${path}.itemGap`, v)} 
          min={0}
        />
      </PropertyRow>

      <SectionHeader title="Position" />
      <PropertyRow label="Left">
        <TextInput 
          value={toolbox.left ?? 'auto'} 
          onChange={(v) => onChange(`${path}.left`, v)} 
        />
      </PropertyRow>
      <PropertyRow label="Top">
        <TextInput 
          value={toolbox.top ?? 'auto'} 
          onChange={(v) => onChange(`${path}.top`, v)} 
        />
      </PropertyRow>
      <PropertyRow label="Right">
        <TextInput 
          value={toolbox.right ?? 'auto'} 
          onChange={(v) => onChange(`${path}.right`, v)} 
        />
      </PropertyRow>

      <SectionHeader title="Features" />
      <PropertyRow label="Save Image">
         <Switch 
            value={!!toolbox.feature?.saveAsImage}
            onChange={(v) => onChange(`${path}.feature.saveAsImage`, v ? {} : null)}
         />
      </PropertyRow>
      <PropertyRow label="Restore">
         <Switch 
            value={!!toolbox.feature?.restore}
            onChange={(v) => onChange(`${path}.feature.restore`, v ? {} : null)}
         />
      </PropertyRow>
      <PropertyRow label="Data View">
         <Switch 
            value={!!toolbox.feature?.dataView}
            onChange={(v) => onChange(`${path}.feature.dataView`, v ? {} : null)}
         />
      </PropertyRow>
      <PropertyRow label="Data Zoom">
         <Switch 
            value={!!toolbox.feature?.dataZoom}
            onChange={(v) => onChange(`${path}.feature.dataZoom`, v ? {} : null)}
         />
      </PropertyRow>
      <PropertyRow label="Magic Type">
         <Switch 
            value={!!toolbox.feature?.magicType}
            onChange={(v) => onChange(`${path}.feature.magicType`, v ? { type: ['line', 'bar'] } : null)}
         />
      </PropertyRow>
    </>
  );
};