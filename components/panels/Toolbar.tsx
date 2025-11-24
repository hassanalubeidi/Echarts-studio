import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, undoAction, redoAction } from '../../store';
import { 
  Undo2, 
  Redo2, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  MousePointer2, 
  Hand,
  RefreshCw,
  Box,
  Eye
} from '../ui/Icons';
import { regenerateData } from '../../store/slices/chartSlice';
import { selectElement } from '../../store/slices/editorSlice';

const ToolButton = ({ 
  icon: Icon, 
  onClick, 
  disabled = false, 
  active = false,
  title
}: { 
  icon: any, 
  onClick: () => void, 
  disabled?: boolean, 
  active?: boolean,
  title?: string 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded-md transition-all duration-200 flex items-center justify-center
      ${disabled ? 'text-gray-600 cursor-not-allowed' : 
        active ? 'bg-accent-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
    `}
  >
    <Icon size={16} />
  </button>
);

const Separator = () => <div className="w-[1px] h-5 bg-gray-800 mx-1"></div>;

export const Toolbar: React.FC = () => {
  const dispatch = useDispatch();
  const history = useSelector((state: RootState) => state.history);
  const selectedElement = useSelector((state: RootState) => state.editor.selectedElement);

  return (
    <div className="h-10 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-2 shrink-0 z-20">
      
      {/* History Controls */}
      <div className="flex items-center gap-1">
        <ToolButton 
          icon={Undo2} 
          onClick={() => dispatch(undoAction())} 
          disabled={history.past.length === 0} 
          title="Undo (Ctrl+Z)"
        />
        <ToolButton 
          icon={Redo2} 
          onClick={() => dispatch(redoAction())} 
          disabled={history.future.length === 0} 
          title="Redo (Ctrl+Y)"
        />
      </div>

      <Separator />

      {/* Interaction Modes (Mock for now, could actuate ECharts dispatchAction) */}
      <div className="flex items-center gap-1">
        <ToolButton icon={MousePointer2} onClick={() => {}} active={true} title="Select" />
        <ToolButton icon={Hand} onClick={() => {}} title="Pan" />
        <ToolButton icon={ZoomIn} onClick={() => {}} title="Zoom In" />
        <ToolButton icon={ZoomOut} onClick={() => {}} title="Zoom Out" />
      </div>

      <Separator />

      {/* Data Actions */}
      <div className="flex items-center gap-1">
        <ToolButton 
            icon={RefreshCw} 
            onClick={() => dispatch(regenerateData())} 
            title="Regenerate Data" 
        />
        <ToolButton 
            icon={Box} 
            onClick={() => dispatch(selectElement(null))} 
            title="Deselect All"
            disabled={!selectedElement} 
        />
        <ToolButton 
            icon={Eye} 
            onClick={() => {}} 
            title="Preview Mode" 
        />
      </div>

       <div className="flex-1"></div>

       {/* Right side actions */}
       <div className="flex items-center gap-1">
          <ToolButton icon={Trash2} onClick={() => {}} title="Clear Chart" />
       </div>
    </div>
  );
};