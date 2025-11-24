import React from 'react';
import Sidebar from './components/panels/Sidebar';
import LeftPanel from './components/panels/LeftPanel';
import Inspector from './components/panels/Inspector';
import EChartsRenderer from './components/canvas/EChartsRenderer';
import { Toolbar } from './components/panels/Toolbar';
import { IconMenu, IconMaximize } from './components/ui/Icons';

const TopBar = () => (
  <div className="h-9 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-3 select-none z-30 relative">
    <div className="flex items-center gap-4">
      <div className="font-bold text-gray-100 tracking-tight flex items-center gap-2">
        <span className="text-accent-500">ECharts</span> Studio
      </div>
      <div className="h-4 w-[1px] bg-gray-800"></div>
      <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium">
        <span className="hover:text-white cursor-pointer px-1">File</span>
        <span className="hover:text-white cursor-pointer px-1">Edit</span>
        <span className="hover:text-white cursor-pointer px-1">View</span>
        <span className="hover:text-white cursor-pointer px-1">Help</span>
      </div>
    </div>
    <div className="flex items-center gap-3">
       <span className="text-[10px] text-gray-600 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">Financial Matrix Template</span>
       <div className="flex items-center gap-1">
         <button className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
           <IconMaximize size={14} />
         </button>
         <button className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
           <IconMenu size={14} />
         </button>
       </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-black text-gray-300 font-sans overflow-hidden">
      <TopBar />
      <Toolbar />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <LeftPanel />
        <EChartsRenderer />
        <Inspector />
      </div>
    </div>
  );
};

export default App;