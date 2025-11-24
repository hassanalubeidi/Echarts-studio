import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setActivePanel } from '../../store/slices/editorSlice';
import { IconLayers, IconData, IconSettings } from '../ui/Icons';
import { PanelType } from '../../types';

interface SidebarItemProps {
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  title: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  isActive, 
  onClick,
  title
}) => (
  <div 
    onClick={onClick}
    title={title}
    className={`w-full aspect-square flex items-center justify-center cursor-pointer transition-all duration-200 relative
      ${isActive 
        ? 'text-accent-500' 
        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
      }`}
  >
    {isActive && (
       <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-500"></div>
    )}
    {icon}
  </div>
);

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const activePanel = useSelector((state: RootState) => state.editor.activePanel);
  
  const items: { id: PanelType; icon: React.ReactNode; label: string }[] = [
    { id: 'layers', icon: <IconLayers />, label: 'Layers & Components' },
    { id: 'data', icon: <IconData />, label: 'Data Source' },
    { id: 'settings', icon: <IconSettings />, label: 'Settings' },
  ];

  return (
    <div className="w-12 bg-gray-950 flex flex-col border-r border-gray-800 z-20 shrink-0">
      <div className="flex-1 flex flex-col pt-2">
        {items.map(item => (
          <SidebarItem
            key={item.id}
            title={item.label}
            icon={item.icon}
            isActive={activePanel === item.id}
            onClick={() => dispatch(setActivePanel(item.id))}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
