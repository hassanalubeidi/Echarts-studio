
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { updateOptionProperty, removeElement } from '../../../store/slices/chartSlice';
import { setInspectorMode, selectElement } from '../../../store/slices/editorSlice';
import { get } from '../../../utils/objectUtils';
import { SectionHeader } from '../../ui/SectionHeader';
import { AutoPropertyField } from './AutoPropertyField';
import { SeriesEditor } from './SeriesEditor';
import { AxisEditor } from './axes/AxisEditor';
import { GridEditor } from './components/GridEditor';
import { TitleEditor } from './components/TitleEditor';
import { LegendEditor } from './components/LegendEditor';
import { TooltipEditor } from './components/TooltipEditor';
import { DataZoomEditor } from './components/DataZoomEditor';
import { VisualMapEditor } from './components/VisualMapEditor';
import { ToolboxEditor } from './components/ToolboxEditor';
import { MatrixEditor } from './components/MatrixEditor';
import { BrushEditor } from './components/BrushEditor';
import { TimelineEditor } from './components/TimelineEditor';
import { GraphicEditor } from './components/GraphicEditor';
import { DatasetEditor } from './components/DatasetEditor';
import { JsonInput } from '../../ui/controls/JsonInput';
import { Code, Eye, Trash2 } from 'lucide-react';

export const ElementProperties: React.FC = () => {
  const dispatch = useDispatch();
  const { option } = useSelector((state: RootState) => state.chart);
  const { selectedElement, inspectorMode } = useSelector((state: RootState) => state.editor);

  if (!selectedElement) return null;

  const { path, label, type } = selectedElement;
  const elementData = get(option, path);

  const handleOptionChange = (propPath: string, value: any) => {
    dispatch(updateOptionProperty({ path: propPath, value }));
  };

  const handleJsonApply = (value: any) => {
      dispatch(updateOptionProperty({ path, value }));
  };

  const setMode = (mode: 'visual' | 'code') => {
      dispatch(setInspectorMode(mode));
  };

  const handleDelete = () => {
      // confirm() is blocked in sandbox, removing to fix button functionality
      dispatch(removeElement({ path }));
      dispatch(selectElement(null));
  };

  if (elementData === undefined) {
    return <div className="text-gray-500 text-xs p-4">Element not found in configuration.</div>;
  }

  // Header
  const header = (
    <div className="mb-4 pb-2 border-b border-gray-800 flex items-start justify-between">
        <div>
            <div className="text-xs text-accent-500 font-mono mb-1">{path}</div>
            <h2 className="text-sm font-bold text-white max-w-[150px] truncate" title={label}>{label} Properties</h2>
        </div>
        <div className="flex gap-2">
            <div className="flex bg-gray-800 rounded p-0.5">
                <button 
                    className={`p-1.5 rounded ${inspectorMode === 'visual' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => setMode('visual')}
                    title="Visual Editor"
                >
                    <Eye size={14} />
                </button>
                <button 
                    className={`p-1.5 rounded ${inspectorMode === 'code' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => setMode('code')}
                    title="Code Editor"
                >
                    <Code size={14} />
                </button>
            </div>
            
            <button 
                className="p-1.5 rounded bg-gray-800 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                onClick={handleDelete}
                title="Delete Element"
            >
                <Trash2 size={14} />
            </button>
        </div>
    </div>
  );

  if (inspectorMode === 'code') {
      return (
          <div className="flex flex-col h-full">
              {header}
              <div className="flex-1 min-h-0">
                  <JsonInput value={elementData} onApply={handleJsonApply} />
              </div>
          </div>
      );
  }

  // Router for Specific Editors
  const renderVisualEditor = () => {
    if (type === 'series') {
        return <SeriesEditor series={elementData} path={path} onChange={handleOptionChange} />;
    }

    if (type === 'xAxis' || type === 'yAxis') {
        return <AxisEditor axis={elementData} path={path} onChange={handleOptionChange} />;
    }

    if (type === 'grid') {
        return <GridEditor grid={elementData} path={path} onChange={handleOptionChange} />;
    }

    if (type === 'title') {
        return <TitleEditor title={elementData} path={path} onChange={handleOptionChange} />;
    }
    
    if (type === 'legend') {
        return <LegendEditor legend={elementData} path={path} onChange={handleOptionChange} />;
    }

    if (type === 'tooltip') {
        return <TooltipEditor tooltip={elementData} path={path} onChange={handleOptionChange} />;
    }

    if (type === 'dataZoom') {
        return <DataZoomEditor dataZoom={elementData} path={path} onChange={handleOptionChange} />;
    }

    if (type === 'visualMap') {
        return <VisualMapEditor visualMap={elementData} path={path} onChange={handleOptionChange} />;
    }

    if (type === 'toolbox') {
        return <ToolboxEditor toolbox={elementData} path={path} onChange={handleOptionChange} />;
    }
    
    if (type === 'matrix') {
        return <MatrixEditor matrix={elementData} path={path} onChange={handleOptionChange} />;
    }

    if (type === 'brush') {
        return <BrushEditor brush={elementData} path={path} onChange={handleOptionChange} />;
    }

    if (type === 'timeline') {
        return <TimelineEditor timeline={elementData} path={path} onChange={handleOptionChange} />;
    }

    if (type === 'graphic') {
        return <GraphicEditor graphic={elementData} path={path} onChange={handleOptionChange} />;
    }
    
    if (type === 'dataset') {
        return <DatasetEditor dataset={elementData} path={path} onChange={handleOptionChange} />;
    }

    // Fallback / Default Editor for generic types or incomplete implementation
    const primitiveKeys = Object.keys(elementData || {}).filter(k => {
        const val = elementData[k];
        return typeof val !== 'object' || val === null;
    });

    const commonStyles = ['itemStyle', 'lineStyle', 'areaStyle', 'label', 'textStyle'];

    return (
        <>
        {primitiveKeys.length > 0 && (
            <>
            <SectionHeader title="General" />
            {primitiveKeys.map(key => (
                <AutoPropertyField 
                key={key} 
                path={path} 
                propKey={key} 
                value={elementData[key]} 
                onChange={handleOptionChange} 
                />
            ))}
            </>
        )}

        {commonStyles.map(styleKey => {
            if (elementData && elementData[styleKey]) {
            const styleObj = elementData[styleKey];
            const styleKeys = Object.keys(styleObj).filter(k => typeof styleObj[k] !== 'object');
            
            if (styleKeys.length === 0) return null;

            return (
                <div key={styleKey}>
                <SectionHeader title={styleKey.replace(/([A-Z])/g, ' $1')} />
                {styleKeys.map(key => (
                    <AutoPropertyField 
                    key={key} 
                    path={`${path}.${styleKey}`} 
                    propKey={key} 
                    value={styleObj[key]} 
                    onChange={handleOptionChange} 
                    />
                ))}
                </div>
            )
            }
            return null;
        })}
        </>
    );
  };

  return (
    <>
      {header}
      {renderVisualEditor()}
    </>
  );
};
