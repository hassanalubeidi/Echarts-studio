import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { TextInput } from '../../../ui/controls/TextInput';
import { ColorInput } from '../../../ui/controls/ColorInput';
import { NumberInput } from '../../../ui/controls/NumberInput';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';

interface TitleEditorProps {
  title: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const TitleEditor: React.FC<TitleEditorProps> = ({ title, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Content" />
      <PropertyRow label="Show">
        <Switch 
          value={title.show !== false} 
          onChange={(v) => onChange(`${path}.show`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Text">
        <TextInput 
          value={title.text || ''} 
          onChange={(v) => onChange(`${path}.text`, v)} 
        />
      </PropertyRow>
      <PropertyRow label="Subtext">
        <TextInput 
          value={title.subtext || ''} 
          onChange={(v) => onChange(`${path}.subtext`, v)} 
        />
      </PropertyRow>
      <PropertyRow label="Link">
        <TextInput 
          value={title.link || ''} 
          onChange={(v) => onChange(`${path}.link`, v)} 
          placeholder="https://..."
        />
      </PropertyRow>

      <SectionHeader title="Position" />
      <PropertyRow label="Left">
        <TextInput 
          value={title.left ?? 'auto'} 
          onChange={(v) => onChange(`${path}.left`, v)} 
        />
      </PropertyRow>
      <PropertyRow label="Top">
        <TextInput 
          value={title.top ?? 'auto'} 
          onChange={(v) => onChange(`${path}.top`, v)} 
        />
      </PropertyRow>

      <SectionHeader title="Style" />
      <PropertyRow label="Text Color">
        <ColorInput 
          value={title.textStyle?.color ?? '#333'} 
          onChange={(v) => onChange(`${path}.textStyle.color`, v)} 
        />
      </PropertyRow>
      <PropertyRow label="Font Size">
        <NumberInput 
          value={title.textStyle?.fontSize ?? 18} 
          onChange={(v) => onChange(`${path}.textStyle.fontSize`, v)} 
          min={8}
        />
      </PropertyRow>
      <PropertyRow label="Subtext Color">
        <ColorInput 
          value={title.subtextStyle?.color ?? '#aaa'} 
          onChange={(v) => onChange(`${path}.subtextStyle.color`, v)} 
        />
      </PropertyRow>
    </>
  );
};