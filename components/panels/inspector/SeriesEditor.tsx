
import React from 'react';
import { LineSeriesEditor } from './series/LineSeriesEditor';
import { BarSeriesEditor } from './series/BarSeriesEditor';
import { PieSeriesEditor } from './series/PieSeriesEditor';
import { ScatterSeriesEditor } from './series/ScatterSeriesEditor';
import { CandlestickSeriesEditor } from './series/CandlestickSeriesEditor';
import { HeatmapSeriesEditor } from './series/HeatmapSeriesEditor';
import { FunnelSeriesEditor } from './series/FunnelSeriesEditor';
import { GaugeSeriesEditor } from './series/GaugeSeriesEditor';
import { GraphSeriesEditor } from './series/GraphSeriesEditor';
import { TreeSeriesEditor } from './series/TreeSeriesEditor';
import { TreemapSeriesEditor } from './series/TreemapSeriesEditor';
import { SunburstSeriesEditor } from './series/SunburstSeriesEditor';
import { SankeySeriesEditor } from './series/SankeySeriesEditor';
import { SelectInput } from '../../ui/controls/SelectInput';
import { PropertyRow } from '../../ui/controls/PropertyRow';
import { DataBindingEditor } from './components/DataBindingEditor';

interface SeriesEditorProps {
  series: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

export const SeriesEditor: React.FC<SeriesEditorProps> = ({ series, path, onChange }) => {
  
  // Render specific editor based on series.type
  const renderSpecificEditor = () => {
      switch(series.type) {
          case 'line':
              return <LineSeriesEditor series={series} path={path} onChange={onChange} />;
          case 'bar':
              return <BarSeriesEditor series={series} path={path} onChange={onChange} />;
          case 'pie':
              return <PieSeriesEditor series={series} path={path} onChange={onChange} />;
          case 'scatter':
              return <ScatterSeriesEditor series={series} path={path} onChange={onChange} />;
          case 'candlestick':
              return <CandlestickSeriesEditor series={series} path={path} onChange={onChange} />;
          case 'heatmap':
              return <HeatmapSeriesEditor series={series} path={path} onChange={onChange} />;
          case 'funnel':
              return <FunnelSeriesEditor series={series} path={path} onChange={onChange} />;
          case 'gauge':
              return <GaugeSeriesEditor series={series} path={path} onChange={onChange} />;
          case 'graph':
              return <GraphSeriesEditor series={series} path={path} onChange={onChange} />;
          case 'tree':
              return <TreeSeriesEditor series={series} path={path} onChange={onChange} />;
          case 'treemap':
              return <TreemapSeriesEditor series={series} path={path} onChange={onChange} />;
          case 'sunburst':
              return <SunburstSeriesEditor series={series} path={path} onChange={onChange} />;
          case 'sankey':
              return <SankeySeriesEditor series={series} path={path} onChange={onChange} />;
          case 'matrix':
              return <div className="p-2 text-xs text-gray-500 italic">Matrix series configuration is complex. Please use the raw code editor or generic properties for now.</div>;
          default:
              return <div className="p-2 text-xs text-gray-500 italic">No specific editor for {series.type} series yet.</div>
      }
  };

  const seriesTypes = [
      'line', 'bar', 'pie', 'scatter', 'effectScatter',
      'candlestick', 'heatmap', 'boxplot',
      'funnel', 'gauge', 'graph', 'sankey', 'themeRiver', 'pictorialBar',
      'tree', 'treemap', 'sunburst', 
      'radar', 'lines', 'custom', 'matrix'
  ];

  return (
    <div>
        <PropertyRow label="Series Type">
            <SelectInput 
                value={series.type}
                options={seriesTypes}
                onChange={(v) => onChange(`${path}.type`, v)}
            />
        </PropertyRow>

        <DataBindingEditor series={series} path={path} onChange={onChange} />
        
        {renderSpecificEditor()}
    </div>
  );
};
