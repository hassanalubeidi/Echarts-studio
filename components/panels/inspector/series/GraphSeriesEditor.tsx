
import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';
import { NumberInput } from '../../../ui/controls/NumberInput';
import { TextInput } from '../../../ui/controls/TextInput';

interface GraphSeriesEditorProps {
  series: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const GraphSeriesEditor: React.FC<GraphSeriesEditorProps> = ({ series, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Graph Layout" />
      <PropertyRow label="Layout">
        <SelectInput 
          value={series.layout || 'none'} 
          options={['none', 'circular', 'force']} 
          onChange={(v) => onChange(`${path}.layout`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Roam">
         <Switch 
            value={!!series.roam}
            onChange={(v) => onChange(`${path}.roam`, v)}
         />
      </PropertyRow>
      
      <PropertyRow label="Draggable">
         <Switch 
            value={series.draggable !== false}
            onChange={(v) => onChange(`${path}.draggable`, v)}
         />
      </PropertyRow>

      {series.layout === 'force' && (
          <>
            <SectionHeader title="Force Simulation" />
            <PropertyRow label="Repulsion">
                <NumberInput 
                    value={series.force?.repulsion ?? 50}
                    onChange={(v) => onChange(`${path}.force.repulsion`, v)}
                    min={0}
                    step={10}
                />
            </PropertyRow>
            <PropertyRow label="Gravity">
                <NumberInput 
                    value={series.force?.gravity ?? 0.1}
                    onChange={(v) => onChange(`${path}.force.gravity`, v)}
                    step={0.01}
                />
            </PropertyRow>
            <PropertyRow label="Edge Length">
                <NumberInput 
                    value={Array.isArray(series.force?.edgeLength) ? series.force.edgeLength[0] : (series.force?.edgeLength ?? 30)}
                    onChange={(v) => onChange(`${path}.force.edgeLength`, v)}
                    min={0}
                />
            </PropertyRow>
          </>
      )}

      {series.layout === 'circular' && (
          <PropertyRow label="Rotate Label">
              <Switch 
                value={!!series.circular?.rotateLabel}
                onChange={(v) => onChange(`${path}.circular.rotateLabel`, v)}
              />
          </PropertyRow>
      )}

      <SectionHeader title="Nodes & Edges" />
      <PropertyRow label="Symbol">
         <SelectInput 
            value={series.symbol || 'circle'}
            options={['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow']}
            onChange={(v) => onChange(`${path}.symbol`, v)}
         />
      </PropertyRow>
      <PropertyRow label="Symbol Size">
         <NumberInput 
            value={typeof series.symbolSize === 'number' ? series.symbolSize : 10}
            onChange={(v) => onChange(`${path}.symbolSize`, v)}
            min={0}
         />
      </PropertyRow>
      
      <PropertyRow label="Edge Symbol">
         <TextInput 
            value={JSON.stringify(series.edgeSymbol || ['none', 'none'])}
            onChange={(v) => {
                try {
                    onChange(`${path}.edgeSymbol`, JSON.parse(v));
                } catch {}
            }}
            placeholder="['none', 'arrow']"
         />
      </PropertyRow>
    </>
  );
};
