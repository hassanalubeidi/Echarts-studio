import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { selectElement } from '../../store/slices/editorSlice';

const EChartsRenderer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const { option, lastUpdated } = useSelector((state: RootState) => state.chart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (containerRef.current) {
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(containerRef.current, 'dark', {
          renderer: 'canvas'
        });

        // Add event listeners for interaction
        chartInstance.current.on('click', (params) => {
             // Map ECharts event params to our selection system if possible
             // For now, simpler to just log or handle basic series click
             if (params.componentType === 'series') {
                 dispatch(selectElement({
                     type: 'series',
                     path: `series.${params.seriesIndex}`,
                     label: params.seriesName || `Series ${params.seriesIndex}`
                 }));
             } else if (params.componentType === 'title') {
                 // ECharts doesn't always emit clicks for all components, but we try
                 // params.componentIndex
             }
        });
      }
      
      const handleResize = () => {
        chartInstance.current?.resize();
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current?.dispose();
        chartInstance.current = null;
      };
    }
  }, [dispatch]);

  // Sync Option
  useEffect(() => {
    if (chartInstance.current && containerRef.current && option) {
       // We use setOption with notMerge: true only if structure changes drastically, 
       // but for a smooth editor experience, let ECharts handle diffing.
       // However, to ensure properties removed from state are removed from chart, 
       // we might need strict syncing. 
       // For now, standard update.
       try {
           chartInstance.current.setOption(option, {
               notMerge: true, // Safer for an editor to avoid stale state
               lazyUpdate: false
           });
       } catch (e) {
           console.error("Invalid ECharts Option:", e);
       }
    }
  }, [option, lastUpdated]);

  return (
    <div className="flex-1 bg-black relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/50" 
           style={{ 
             backgroundImage: 'radial-gradient(#2d3748 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }}
      ></div>
      <div 
        ref={containerRef} 
        className="w-full h-full z-10"
      />
    </div>
  );
};

export default EChartsRenderer;
