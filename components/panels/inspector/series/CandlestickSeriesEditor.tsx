import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { TextInput } from '../../../ui/controls/TextInput';
import { ColorInput } from '../../../ui/controls/ColorInput';

interface CandlestickSeriesEditorProps {
  series: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const CandlestickSeriesEditor: React.FC<CandlestickSeriesEditorProps> = ({ series, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Candlestick" />
      
      <PropertyRow label="Bar Width">
        <TextInput 
          value={series.barWidth || 'auto'} 
          onChange={(v) => onChange(`${path}.barWidth`, v)} 
          placeholder="auto"
        />
      </PropertyRow>

      <SectionHeader title="Bullish (Up)" />
      <PropertyRow label="Fill Color">
        <ColorInput 
          value={series.itemStyle?.color ?? '#eb5454'} 
          onChange={(v) => onChange(`${path}.itemStyle.color`, v)} 
        />
      </PropertyRow>
      <PropertyRow label="Border Color">
        <ColorInput 
          value={series.itemStyle?.borderColor ?? '#eb5454'} 
          onChange={(v) => onChange(`${path}.itemStyle.borderColor`, v)} 
        />
      </PropertyRow>

      <SectionHeader title="Bearish (Down)" />
      <PropertyRow label="Fill Color">
        <ColorInput 
          value={series.itemStyle?.color0 ?? '#47b262'} 
          onChange={(v) => onChange(`${path}.itemStyle.color0`, v)} 
        />
      </PropertyRow>
      <PropertyRow label="Border Color">
        <ColorInput 
          value={series.itemStyle?.borderColor0 ?? '#47b262'} 
          onChange={(v) => onChange(`${path}.itemStyle.borderColor0`, v)} 
        />
      </PropertyRow>
    </>
  );
};