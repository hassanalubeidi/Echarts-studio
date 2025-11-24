
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { TextInput } from '../../../ui/controls/TextInput';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Switch } from '../../../ui/controls/Switch';
import { Filter, ArrowUpDown, Plus, Trash2, Code } from 'lucide-react';
import { JsonInput } from '../../../ui/controls/JsonInput';

interface DatasetEditorProps {
  dataset: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

const TransformEditor = ({ transform, index, path, onChange, dimensions }: any) => {
    const config = transform.config || {};
    const type = transform.type || 'filter';

    const handleConfigChange = (key: string, val: any) => {
        onChange(`${path}.transform.${index}.config.${key}`, val);
    };

    const renderFilterConfig = () => {
        const operators = ['=', '!=', '>', '>=', '<', '<=', 'reg'];
        const currentOp = operators.find(op => config[op] !== undefined) || '=';
        const currentVal = config[currentOp];

        return (
            <div className="flex flex-col gap-2 mt-2">
                <div className="flex gap-2">
                    <SelectInput
                        value={config.dimension}
                        options={dimensions}
                        onChange={(v) => handleConfigChange('dimension', v)}
                    />
                    <div className="w-16 shrink-0">
                        <SelectInput
                            value={currentOp}
                            options={operators}
                            onChange={(newOp) => {
                                const newConfig = { ...config };
                                delete newConfig[currentOp];
                                newConfig[newOp] = currentVal;
                                onChange(`${path}.transform.${index}.config`, newConfig);
                            }}
                        />
                    </div>
                </div>
                <TextInput
                    value={currentVal}
                    onChange={(v) => {
                         const num = parseFloat(v);
                         handleConfigChange(currentOp, isNaN(num) ? v : num);
                    }}
                    placeholder="Value"
                />
            </div>
        );
    };

    const renderSortConfig = () => {
        return (
            <div className="flex gap-2 mt-2">
                <SelectInput
                    value={config.dimension}
                    options={dimensions}
                    onChange={(v) => handleConfigChange('dimension', v)}
                />
                <SelectInput
                    value={config.order || 'asc'}
                    options={['asc', 'desc']}
                    onChange={(v) => handleConfigChange('order', v)}
                />
            </div>
        );
    };

    return (
        <div className="bg-gray-800 p-2 rounded mb-2 border border-gray-700 relative group">
             <div className="flex items-center justify-between mb-1">
                 <div className="flex items-center gap-2">
                    {type === 'filter' && <Filter size={12} className="text-accent-400" />}
                    {type === 'sort' && <ArrowUpDown size={12} className="text-accent-400" />}
                    <span className="text-xs font-bold text-gray-300 uppercase">{type}</span>
                 </div>
                 <button 
                    onClick={() => { /* needs parent handler */ }}
                    className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                    <Trash2 size={12} />
                 </button>
             </div>
             
             {type === 'filter' && renderFilterConfig()}
             {type === 'sort' && renderSortConfig()}
        </div>
    );
};

export const DatasetEditor: React.FC<DatasetEditorProps> = ({ dataset, path, onChange }) => {
  const fullOption = useSelector((state: RootState) => state.chart.option);
  
  const allDatasets = useMemo(() => {
     const ds = fullOption.dataset;
     if (!ds) return [];
     if (Array.isArray(ds)) return ds.map((d: any, i: number) => ({ label: d.id || `Dataset ${i}`, value: d.id || i }));
     return [{ label: ds.id || 'Dataset 0', value: ds.id || 0 }];
  }, [fullOption.dataset]);

  const availableDimensions = useMemo(() => {
     if (dataset.dimensions) return dataset.dimensions.map((d: any) => typeof d === 'object' ? d.name : d);
     if (dataset.source && Array.isArray(dataset.source) && dataset.source.length > 0) {
         const first = dataset.source[0];
         if (Array.isArray(first)) {
             if (dataset.sourceHeader !== false) return first;
             return first.map((_: any, i: number) => `Column ${i}`);
         }
     }
     return ['auto', ...Array.from({length: 10}, (_, i) => `Column ${i}`)];
  }, [dataset]);

  const handleAddTransform = (type: string) => {
      const current = dataset.transform ? (Array.isArray(dataset.transform) ? dataset.transform : [dataset.transform]) : [];
      const newTransform = type === 'filter' 
        ? { type: 'filter', config: { dimension: availableDimensions[0], '=': 0 } }
        : { type: 'sort', config: { dimension: availableDimensions[0], order: 'asc' } };
      
      onChange(`${path}.transform`, [...current, newTransform]);
  };

  const handleRemoveTransform = (idx: number) => {
      const current = Array.isArray(dataset.transform) ? [...dataset.transform] : [dataset.transform];
      current.splice(idx, 1);
      onChange(`${path}.transform`, current);
  };

  return (
    <>
      <SectionHeader title="Dataset Identity" />
      <PropertyRow label="ID">
        <TextInput 
          value={dataset.id || ''} 
          onChange={(v) => onChange(`${path}.id`, v)} 
          placeholder="unique_id"
        />
      </PropertyRow>

      {!dataset.transform && !dataset.fromDatasetId && (
        <>
            <SectionHeader title="Source Config" />
            <div className="mb-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-2 uppercase">
                   <div className="flex items-center gap-2"><Code size={12} /> Raw Data Source</div>
                </div>
                <div className="h-[200px] border border-gray-700 rounded overflow-hidden">
                    <JsonInput 
                        value={dataset.source} 
                        onApply={(val) => onChange(`${path}.source`, val)}
                    />
                </div>
                <div className="text-[10px] text-gray-600 italic mt-1">Paste JSON array of arrays or objects.</div>
            </div>

            <PropertyRow label="Source Header">
                <SelectInput
                    value={dataset.sourceHeader === undefined ? 'auto' : String(dataset.sourceHeader)}
                    options={['auto', 'true', 'false']}
                    onChange={(v) => {
                        const val = v === 'auto' ? 'auto' : v === 'true';
                        onChange(`${path}.sourceHeader`, val);
                    }}
                />
            </PropertyRow>
            
            <div className="mb-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-2 uppercase">
                    <span>Dimensions Definition</span>
                    <button 
                        onClick={() => {
                            const dims = dataset.dimensions ? [...dataset.dimensions] : [];
                            dims.push({ name: `Dim ${dims.length}`, type: 'float' });
                            onChange(`${path}.dimensions`, dims);
                        }}
                        className="text-accent-400 hover:text-white flex items-center gap-1"
                    >
                        <Plus size={10} /> Add
                    </button>
                </div>
                {dataset.dimensions && dataset.dimensions.map((dim: any, i: number) => {
                    const name = typeof dim === 'object' ? dim.name : dim;
                    const type = typeof dim === 'object' ? dim.type : 'auto';
                    return (
                        <div key={i} className="flex gap-2 mb-1">
                            <TextInput 
                                value={name} 
                                onChange={(v) => onChange(`${path}.dimensions.${i}.name`, v)} 
                            />
                             <SelectInput
                                value={type || 'auto'}
                                options={['auto', 'number', 'float', 'int', 'ordinal', 'time']}
                                onChange={(v) => onChange(`${path}.dimensions.${i}.type`, v)}
                            />
                            <button 
                                onClick={() => {
                                    const dims = [...dataset.dimensions];
                                    dims.splice(i, 1);
                                    onChange(`${path}.dimensions`, dims);
                                }}
                                className="text-gray-600 hover:text-red-400"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </>
      )}

      <SectionHeader title="Transformation" />
      <PropertyRow label="From Dataset">
         <SelectInput
            value={dataset.fromDatasetId || dataset.fromDatasetIndex || ''}
            options={[{label: 'None (Root)', value: ''}, ...allDatasets]}
            onChange={(v) => {
                if (v === '') {
                     onChange(`${path}.fromDatasetId`, undefined);
                     onChange(`${path}.fromDatasetIndex`, undefined);
                } else if (!isNaN(parseInt(v)) && allDatasets.find(d => d.value === parseInt(v))) {
                     onChange(`${path}.fromDatasetIndex`, parseInt(v));
                     onChange(`${path}.fromDatasetId`, undefined);
                } else {
                     onChange(`${path}.fromDatasetId`, v);
                     onChange(`${path}.fromDatasetIndex`, undefined);
                }
            }}
         />
      </PropertyRow>

      <div className="mt-2">
         <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-2 uppercase">
             <span>Transform Pipeline</span>
             <div className="flex gap-1">
                 <button onClick={() => handleAddTransform('filter')} className="bg-gray-700 hover:bg-gray-600 px-2 py-0.5 rounded text-white flex items-center gap-1">
                     <Filter size={10} /> Filter
                 </button>
                 <button onClick={() => handleAddTransform('sort')} className="bg-gray-700 hover:bg-gray-600 px-2 py-0.5 rounded text-white flex items-center gap-1">
                     <ArrowUpDown size={10} /> Sort
                 </button>
             </div>
         </div>
         
         {dataset.transform && (Array.isArray(dataset.transform) ? dataset.transform : [dataset.transform]).map((t: any, i: number) => (
             <div key={i} className="relative">
                 <TransformEditor 
                    transform={t} 
                    index={i} 
                    path={path} 
                    onChange={onChange} 
                    dimensions={availableDimensions} 
                 />
                 <button 
                    onClick={() => handleRemoveTransform(i)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 hover:opacity-100"
                 >
                    <Trash2 size={12} />
                 </button>
             </div>
         ))}
      </div>
    </>
  );
};
