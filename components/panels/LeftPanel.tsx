import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Layers from './Layers';
import DataPanel from './DataPanel';

const LeftPanel: React.FC = () => {
  const { activePanel, isLeftPanelOpen } = useSelector((state: RootState) => state.editor);

  if (!isLeftPanelOpen) return null;

  return (
    <div className="w-60 border-r border-gray-800 bg-gray-900 flex flex-col z-10 transition-all duration-200 shrink-0">
      {activePanel === 'layers' && <Layers />}
      {activePanel === 'data' && <DataPanel />}
      {activePanel === 'settings' && (
         <div className="p-4 text-gray-500 text-sm text-center mt-10">Global Settings Placeholder</div>
      )}
    </div>
  );
};

export default LeftPanel;