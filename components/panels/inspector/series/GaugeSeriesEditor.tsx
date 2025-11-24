import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { NumberInput } from '../../../ui/controls/NumberInput';
import { ColorInput } from '../../../ui/controls/ColorInput';
import { Switch } from '../../../ui/controls/Switch';

interface GaugeSeriesEditorProps {
  series: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const GaugeSeriesEditor: React.FC<GaugeSeriesEditorProps> = ({ series, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Gauge Scale" />
      
      <PropertyRow label="Min Value">
        <NumberInput 
          value={series.min ?? 0} 
          onChange={(v) => onChange(`${path}.min`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Max Value">
        <NumberInput 
          value={series.max ?? 100} 
          onChange={(v) => onChange(`${path}.max`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Start Angle">
        <NumberInput 
          value={series.startAngle ?? 225} 
          onChange={(v) => onChange(`${path}.startAngle`, v)} 
          step={5}
        />
      </PropertyRow>

      <PropertyRow label="End Angle">
        <NumberInput 
          value={series.endAngle ?? -45} 
          onChange={(v) => onChange(`${path}.endAngle`, v)} 
          step={5}
        />
      </PropertyRow>

      <SectionHeader title="Pointer" />
      <PropertyRow label="Show Pointer">
        <Switch 
          value={series.pointer?.show !== false} 
          onChange={(v) => onChange(`${path}.pointer.show`, v)} 
        />
      </PropertyRow>
      
      {series.pointer?.show !== false && (
        <PropertyRow label="Color">
             <ColorInput 
                value={series.itemStyle?.color ?? 'auto'}
                onChange={(v) => onChange(`${path}.itemStyle.color`, v)}
             />
        </PropertyRow>
      )}

      <SectionHeader title="Axis Line" />
      <PropertyRow label="Line Width">
        <NumberInput 
           value={series.axisLine?.lineStyle?.width ?? 30}
           onChange={(v) => onChange(`${path}.axisLine.lineStyle.width`, v)}
           min={0}
        />
      </PropertyRow>

      <SectionHeader title="Progress" />
      <PropertyRow label="Show Progress">
        <Switch 
          value={!!series.progress?.show} 
          onChange={(v) => onChange(`${path}.progress.show`, v)} 
        />
      </PropertyRow>
    </>
  );
};