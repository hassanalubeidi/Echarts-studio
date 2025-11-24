
import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store';
import { addElement, updateOptionProperties } from '../../../../store/slices/chartSlice';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { SelectInput } from '../../../ui/controls/SelectInput';
import { Database, Plus, Table, AlertTriangle } from 'lucide-react';

interface DataBindingEditorProps {
  series: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

const ENCODE_CHANNELS: Record<string, string[]> = {
    line: ['x', 'y', 'itemName', 'tooltip', 'seriesName'],
    bar: ['x', 'y', 'itemName', 'tooltip', 'seriesName'],
    pie: ['value', 'itemName', 'tooltip'],
    scatter: ['x', 'y', 'label', 'tooltip', 'itemName'],
    effectScatter: ['x', 'y', 'label', 'tooltip'],
    candlestick: ['x', 'y', 'tooltip'],
    heatmap: ['x', 'y', 'value', 'tooltip', 'label'],
    graph: ['name', 'value', 'label', 'tooltip'],
    tree: ['name', 'value', 'tooltip'],
    treemap: ['name', 'value', 'tooltip'],
    sunburst: ['name', 'value', 'tooltip'],
    funnel: ['value', 'itemName', 'seriesName'],
    gauge: ['value', 'itemName'],
    radar: ['value', 'itemName'],
    boxplot: ['x', 'y', 'tooltip', 'itemName']
};

export const DataBindingEditor: React.FC<DataBindingEditorProps> = ({ series, path, onChange }) => {
  const dispatch = useDispatch();
  const option = useSelector((state: RootState) => state.chart.option);
  
  // Normalize datasets
  const datasets = useMemo(() => {
      const ds = option.dataset;
      if (!ds) return [];
      if (Array.isArray(ds)) return ds.map((d: any, i: number) => ({ ...d, index: i }));
      return [{ ...ds, index: 0 }];
  }, [option.dataset]);
  
  const currentDatasetIndex = series.datasetIndex;
  // Check if we have conflicting state (both data and datasetIndex)
  const hasConflict = series.data && series.data.length > 0 && currentDatasetIndex !== undefined;

  // Infer dimensions
  const dimensions = useMemo(() => {
      if (currentDatasetIndex === undefined) return [];
      const dataset = datasets.find((d: any) => d.index === currentDatasetIndex);
      if (!dataset) return [];

      if (dataset.dimensions) return dataset.dimensions;
      
      const source = dataset.source;
      if (!source) return [];

      if (Array.isArray(source) && source.length > 0) {
          const first = source[0];
          if (Array.isArray(first)) return first; // Header row
          if (typeof first === 'object') return Object.keys(first);
      }
      return [];
  }, [datasets, currentDatasetIndex]);

  const channels = ENCODE_CHANNELS[series.type] || ['x', 'y', 'value', 'itemName'];
  const currentEncode = series.encode || {};

  // Construct options for mapping
  const dimOptions = ['auto', ...dimensions, ...[0,1,2,3,4,5,6,7,8,9,10].map(i => `Index ${i}`)];

  // Helper to convert stored encode value to UI string
  const getUiValue = (val: any) => {
      if (val === undefined || val === null) return 'auto';
      if (typeof val === 'number') return `Index ${val}`;
      if (Array.isArray(val)) return JSON.stringify(val);
      return val;
  };

  // Helper to convert UI string back to encode value
  const parseUiValue = (val: string) => {
      if (val === 'auto') return undefined;
      if (val.startsWith('Index ')) {
          const idx = parseInt(val.split(' ')[1]);
          return isNaN(idx) ? undefined : idx;
      }
      if (val.startsWith('[') && val.endsWith(']')) {
          try { return JSON.parse(val); } catch { return val; }
      }
      return val;
  };

  const handleCreateDataset = () => {
      dispatch(addElement({ type: 'dataset' }));
      // Optimistically select the next index
      const nextIndex = datasets.length; 
      setTimeout(() => {
         onChange(`${path}.datasetIndex`, nextIndex);
      }, 50);
  };

  const handleSourceChange = (v: string) => {
      const updates = [];
      if (v === 'internal') {
          updates.push({ path: `${path}.datasetIndex`, value: undefined });
          // If no internal data exists, restore default dummy data so user sees something
          if (!series.data || series.data.length === 0) {
              updates.push({ path: `${path}.data`, value: [10, 20, 30, 40, 50, 60] });
          }
      } else {
          updates.push({ path: `${path}.datasetIndex`, value: parseInt(v) });
          // CRITICAL: ECharts prioritizes series.data over dataset. 
          // We must clear series.data to allow dataset binding to work.
          updates.push({ path: `${path}.data`, value: undefined });
      }
      dispatch(updateOptionProperties({ updates }));
  };

  const sourceOptions = [
      { label: 'Internal Data', value: 'internal' },
      ...datasets.map((d: any) => ({ label: `Dataset ${d.index} ${d.id ? `(${d.id})` : ''}`, value: String(d.index) }))
  ];

  return (
    <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3 border-b border-gray-700/50 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-accent-400">
              <Database size={14} />
              <span>DATA BINDING</span>
          </div>
          <button 
             onClick={handleCreateDataset}
             className="text-[10px] flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors text-white"
          >
              <Plus size={10} /> Dataset
          </button>
      </div>

      <PropertyRow label="Source">
         <SelectInput 
            value={currentDatasetIndex !== undefined ? String(currentDatasetIndex) : 'internal'}
            options={sourceOptions}
            onChange={handleSourceChange}
         />
      </PropertyRow>

      {hasConflict && (
          <div className="mb-2 p-2 bg-amber-900/30 border border-amber-800 rounded text-[10px] text-amber-200 flex items-start gap-2">
              <AlertTriangle size={12} className="shrink-0 mt-0.5" />
              <div>
                  Series has both <b>Internal Data</b> and <b>Dataset</b> linked. Internal Data takes priority. 
                  <button 
                      onClick={() => onChange(`${path}.data`, undefined)}
                      className="text-accent-400 hover:text-white underline ml-1"
                  >
                      Clear Internal Data
                  </button>
              </div>
          </div>
      )}

      {currentDatasetIndex !== undefined ? (
          <div className="mt-3 bg-gray-900/50 rounded p-2">
             <div className="text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                 Dimension Mapping
             </div>
             
             {channels.map(channel => (
                 <PropertyRow key={channel} label={channel} className="mb-1">
                     <SelectInput 
                        value={getUiValue(currentEncode[channel])}
                        options={dimOptions}
                        onChange={(v) => {
                             onChange(`${path}.encode.${channel}`, parseUiValue(v));
                        }}
                     />
                 </PropertyRow>
             ))}
             
             <div className="mt-3 pt-2 border-t border-gray-700 text-[10px] text-gray-500 flex flex-wrap gap-1 items-center">
                 <Table size={10} />
                 <span>Available:</span> 
                 {dimensions.length > 0 ? (
                     dimensions.map((d: any, i: number) => (
                         <span key={i} className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">{d}</span>
                     ))
                 ) : (
                     <span className="italic opacity-50">No named dimensions found</span>
                 )}
             </div>
          </div>
      ) : (
          <div className="mt-2 text-[10px] text-gray-500 italic p-2 bg-gray-800/30 rounded border border-gray-700/50">
              Using internal <code>series.data</code> array. 
              {(!series.data || series.data.length === 0) && <span className="text-amber-500 ml-1"> (Data is empty)</span>}
              <div className="mt-1">
                  Switch to a <b>Dataset</b> to enable dynamic dimension mapping.
              </div>
          </div>
      )}
    </div>
  );
};
