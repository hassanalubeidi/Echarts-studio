import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { updateOptionProperty } from '../../../store/slices/chartSlice';
import { SectionHeader } from '../../ui/SectionHeader';
import { PropertyRow } from '../../ui/controls/PropertyRow';
import { ColorInput } from '../../ui/controls/ColorInput';
import { Switch } from '../../ui/controls/Switch';
import { NumberInput } from '../../ui/controls/NumberInput';
import { SelectInput } from '../../ui/controls/SelectInput';
import { TextInput } from '../../ui/controls/TextInput';

export const GlobalSettings: React.FC = () => {
  const dispatch = useDispatch();
  const option = useSelector((state: RootState) => state.chart.option);

  const handleChange = (path: string, value: any) => {
    dispatch(updateOptionProperty({ path, value }));
  };

  return (
    <>
      <SectionHeader title="Global Appearance" />
      <PropertyRow label="Background Color">
        <ColorInput 
          value={option.backgroundColor ?? 'transparent'} 
          onChange={(v) => handleChange('backgroundColor', v)} 
        />
      </PropertyRow>

      <PropertyRow label="Color Palette">
         <TextInput 
            value={Array.isArray(option.color) ? JSON.stringify(option.color) : ''}
            onChange={(v) => {
                 try {
                     const parsed = JSON.parse(v);
                     if (Array.isArray(parsed)) handleChange('color', parsed);
                 } catch {
                     // ignore invalid json
                 }
            }}
            placeholder="['#5470c6', '#91cc75', ...]"
         />
      </PropertyRow>

      <PropertyRow label="Dark Mode" title="Uses ECharts dark theme logic (requires reload/reinit usually)">
         <Switch 
            value={option.darkMode === true}
            onChange={(v) => handleChange('darkMode', v)}
         />
      </PropertyRow>

      <SectionHeader title="Animation" />
      <PropertyRow label="Enable Animation">
        <Switch 
          value={option.animation !== false} 
          onChange={(v) => handleChange('animation', v)} 
        />
      </PropertyRow>

      {option.animation !== false && (
          <>
            <PropertyRow label="Duration (ms)">
                <NumberInput 
                value={option.animationDuration ?? 1000} 
                onChange={(v) => handleChange('animationDuration', v)} 
                step={100}
                min={0}
                />
            </PropertyRow>
            
            <PropertyRow label="Easing">
                <SelectInput 
                    value={option.animationEasing || 'cubicOut'}
                    options={['linear', 'cubicOut', 'elasticOut', 'bounceOut', 'quinticInOut']}
                    onChange={(v) => handleChange('animationEasing', v)}
                />
            </PropertyRow>

            <PropertyRow label="Duration Update">
                <NumberInput 
                value={option.animationDurationUpdate ?? 300} 
                onChange={(v) => handleChange('animationDurationUpdate', v)} 
                step={50}
                min={0}
                />
            </PropertyRow>
          </>
      )}

      <SectionHeader title="Text Style" />
      <PropertyRow label="Font Family">
         <TextInput 
            value={option.textStyle?.fontFamily ?? 'sans-serif'}
            onChange={(v) => handleChange('textStyle.fontFamily', v)}
         />
      </PropertyRow>
      <PropertyRow label="Font Size">
         <NumberInput 
            value={option.textStyle?.fontSize ?? 12}
            onChange={(v) => handleChange('textStyle.fontSize', v)}
         />
      </PropertyRow>
    </>
  );
};