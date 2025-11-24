import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { TextInput } from '../../../ui/controls/TextInput';
import { Switch } from '../../../ui/controls/Switch';
import { ColorInput } from '../../../ui/controls/ColorInput';
import { NumberInput } from '../../../ui/controls/NumberInput';
import { SelectInput } from '../../../ui/controls/SelectInput';

interface GridEditorProps {
  grid: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const GridEditor: React.FC<GridEditorProps> = ({ grid, path, onChange }) => {
  return (
    <>
      <SectionHeader title="Coordinate System" />
      <PropertyRow label="System">
         <SelectInput 
            value={grid.coordinateSystem || 'cartesian2d'}
            options={['cartesian2d', 'matrix']}
            onChange={(v) => {
                // If switching to cartesian2d (default), we might want to clear coord
                onChange(`${path}.coordinateSystem`, v === 'cartesian2d' ? undefined : v);
            }}
         />
      </PropertyRow>

      {grid.coordinateSystem === 'matrix' && (
          <>
             <PropertyRow label="Matrix Coord" title="[Row, Col]">
                 <TextInput 
                    value={JSON.stringify(grid.coord ?? [0, 0])}
                    onChange={(v) => {
                        try {
                            const parsed = JSON.parse(v);
                            if (Array.isArray(parsed) && parsed.length === 2) {
                                onChange(`${path}.coord`, parsed);
                            }
                        } catch {}
                    }}
                    placeholder="[0, 0]"
                 />
             </PropertyRow>
             <div className="text-[10px] text-gray-500 mb-2 px-1">
                 Positions the grid into a specific cell of the matrix.
             </div>
          </>
      )}

      <SectionHeader title="Position" />
      
      <PropertyRow label="Left">
        <TextInput 
          value={grid.left ?? '10%'} 
          onChange={(v) => onChange(`${path}.left`, v)} 
        />
      </PropertyRow>
      <PropertyRow label="Top">
        <TextInput 
          value={grid.top ?? 60} 
          onChange={(v) => onChange(`${path}.top`, v)} 
        />
      </PropertyRow>
      <PropertyRow label="Right">
        <TextInput 
          value={grid.right ?? '10%'} 
          onChange={(v) => onChange(`${path}.right`, v)} 
        />
      </PropertyRow>
      <PropertyRow label="Bottom">
        <TextInput 
          value={grid.bottom ?? 60} 
          onChange={(v) => onChange(`${path}.bottom`, v)} 
        />
      </PropertyRow>

      <PropertyRow label="Contain Label" title="Automatically calculate space for labels">
        <Switch 
          value={!!grid.containLabel} 
          onChange={(v) => onChange(`${path}.containLabel`, v)} 
        />
      </PropertyRow>

      <SectionHeader title="Appearance" />
      <PropertyRow label="Show Background">
        <Switch 
          value={!!grid.show} 
          onChange={(v) => onChange(`${path}.show`, v)} 
        />
      </PropertyRow>

      {grid.show && (
        <>
            <PropertyRow label="Background">
                <ColorInput 
                    value={grid.backgroundColor ?? 'transparent'} 
                    onChange={(v) => onChange(`${path}.backgroundColor`, v)} 
                />
            </PropertyRow>
            <PropertyRow label="Border Color">
                <ColorInput 
                    value={grid.borderColor ?? '#ccc'} 
                    onChange={(v) => onChange(`${path}.borderColor`, v)} 
                />
            </PropertyRow>
             <PropertyRow label="Border Width">
                <NumberInput 
                    value={grid.borderWidth ?? 1} 
                    onChange={(v) => onChange(`${path}.borderWidth`, v)} 
                    min={0}
                />
            </PropertyRow>
        </>
      )}
    </>
  );
};