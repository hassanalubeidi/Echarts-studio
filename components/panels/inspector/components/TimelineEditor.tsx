import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';
import { NumberInput } from '../../../ui/controls/NumberInput';
import { ColorInput } from '../../../ui/controls/ColorInput';

interface TimelineEditorProps {
  timeline: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({ timeline, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Timeline Config" />
      <PropertyRow label="Show">
        <Switch 
          value={timeline.show !== false} 
          onChange={(v) => onChange(`${path}.show`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Axis Type">
         <SelectInput 
            value={timeline.axisType || 'time'}
            options={['time', 'value', 'category']}
            onChange={(v) => onChange(`${path}.axisType`, v)}
         />
      </PropertyRow>

      <PropertyRow label="Orientation">
        <SelectInput 
          value={timeline.orient || 'horizontal'} 
          options={['horizontal', 'vertical']} 
          onChange={(v) => onChange(`${path}.orient`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Loop">
        <Switch 
          value={timeline.loop !== false} 
          onChange={(v) => onChange(`${path}.loop`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Auto Play">
        <Switch 
          value={!!timeline.autoPlay} 
          onChange={(v) => onChange(`${path}.autoPlay`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Play Interval (ms)">
         <NumberInput 
            value={timeline.playInterval ?? 2000}
            onChange={(v) => onChange(`${path}.playInterval`, v)}
            step={100}
            min={0}
         />
      </PropertyRow>

      <SectionHeader title="Style" />
      <PropertyRow label="Symbol">
         <SelectInput 
            value={timeline.symbol || 'emptyCircle'}
            options={['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'emptyCircle']}
            onChange={(v) => onChange(`${path}.symbol`, v)}
         />
      </PropertyRow>
      
      <PropertyRow label="Line Color">
         <ColorInput 
            value={timeline.lineStyle?.color ?? '#DAE1F5'}
            onChange={(v) => onChange(`${path}.lineStyle.color`, v)}
         />
      </PropertyRow>

      <PropertyRow label="Checkpoint Color">
         <ColorInput 
            value={timeline.checkpointStyle?.color ?? '#c23531'}
            onChange={(v) => onChange(`${path}.checkpointStyle.color`, v)}
         />
      </PropertyRow>
    </>
  );
};