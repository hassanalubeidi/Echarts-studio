
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { IconBox, IconChart } from '../ui/Icons';
import { FinancialData } from '../../types';

const DataPanel: React.FC = () => {
  const chartData = useSelector((state: RootState) => state.chart.data);
  const option = useSelector((state: RootState) => state.chart.option);
  const [activeDatasetIndex, setActiveDatasetIndex] = useState<number>(0);

  // Use datasets from option if available (truth source), otherwise fall back to chartData
  const datasets = option.dataset 
      ? (Array.isArray(option.dataset) ? option.dataset : [option.dataset]) 
      : (chartData.datasets || []);

  if (!datasets || datasets.length === 0) return <div className="p-4 text-gray-500">No Datasets available</div>;

  const currentDataset = datasets[activeDatasetIndex];
  const source = currentDataset?.source;

  const renderCellValue = (val: any) => {
    if (typeof val === 'number') return val.toFixed(2);
    if (typeof val === 'string') return val;
    if (val === null || val === undefined) return '-';
    if (Array.isArray(val)) return `[${val.map(v => typeof v === 'number' ? v.toFixed(2) : v).join(', ')}]`;
    if (typeof val === 'object') return '{Object}';
    return String(val);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-hidden">
      <div className="h-8 flex items-center px-4 bg-gray-850 border-b border-gray-800 shrink-0 justify-between">
        <span className="text-xs font-semibold text-gray-300">Data Source</span>
        <span className="text-[10px] text-gray-500">{Array.isArray(source) ? `${source.length} rows` : ''}</span>
      </div>
      
      {/* Dataset Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-800 bg-gray-900 custom-scrollbar">
        {datasets.map((d: any, i: number) => (
          <button
            key={i}
            onClick={() => setActiveDatasetIndex(i)}
            className={`px-3 py-2 text-[10px] whitespace-nowrap transition-colors border-b-2
              ${activeDatasetIndex === i 
                ? 'border-accent-500 text-white bg-gray-800' 
                : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800'}
            `}
          >
            {d.id ? d.id : `Dataset ${i}`}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto custom-scrollbar p-0">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-850 shadow-sm z-10">
            <tr>
              <th className="py-1 px-3 text-[10px] text-gray-500 font-mono border-b border-gray-800 w-12 bg-gray-850">#</th>
              {/* If source is array of arrays, assume first row might be header if string, or just use index */}
              {Array.isArray(source) && source.length > 0 && Array.isArray(source[0]) && 
                source[0].map((col: any, idx: number) => (
                    <th key={idx} className="py-1 px-3 text-[10px] text-gray-400 font-mono border-b border-gray-800 bg-gray-850 whitespace-nowrap">
                        {typeof col === 'string' ? col : `Col ${idx}`}
                    </th>
                ))
              }
              {Array.isArray(source) && source.length > 0 && !Array.isArray(source[0]) && (
                  <th className="py-1 px-3 text-[10px] text-gray-400 font-mono border-b border-gray-800 bg-gray-850">Value</th>
              )}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(source) && source.map((row: any, i: number) => {
                // Heuristic: If first row looks like header, skip it in body or style differently? 
                // ECharts dataset includes header in source usually. We display it.
                return (
                    <tr key={i} className="group hover:bg-gray-800 transition-colors border-b border-gray-800/50 last:border-0">
                        <td className="py-1 px-3 text-[10px] text-gray-600 font-mono border-r border-gray-800/50 group-hover:text-gray-400 select-none">
                        {i}
                        </td>
                        {Array.isArray(row) ? (
                            row.map((cell: any, cIdx: number) => (
                                <td key={cIdx} className="py-1 px-3 text-[10px] text-gray-400 font-mono truncate max-w-[150px]">
                                {renderCellValue(cell)}
                                </td>
                            ))
                        ) : (
                             <td className="py-1 px-3 text-[10px] text-gray-400 font-mono truncate">
                                {renderCellValue(row)}
                             </td>
                        )}
                    </tr>
                );
            })}
            {(!source || source.length === 0) && (
                <tr>
                    <td colSpan={10} className="p-4 text-center text-xs text-gray-600">No data records</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPanel;
