import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { updateConfig, regenerateData } from '../../../store/slices/chartSlice';
import { IconRefresh } from '../../ui/Icons';
import { SectionHeader } from '../../ui/SectionHeader';
import { PropertyRow } from '../../ui/controls/PropertyRow';
import { NumberInput } from '../../ui/controls/NumberInput';
import { ColorInput } from '../../ui/controls/ColorInput';

export const SimulationSettings: React.FC = () => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.chart.config);

  const handleConfigChange = (path: string, value: any) => {
    dispatch(updateConfig({ path, value }));
  };

  return (
    <>
      <div className="mb-6">
        <button 
          onClick={() => dispatch(regenerateData())}
          className="w-full bg-accent-600 hover:bg-accent-500 text-white text-xs font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
        >
          <IconRefresh /> Regenerate Simulation
        </button>
      </div>

      <SectionHeader title="Simulation Parameters" />
      <PropertyRow label="Initial Price">
        <NumberInput 
          value={config.simulation.initialPrice} 
          onChange={(v) => handleConfigChange('simulation.initialPrice', v)} 
        />
      </PropertyRow>
      <PropertyRow label="Volatility">
        <NumberInput 
          value={config.simulation.volatility} 
          onChange={(v) => handleConfigChange('simulation.volatility', v)} 
          step={0.01} 
        />
      </PropertyRow>

      <SectionHeader title="Theme Colors" />
      {Object.entries(config.colors).map(([key, val]) => (
        <PropertyRow key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
          <ColorInput 
            value={val as string} 
            onChange={(v) => handleConfigChange(`colors.${key}`, v)} 
          />
        </PropertyRow>
      ))}

      <SectionHeader title="Layout Config" />
      <PropertyRow label="Matrix Margin">
        <NumberInput 
          value={config.layout.matrixMargin} 
          onChange={(v) => handleConfigChange('layout.matrixMargin', v)} 
        />
      </PropertyRow>
    </>
  );
};