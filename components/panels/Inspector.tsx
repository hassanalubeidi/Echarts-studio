import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { IconSettings } from '../ui/Icons';
import { SimulationSettings } from './inspector/SimulationSettings';
import { ElementProperties } from './inspector/ElementProperties';
import { GlobalSettings } from './inspector/GlobalSettings';

const Inspector: React.FC = () => {
  const { selectedElement, isInspectorOpen, inspectorMode, isInspectorWide } = useSelector((state: RootState) => state.editor as any);

  if (!isInspectorOpen) return null;

  // Dynamic width based on mode and wide flag
  let widthClass = 'w-80';
  if (inspectorMode === 'code') {
    widthClass = 'w-[600px]';
  } else if (isInspectorWide) {
    widthClass = 'w-[500px]';
  }

  return (
    <div className={`${widthClass} bg-gray-900 border-l border-gray-800 flex flex-col h-full shadow-xl z-20 shrink-0 transition-all duration-300 ease-in-out`}>
      <div className="h-9 border-b border-gray-800 flex items-center px-4 bg-gray-850 justify-between shrink-0">
        <span className="text-xs font-semibold text-gray-300 tracking-wide">
            {selectedElement ? 'Inspector' : 'Project Settings'}
        </span>
        <button className="text-gray-500 hover:text-white transition-colors">
          <IconSettings size={14} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
         {selectedElement ? (
             <ElementProperties />
         ) : (
             <div className="flex flex-col gap-6">
                 <div>
                    <SimulationSettings />
                 </div>
                 <div className="border-t border-gray-800 pt-6">
                    <GlobalSettings />
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};

export default Inspector;