import React from 'react';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';
import { TextInput } from '../../../ui/controls/TextInput';
import { NumberInput } from '../../../ui/controls/NumberInput';
import { ColorInput } from '../../../ui/controls/ColorInput';

interface GraphicEditorProps {
  graphic: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const GraphicEditor: React.FC<GraphicEditorProps> = ({ graphic, path, onChange }) => {
  const shapeType = graphic.type || 'group';

  const renderShapeProperties = () => {
      switch(shapeType) {
          case 'text':
              return (
                  <>
                    <SectionHeader title="Text Content" />
                    <PropertyRow label="Content">
                        <TextInput 
                            value={graphic.style?.text ?? ''}
                            onChange={(v) => onChange(`${path}.style.text`, v)}
                        />
                    </PropertyRow>
                    <PropertyRow label="Font">
                        <TextInput 
                            value={graphic.style?.font ?? ''}
                            onChange={(v) => onChange(`${path}.style.font`, v)}
                            placeholder="14px sans-serif"
                        />
                    </PropertyRow>
                    <PropertyRow label="Fill">
                        <ColorInput 
                            value={graphic.style?.fill ?? '#fff'}
                            onChange={(v) => onChange(`${path}.style.fill`, v)}
                        />
                    </PropertyRow>
                  </>
              );
          case 'rect':
              return (
                  <>
                     <SectionHeader title="Dimensions" />
                     <PropertyRow label="X">
                        <NumberInput 
                            value={graphic.shape?.x ?? 0}
                            onChange={(v) => onChange(`${path}.shape.x`, v)}
                        />
                     </PropertyRow>
                     <PropertyRow label="Y">
                        <NumberInput 
                            value={graphic.shape?.y ?? 0}
                            onChange={(v) => onChange(`${path}.shape.y`, v)}
                        />
                     </PropertyRow>
                     <PropertyRow label="Width">
                        <NumberInput 
                            value={graphic.shape?.width ?? 0}
                            onChange={(v) => onChange(`${path}.shape.width`, v)}
                        />
                     </PropertyRow>
                     <PropertyRow label="Height">
                        <NumberInput 
                            value={graphic.shape?.height ?? 0}
                            onChange={(v) => onChange(`${path}.shape.height`, v)}
                        />
                     </PropertyRow>
                  </>
              );
            case 'circle':
              return (
                  <>
                     <SectionHeader title="Dimensions" />
                     <PropertyRow label="CX">
                        <NumberInput 
                            value={graphic.shape?.cx ?? 0}
                            onChange={(v) => onChange(`${path}.shape.cx`, v)}
                        />
                     </PropertyRow>
                     <PropertyRow label="CY">
                        <NumberInput 
                            value={graphic.shape?.cy ?? 0}
                            onChange={(v) => onChange(`${path}.shape.cy`, v)}
                        />
                     </PropertyRow>
                     <PropertyRow label="Radius">
                        <NumberInput 
                            value={graphic.shape?.r ?? 0}
                            onChange={(v) => onChange(`${path}.shape.r`, v)}
                        />
                     </PropertyRow>
                  </>
              );
            case 'line':
                return (
                    <>
                       <SectionHeader title="Coordinates" />
                       <PropertyRow label="X1">
                          <NumberInput value={graphic.shape?.x1 ?? 0} onChange={(v) => onChange(`${path}.shape.x1`, v)} />
                       </PropertyRow>
                       <PropertyRow label="Y1">
                          <NumberInput value={graphic.shape?.y1 ?? 0} onChange={(v) => onChange(`${path}.shape.y1`, v)} />
                       </PropertyRow>
                       <PropertyRow label="X2">
                          <NumberInput value={graphic.shape?.x2 ?? 0} onChange={(v) => onChange(`${path}.shape.x2`, v)} />
                       </PropertyRow>
                       <PropertyRow label="Y2">
                          <NumberInput value={graphic.shape?.y2 ?? 0} onChange={(v) => onChange(`${path}.shape.y2`, v)} />
                       </PropertyRow>
                       <SectionHeader title="Line Style" />
                       <PropertyRow label="Stroke">
                            <ColorInput value={graphic.style?.stroke ?? '#000'} onChange={(v) => onChange(`${path}.style.stroke`, v)} />
                       </PropertyRow>
                       <PropertyRow label="Width">
                            <NumberInput value={graphic.style?.lineWidth ?? 1} onChange={(v) => onChange(`${path}.style.lineWidth`, v)} min={0} />
                       </PropertyRow>
                    </>
                );
          default:
              return null;
      }
  };

  return (
    <>
      <SectionHeader title="Graphic Element" />
      <PropertyRow label="Type">
        <SelectInput 
          value={graphic.type || 'group'} 
          options={['group', 'image', 'text', 'rect', 'circle', 'ring', 'sector', 'arc', 'polygon', 'polyline', 'line', 'bezierCurve']} 
          onChange={(v) => onChange(`${path}.type`, v)} 
        />
      </PropertyRow>

      {renderShapeProperties()}

      <SectionHeader title="Common" />
      <PropertyRow label="Left">
        <TextInput value={graphic.left ?? 'auto'} onChange={(v) => onChange(`${path}.left`, v)} />
      </PropertyRow>
      <PropertyRow label="Top">
        <TextInput value={graphic.top ?? 'auto'} onChange={(v) => onChange(`${path}.top`, v)} />
      </PropertyRow>
      <PropertyRow label="Z-Index">
        <NumberInput value={graphic.z ?? 0} onChange={(v) => onChange(`${path}.z`, v)} />
      </PropertyRow>
      
      <PropertyRow label="Draggable">
        <Switch value={!!graphic.draggable} onChange={(v) => onChange(`${path}.draggable`, v)} />
      </PropertyRow>
    </>
  );
};