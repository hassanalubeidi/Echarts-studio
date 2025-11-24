
import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';
import { NumberInput } from '../../../ui/controls/NumberInput';
import { TextInput } from '../../../ui/controls/TextInput';

interface TreemapSeriesEditorProps {
  series: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const TreemapSeriesEditor: React.FC<TreemapSeriesEditorProps> = ({ series, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Treemap Config" />
      
      <PropertyRow label="Roam">
         <Switch 
            value={!!series.roam}
            onChange={(v) => onChange(`${path}.roam`, v)}
         />
      </PropertyRow>
      
      <PropertyRow label="Node Click">
        <SelectInput 
          value={series.nodeClick || 'zoomToNode'} 
          options={['zoomToNode', 'link', false as any]} 
          onChange={(v) => onChange(`${path}.nodeClick`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Breadcrumb">
         <Switch 
            value={series.breadcrumb?.show !== false}
            onChange={(v) => onChange(`${path}.breadcrumb.show`, v)}
         />
      </PropertyRow>

      <SectionHeader title="Size & Gap" />
      <PropertyRow label="Width">
        <TextInput value={series.width ?? '80%'} onChange={(v) => onChange(`${path}.width`, v)} />
      </PropertyRow>
      <PropertyRow label="Height">
        <TextInput value={series.height ?? '80%'} onChange={(v) => onChange(`${path}.height`, v)} />
      </PropertyRow>
      
      <PropertyRow label="Square Ratio">
         <NumberInput 
            value={series.squareRatio ?? 0.5 * (1 + Math.sqrt(5))} 
            onChange={(v) => onChange(`${path}.squareRatio`, v)}
            step={0.1}
         />
      </PropertyRow>

      <PropertyRow label="Leaf Depth">
         <NumberInput 
            value={series.leafDepth ?? null} 
            onChange={(v) => onChange(`${path}.leafDepth`, v)}
         />
      </PropertyRow>
    </>
  );
};
