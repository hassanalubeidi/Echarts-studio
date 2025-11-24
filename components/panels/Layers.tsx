
import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { selectElement } from '../../store/slices/editorSlice';
import { addElement, removeElement, reparentElement, toggleVisibility } from '../../store/slices/chartSlice';
import { buildLayerTree, TreeNode } from '../../utils/layerTree';
import { 
    Plus, Trash2, ChevronDown, ChevronRight, GripVertical, 
    BarChart2, Grid, Type, List, MousePointer2, ZoomIn, Palette, Wrench, Box as BoxIcon,
    Eye, EyeOff, Map, Clock, Paintbrush, Activity, PieChart, Database, Hash, Code
} from 'lucide-react';
import { IconBox } from '../ui/Icons';

const AddElementDropdown = ({ parentPath }: { parentPath?: string }) => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    
    // Comprehensive list of ECharts components and series
    const elements = [
        // Core Series
        { label: 'Line Series', type: 'series.line', icon: <BarChart2 size={12} /> },
        { label: 'Bar Series', type: 'series.bar', icon: <BarChart2 size={12} /> },
        { label: 'Pie Series', type: 'series.pie', icon: <PieChart size={12} /> },
        { label: 'Scatter Series', type: 'series.scatter', icon: <Activity size={12} /> },
        { label: 'Effect Scatter', type: 'series.effectScatter', icon: <Activity size={12} /> },
        
        // Financial & Heatmap
        { label: 'Candlestick Series', type: 'series.candlestick', icon: <BarChart2 size={12} /> },
        { label: 'Heatmap Series', type: 'series.heatmap', icon: <Grid size={12} /> },
        { label: 'Boxplot Series', type: 'series.boxplot', icon: <BarChart2 size={12} /> },
        
        // Process & Flow
        { label: 'Funnel Series', type: 'series.funnel', icon: <BarChart2 size={12} className="rotate-180" /> },
        { label: 'Gauge Series', type: 'series.gauge', icon: <Clock size={12} /> },
        { label: 'Graph Series', type: 'series.graph', icon: <Activity size={12} /> },
        { label: 'Sankey Series', type: 'series.sankey', icon: <Activity size={12} /> },
        { label: 'Theme River', type: 'series.themeRiver', icon: <Activity size={12} /> },
        
        // Hierarchy
        { label: 'Tree Series', type: 'series.tree', icon: <Activity size={12} /> },
        { label: 'Treemap Series', type: 'series.treemap', icon: <Grid size={12} /> },
        { label: 'Sunburst Series', type: 'series.sunburst', icon: <PieChart size={12} /> },
        
        // Advanced / Other
        { label: 'Radar Series', type: 'series.radar', icon: <Activity size={12} /> },
        { label: 'Lines Series', type: 'series.lines', icon: <Activity size={12} /> },
        { label: 'Pictorial Bar', type: 'series.pictorialBar', icon: <BarChart2 size={12} /> },
        { label: 'Custom Series', type: 'series.custom', icon: <Code size={12} /> },
        { label: 'Matrix Series', type: 'series.matrix', icon: <Grid size={12} /> },

        // Layout & Components
        { label: 'Grid', type: 'grid', icon: <Grid size={12} /> },
        { label: 'X Axis', type: 'xAxis', icon: <Hash size={12} /> },
        { label: 'Y Axis', type: 'yAxis', icon: <Hash size={12} /> },
        { label: 'Polar Coord', type: 'polar', icon: <Activity size={12} /> },
        { label: 'Radar Coord', type: 'radar', icon: <Activity size={12} /> },
        { label: 'Geo Coord', type: 'geo', icon: <Map size={12} /> },
        { label: 'Title', type: 'title', icon: <Type size={12} /> },
        { label: 'Legend', type: 'legend', icon: <List size={12} /> },
        { label: 'Tooltip', type: 'tooltip', icon: <MousePointer2 size={12} /> },
        { label: 'DataZoom', type: 'dataZoom', icon: <ZoomIn size={12} /> },
        { label: 'VisualMap', type: 'visualMap', icon: <Palette size={12} /> },
        { label: 'Toolbox', type: 'toolbox', icon: <Wrench size={12} /> },
        { label: 'Brush', type: 'brush', icon: <Paintbrush size={12} /> },
        { label: 'Timeline', type: 'timeline', icon: <Clock size={12} /> },
        { label: 'Graphic', type: 'graphic', icon: <Map size={12} /> },
        { label: 'Dataset', type: 'dataset', icon: <Database size={12} /> },
    ];

    const filteredElements = parentPath?.startsWith('grid') 
        ? elements.filter(e => e.type.startsWith('series'))
        : elements;

    return (
        <div className="relative">
            <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white flex items-center gap-1 text-[10px] font-semibold bg-gray-800 border border-gray-700 px-2 transition-colors"
                title="Add New Element"
            >
                <Plus size={12} />
            </button>
            
            {isOpen && (
                <>
                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}></div>
                <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 shadow-xl rounded z-50 py-1 flex flex-col max-h-[400px] overflow-y-auto custom-scrollbar">
                    {filteredElements.map(el => (
                        <button 
                            key={el.type}
                            className="text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-accent-600 hover:text-white flex items-center gap-2 shrink-0 group"
                            onClick={(e) => {
                                e.stopPropagation();
                                dispatch(addElement({ type: el.type, parentPath }));
                                setIsOpen(false);
                            }}
                        >
                            <span className="opacity-70 group-hover:opacity-100">{el.icon}</span>
                            {el.label}
                        </button>
                    ))}
                </div>
                </>
            )}
        </div>
    );
}

const TreeNodeItem = ({ 
    node, 
    level = 0, 
    selectedPath,
    expandedNodes,
    onSelect, 
    onDelete, 
    onToggleVisibility,
    onDragStart, 
    onDrop,
    toggleExpand
}: { 
    node: TreeNode, 
    level: number, 
    selectedPath: string | undefined,
    expandedNodes: Record<string, boolean>,
    onSelect: (node: TreeNode) => void,
    onDelete: (path: string) => void,
    onToggleVisibility: (path: string) => void,
    onDragStart: (e: React.DragEvent, node: TreeNode) => void,
    onDrop: (e: React.DragEvent, targetNode: TreeNode) => void,
    toggleExpand: (id: string) => void
}) => {
    const hasChildren = node.children && node.children.length > 0;
    const Icon = node.icon;
    const isContainer = node.type === 'matrix' || node.type === 'grid';
    const isExpanded = !!expandedNodes[node.id];
    const isSelected = selectedPath === node.path;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isContainer) e.currentTarget.classList.add('bg-accent-900/40');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('bg-accent-900/40');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('bg-accent-900/40');
        onDrop(e, node);
    };

    return (
        <div className="flex flex-col select-none">
            <div 
                className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer text-xs relative group border-b border-transparent hover:border-gray-800
                   ${isSelected ? 'bg-accent-900/30 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}
                `}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={() => onSelect(node)}
                draggable={node.canReparent}
                onDragStart={(e) => onDragStart(e, node)}
                onDragOver={isContainer ? handleDragOver : undefined}
                onDragLeave={isContainer ? handleDragLeave : undefined}
                onDrop={isContainer ? handleDrop : undefined}
            >
                {node.canReparent && (
                    <GripVertical size={12} className="opacity-0 group-hover:opacity-40 cursor-grab" />
                )}

                {hasChildren ? (
                    <div 
                        onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}
                        className="hover:text-white cursor-pointer p-0.5"
                    >
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </div>
                ) : (
                    <div className="w-4" />
                )}

                <div 
                    onClick={(e) => { e.stopPropagation(); onToggleVisibility(node.path); }}
                    className={`cursor-pointer hover:text-white transition-opacity mr-1 ${node.visible === false ? 'text-gray-600' : 'text-gray-400'}`}
                >
                    {node.visible === false ? <EyeOff size={12} /> : <Eye size={12} />}
                </div>

                <Icon size={14} className={isSelected ? 'text-accent-400' : 'opacity-70'} />
                
                <span className={`truncate flex-1 font-medium ${node.visible === false ? 'opacity-50' : ''}`}>
                    {node.label}
                </span>
                
                {node.meta && (
                    <span className="text-[9px] bg-gray-800 px-1 rounded text-gray-500 font-mono mr-1">{node.meta}</span>
                )}

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isContainer && (
                        <div onClick={e => e.stopPropagation()}>
                             <AddElementDropdown parentPath={node.id} />
                        </div>
                    )}
                    {node.id !== 'matrix' && (
                        <button 
                            className={`p-1 rounded hover:bg-red-500/20 hover:text-red-400 transition-all ${isSelected ? 'opacity-100' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(node.path);
                            }}
                            title="Delete"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>
            </div>
            
            {hasChildren && isExpanded && (
                <div>
                    {node.children!.map((child: TreeNode) => (
                        <TreeNodeItem 
                            key={child.id} 
                            node={child} 
                            level={level + 1}
                            selectedPath={selectedPath}
                            expandedNodes={expandedNodes}
                            onSelect={onSelect}
                            onDelete={onDelete}
                            onToggleVisibility={onToggleVisibility}
                            onDragStart={onDragStart}
                            onDrop={onDrop}
                            toggleExpand={toggleExpand}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const Layers: React.FC = () => {
    const dispatch = useDispatch();
    const option = useSelector((state: RootState) => state.chart.option);
    const selectedElement = useSelector((state: RootState) => state.editor.selectedElement);
    
    // Build Tree
    const treeData = useMemo(() => buildLayerTree(option), [option]);
    
    // Auto-expand matrix and grids initially
    const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(() => {
        const init: any = { 'matrix': true };
        if (option.grid) {
            (Array.isArray(option.grid) ? option.grid : [option.grid]).forEach((_: any, i: number) => {
                init[`grid.${i}`] = true;
            });
        }
        return init;
    });

    const toggleExpand = (id: string) => {
        setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSelect = (node: TreeNode) => {
        dispatch(selectElement({ path: node.path, type: node.type as any, label: node.label }));
    };

    const handleDelete = (path: string) => {
        // Confirmation blocked in sandbox environments, removing explicit confirm() call
        dispatch(removeElement({ path }));
        if (selectedElement?.path === path) dispatch(selectElement(null));
    };
    
    const handleToggleVisibility = (path: string) => {
        dispatch(toggleVisibility({ path }));
    };

    const handleDragStart = (e: React.DragEvent, node: TreeNode) => {
        e.dataTransfer.setData('nodePath', node.path);
    };

    const handleDrop = (e: React.DragEvent, targetNode: TreeNode) => {
        const sourcePath = e.dataTransfer.getData('nodePath');
        if (!sourcePath || sourcePath === targetNode.path) return;

        dispatch(reparentElement({ 
            path: sourcePath, 
            targetId: targetNode.id,
            targetType: targetNode.type
        }));
    };

    const handleRootDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const sourcePath = e.dataTransfer.getData('nodePath');
        if (!sourcePath) return;
        dispatch(reparentElement({ path: sourcePath, targetId: 'root', targetType: 'root' }));
    };

    const renderTree = (nodes: TreeNode[]) => {
        return nodes.map(node => (
            <TreeNodeItem 
                key={node.id}
                node={node}
                level={0}
                selectedPath={selectedElement?.path}
                expandedNodes={expandedNodes}
                onSelect={handleSelect}
                onDelete={handleDelete}
                onToggleVisibility={handleToggleVisibility}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                toggleExpand={toggleExpand}
            />
        ));
    };

    return (
        <div 
            className="flex flex-col h-full bg-gray-900 overflow-y-auto custom-scrollbar"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleRootDrop} 
        >
            <div className="h-8 flex items-center px-4 bg-gray-850 border-b border-gray-800 shrink-0 justify-between">
                <span className="text-xs font-semibold text-gray-300">Layers</span>
                <AddElementDropdown />
            </div>
            
            <div className="py-2 min-h-[200px]">
                 <div 
                    className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs select-none border-l-2 border-transparent 
                        ${selectedElement === null ? 'bg-accent-900/30 text-white' : 'text-gray-400 hover:bg-gray-800'}
                    `}
                    onClick={() => dispatch(selectElement(null))}
                 >
                    <IconBox size={14} />
                    <span className="font-bold">Root Configuration</span>
                 </div>
                 
                 {renderTree(treeData)}
                 
                 <div className="text-[10px] text-gray-600 p-4 text-center mt-4 border-t border-gray-800 border-dashed">
                     Drag Series to Grids or Matrix to organize
                 </div>
            </div>
        </div>
    );
};

export default Layers;
