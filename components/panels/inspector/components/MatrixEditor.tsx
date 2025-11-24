
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectElement } from '../../../../store/slices/editorSlice';
import { addElement, syncOption, updateOptionProperty } from '../../../../store/slices/chartSlice';
import { SectionHeader } from '../../../ui/SectionHeader';
import { PropertyRow } from '../../../ui/controls/PropertyRow';
import { TextInput } from '../../../ui/controls/TextInput';
import { 
  Combine, Split, Columns, Rows, Plus, Trash2, 
  BarChart2, Type, Grid as GridIcon, MoreHorizontal,
  Layout, List
} from '../../../../components/ui/Icons';
import { RootState } from '../../../../store';

interface MatrixEditorProps {
  matrix: any;
  path: string;
  onChange: (path: string, value: any) => void;
}

interface Selection {
  c1: number;
  r1: number;
  c2: number;
  r2: number;
}

const getColumnLabel = (index: number) => {
    let label = '';
    let i = index;
    while (i >= 0) {
        label = String.fromCharCode(65 + (i % 26)) + label;
        i = Math.floor(i / 26) - 1;
    }
    return label;
};

export const MatrixEditor: React.FC<MatrixEditorProps> = ({ matrix, path, onChange }) => {
  const dispatch = useDispatch();
  const fullOption = useSelector((state: RootState) => state.chart.option);
  
  // -- Local State --
  const [selection, setSelection] = useState<Selection | null>(null);
  const [dragStart, setDragStart] = useState<{c: number, r: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Dropdown Logic
  const [showComponentMenu, setShowComponentMenu] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{top: number, left: number} | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // -- Derived Dimensions & Data --
  const colCount = useMemo(() => Math.max(matrix.x?.data?.length || 5, 1), [matrix.x]);
  const rowCount = useMemo(() => Math.max(matrix.y?.data?.length || 5, 1), [matrix.y]);
  const bodyData = useMemo(() => matrix.body?.data || [], [matrix.body]);

  // -- Event Handlers --
  useEffect(() => {
    const handleUp = () => {
      setIsDragging(false);
      setDragStart(null);
    };
    window.addEventListener('mouseup', handleUp);
    return () => window.removeEventListener('mouseup', handleUp);
  }, []);

  const handleMouseDown = (c: number, r: number, shiftKey: boolean) => {
    if (shiftKey && selection) {
      setSelection({
        c1: Math.min(selection.c1, c),
        r1: Math.min(selection.r1, r),
        c2: Math.max(selection.c2, c),
        r2: Math.max(selection.r2, r)
      });
    } else {
      setIsDragging(true);
      setDragStart({ c, r });
      setSelection({ c1: c, r1: r, c2: c, r2: r });
    }
    // Dismiss menu if open
    setShowComponentMenu(false);
  };

  const handleMouseEnter = (c: number, r: number) => {
    if (isDragging && dragStart) {
      setSelection({
        c1: Math.min(dragStart.c, c),
        r1: Math.min(dragStart.r, r),
        c2: Math.max(dragStart.c, c),
        r2: Math.max(dragStart.r, r)
      });
    }
  };

  const handleHeaderClick = (type: 'col' | 'row', index: number, shiftKey: boolean) => {
      if (type === 'col') {
          handleMouseDown(index, 0, shiftKey); // Start selection
          if (shiftKey && selection) {
             setSelection(prev => prev ? { ...prev, c2: index, r1: 0, r2: rowCount - 1 } : null);
          } else {
             setSelection({ c1: index, r1: 0, c2: index, r2: rowCount - 1 });
          }
      } else {
          handleMouseDown(0, index, shiftKey);
          if (shiftKey && selection) {
             setSelection(prev => prev ? { ...prev, r2: index, c1: 0, c2: colCount - 1 } : null);
          } else {
             setSelection({ c1: 0, r1: index, c2: colCount - 1, r2: index });
          }
      }
  };

  // -- Merging Logic --
  const getMergedRegion = (c: number, r: number) => {
    return bodyData.find((item: any) => {
      if (!item.mergeCells || !item.coord) return false;
      const [cols, rows] = item.coord; 
      return c >= cols[0] && c <= cols[1] && r >= rows[0] && r <= rows[1];
    });
  };

  const isCellHidden = (c: number, r: number) => {
    const region = getMergedRegion(c, r);
    if (!region) return false;
    const [cols, rows] = region.coord;
    return !(c === cols[0] && r === rows[0]);
  };

  const handleMerge = () => {
    if (!selection) return;
    const { c1, r1, c2, r2 } = selection;
    if (c1 === c2 && r1 === r2) return;

    // Remove existing merge configs overlapping this area
    const newData = bodyData.filter((item: any) => {
      const [cols, rows] = item.coord;
      return !(cols[0] >= c1 && cols[1] <= c2 && rows[0] >= r1 && rows[1] <= r2);
    });

    newData.push({
      coord: [[c1, c2], [r1, r2]],
      mergeCells: true,
      itemStyle: { color: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: '#444' }
    });

    onChange(`${path}.body.data`, newData);
  };

  const handleUnmerge = () => {
    if (!selection) return;
    const { c1, r1, c2, r2 } = selection;
    const newData = bodyData.filter((item: any) => {
       if (!item.coord) return true;
       const [cols, rows] = item.coord;
       const intersectC = Math.max(c1, cols[0]) <= Math.min(c2, cols[1]);
       const intersectR = Math.max(r1, rows[0]) <= Math.min(r2, rows[1]);
       // Remove if it overlaps selection
       return !(intersectC && intersectR && item.mergeCells);
    });
    onChange(`${path}.body.data`, newData);
  };

  // -- Structure Editing --
  const handleStructureChange = (type: 'insert' | 'delete', axis: 'col' | 'row') => {
      if (!selection) return;
      const index = axis === 'col' ? selection.c1 : selection.r1; 
      const delta = type === 'insert' ? 1 : -1;

      // Deep clone option to safely manipulate
      const newOption = JSON.parse(JSON.stringify(fullOption));
      const m = newOption.matrix;
      
      // Ensure data arrays exist
      if (!m.x || !m.x.data) {
          if (!m.x) m.x = {};
          m.x.data = Array(colCount).fill(null);
      }
      if (!m.y || !m.y.data) {
          if (!m.y) m.y = {};
          m.y.data = Array(rowCount).fill(null);
      }

      const axisData = axis === 'col' ? m.x.data : m.y.data;
      
      if (type === 'insert') {
          axisData.splice(index, 0, null);
      } else {
          if (axisData.length <= 1) return; // Prevent empty matrix
          axisData.splice(index, 1);
      }

      // Shift Components Logic
      const checkAndShift = (list: any[]) => {
          if (!list) return;
          list.forEach(item => {
              if (item && item.coordinateSystem === 'matrix' && item.coord) {
                  const coordIdx = axis === 'col' ? 0 : 1;
                  const val = item.coord[coordIdx];
                  if (type === 'insert') {
                      if (val >= index) item.coord[coordIdx] += delta;
                  } else {
                      if (val === index) {
                         // Component deleted? Or just kept in same index?
                         // ECharts might error if we don't remove, but for a simplified editor we clamp
                         item.coord[coordIdx] = Math.max(0, val - 1);
                      } else if (val > index) {
                         item.coord[coordIdx] += delta;
                      }
                  }
              }
          });
      };

      if (newOption.grid) checkAndShift(Array.isArray(newOption.grid) ? newOption.grid : [newOption.grid]);
      if (newOption.series) checkAndShift(newOption.series);
      if (newOption.title) checkAndShift(Array.isArray(newOption.title) ? newOption.title : [newOption.title]);
      if (newOption.legend) checkAndShift(Array.isArray(newOption.legend) ? newOption.legend : [newOption.legend]);

      // Shift Body Data (Merged Cells)
      if (m.body && m.body.data) {
          const coordIdx = axis === 'col' ? 0 : 1;
          m.body.data = m.body.data.map((item: any) => {
               // Clone coords
               const newCoord = [[...item.coord[0]], [...item.coord[1]]];
               const range = newCoord[coordIdx];

               if (type === 'insert') {
                   // If insertion is BEFORE the start of a merge, shift both start/end
                   if (range[0] >= index) {
                       range[0] += 1;
                       range[1] += 1;
                   }
                   // If insertion is INSIDE a merge, extend the merge
                   else if (range[0] < index && range[1] >= index) range[1] += 1;
               } else {
                   // Deletion
                   // If deletion is BEFORE, shift back
                   if (range[0] > index) {
                       range[0] -= 1;
                       range[1] -= 1;
                   }
                   // If deletion is INSIDE, shrink
                   else if (range[0] <= index && range[1] >= index) range[1] -= 1;
               }
               
               // Validate
               if (range[0] > range[1]) return null; // Invalid range
               
               item.coord = newCoord;
               return item;
          }).filter(Boolean);
      }

      dispatch(syncOption(newOption));
      // Adjust selection to keep focus
      setSelection(null);
  };

  // -- Component Management --
  const getComponentsAt = (c: number, r: number) => {
    const list: any[] = [];
    const check = (src: any, type: string) => {
      if (!src) return;
      const arr = Array.isArray(src) ? src : [src];
      arr.forEach((item: any, idx: number) => {
        if (item.coordinateSystem === 'matrix' && item.coord && item.coord[0] === c && item.coord[1] === r) {
            // Determine a friendly label
            let label = item.name || item.text || item.id;
            if (!label && type === 'series') label = item.type;
            if (!label) label = `${type} ${idx}`;
            
            list.push({ ...item, _type: type, _index: idx, label });
        }
      });
    };
    check(fullOption.series, 'series');
    check(fullOption.grid, 'grid');
    check(fullOption.title, 'title');
    check(fullOption.legend, 'legend');
    return list;
  };

  const addComponent = (type: string) => {
    if (!selection) return;
    const { c1, r1 } = selection;
    dispatch(addElement({
      type,
      parentPath: 'matrix',
      initialValues: {
        coordinateSystem: 'matrix',
        coord: [c1, r1]
      }
    }));
    setShowComponentMenu(false);
  };

  const toggleDropdown = () => {
    if (showComponentMenu) {
        setShowComponentMenu(false);
    } else {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPos({ top: rect.bottom + 5, left: rect.left });
            setShowComponentMenu(true);
        }
    }
  };

  // -- Styles --
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `30px repeat(${colCount}, minmax(60px, 1fr))`,
    gridTemplateRows: `24px repeat(${rowCount}, minmax(28px, 1fr))`,
    gap: '1px',
    backgroundColor: '#262626'
  };

  return (
    <div className="flex flex-col gap-4 select-none">
      
      {/* 1. Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-800 custom-scrollbar">
          <div className="flex bg-gray-800 rounded p-1 gap-1 shrink-0">
             <button onClick={() => handleStructureChange('insert', 'row')} className="p-1.5 hover:bg-gray-700 rounded text-gray-400 group relative" title="Insert Row">
                <Rows size={16} /><Plus size={10} className="absolute bottom-0 right-0 bg-gray-800 text-green-400 rounded-full" />
             </button>
             <button onClick={() => handleStructureChange('delete', 'row')} className="p-1.5 hover:bg-gray-700 rounded text-gray-400 group relative" title="Delete Row">
                <Rows size={16} /><Trash2 size={10} className="absolute bottom-0 right-0 bg-gray-800 text-red-400 rounded-full" />
             </button>
             <div className="w-[1px] bg-gray-700 h-5 mx-1"></div>
             <button onClick={() => handleStructureChange('insert', 'col')} className="p-1.5 hover:bg-gray-700 rounded text-gray-400 group relative" title="Insert Column">
                <Columns size={16} /><Plus size={10} className="absolute bottom-0 right-0 bg-gray-800 text-green-400 rounded-full" />
             </button>
             <button onClick={() => handleStructureChange('delete', 'col')} className="p-1.5 hover:bg-gray-700 rounded text-gray-400 group relative" title="Delete Column">
                <Columns size={16} /><Trash2 size={10} className="absolute bottom-0 right-0 bg-gray-800 text-red-400 rounded-full" />
             </button>
          </div>
          
          <div className="flex bg-gray-800 rounded p-1 gap-1 shrink-0">
             <button onClick={handleMerge} className="p-1.5 hover:bg-gray-700 rounded text-gray-400" title="Merge Cells"><Combine size={16} /></button>
             <button onClick={handleUnmerge} className="p-1.5 hover:bg-gray-700 rounded text-gray-400" title="Unmerge Cells"><Split size={16} /></button>
          </div>

          <div className="flex bg-gray-800 rounded p-1 gap-1 shrink-0">
              <button 
                ref={buttonRef}
                onClick={toggleDropdown} 
                className={`p-1.5 rounded flex items-center gap-1 transition-colors ${showComponentMenu ? 'bg-accent-600 text-white' : 'text-accent-400 hover:bg-gray-700'}`} 
                title="Add Component to Cell"
              >
                <Plus size={16} /> <span className="text-[10px] font-bold">ADD</span>
              </button>
              
              {showComponentMenu && dropdownPos && (
                  <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowComponentMenu(false)}></div>
                  <div 
                      className="fixed z-50 mt-1 bg-gray-800 border border-gray-700 shadow-xl rounded flex flex-col w-48 p-1"
                      style={{ top: dropdownPos.top, left: dropdownPos.left }}
                  >
                      <div className="px-2 py-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider border-b border-gray-700 mb-1">Add to Selection</div>
                      <button onClick={() => addComponent('series.bar')} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-xs text-left text-gray-200"><BarChart2 size={12} /> Bar/Line Chart</button>
                      <button onClick={() => addComponent('series.pie')} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-xs text-left text-gray-200"><Layout size={12} /> Pie Chart</button>
                      <button onClick={() => addComponent('grid')} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-xs text-left text-gray-200"><GridIcon size={12} /> Empty Grid</button>
                      <button onClick={() => addComponent('title')} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-xs text-left text-gray-200"><Type size={12} /> Title / Text</button>
                      <button onClick={() => addComponent('legend')} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-xs text-left text-gray-200"><List size={12} /> Legend</button>
                  </div>
                  </>
              )}
          </div>
      </div>

      {/* 2. The Excel Grid */}
      <div className="relative bg-gray-900 border border-gray-700 rounded overflow-hidden shadow-inner max-h-[400px] overflow-auto custom-scrollbar" ref={containerRef}>
          <div style={gridStyle}>
              {/* Corner */}
              <div className="bg-gray-800 sticky top-0 left-0 z-30 border-b border-r border-gray-700 shadow-sm flex items-center justify-center text-[9px] text-gray-600">
                  <GridIcon size={12} />
              </div>

              {/* Column Headers */}
              {Array.from({ length: colCount }).map((_, c) => {
                  const isActive = selection && selection.c1 <= c && selection.c2 >= c;
                  return (
                    <div 
                        key={`th-${c}`} 
                        className={`text-[10px] flex items-center justify-center font-bold font-mono border-b border-r border-gray-700 cursor-pointer sticky top-0 z-20 select-none transition-colors
                            ${isActive ? 'bg-accent-900 text-accent-100 border-b-accent-500' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}
                        `}
                        onClick={(e) => handleHeaderClick('col', c, e.shiftKey)}
                    >
                        {getColumnLabel(c)}
                    </div>
                  );
              })}

              {/* Rows */}
              {Array.from({ length: rowCount }).map((_, r) => (
                  <React.Fragment key={`row-${r}`}>
                      {/* Row Header */}
                      <div 
                         className={`text-[10px] flex items-center justify-center font-bold font-mono border-b border-r border-gray-700 cursor-pointer sticky left-0 z-20 select-none transition-colors
                            ${selection && selection.r1 <= r && selection.r2 >= r ? 'bg-accent-900 text-accent-100 border-r-accent-500' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}
                         `}
                         onClick={(e) => handleHeaderClick('row', r, e.shiftKey)}
                      >
                          {r + 1}
                      </div>

                      {/* Cells */}
                      {Array.from({ length: colCount }).map((_, c) => {
                          if (isCellHidden(c, r)) return null;

                          const merged = getMergedRegion(c, r);
                          const cellStyle: React.CSSProperties = {
                              backgroundColor: '#1a1a1a',
                              gridColumn: merged ? `span ${merged.coord[0][1] - merged.coord[0][0] + 1}` : undefined,
                              gridRow: merged ? `span ${merged.coord[1][1] - merged.coord[1][0] + 1}` : undefined,
                          };

                          const isSelected = selection && c >= selection.c1 && c <= selection.c2 && r >= selection.r1 && r <= selection.r2;
                          const components = getComponentsAt(c, r);

                          return (
                              <div
                                  key={`cell-${c}-${r}`}
                                  style={cellStyle}
                                  className={`relative border border-gray-800/50 hover:border-gray-600 transition-colors cursor-cell group overflow-hidden
                                     ${isSelected ? 'bg-accent-900/10 ring-2 ring-inset ring-accent-500 z-10' : ''}
                                  `}
                                  onMouseDown={(e) => handleMouseDown(c, r, e.shiftKey)}
                                  onMouseEnter={() => handleMouseEnter(c, r)}
                              >
                                  {/* Merged Text Value */}
                                  {merged && merged.value && (
                                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-500 pointer-events-none p-1 text-center leading-tight">
                                          {merged.value}
                                      </div>
                                  )}

                                  {/* Component Indicators */}
                                  {components.length > 0 && (
                                      <div className="absolute inset-0 p-1 flex flex-wrap content-start gap-1 pointer-events-none">
                                          {components.map((comp, i) => (
                                              <div key={i} className={`h-4 px-1.5 rounded-[2px] flex items-center justify-center text-[9px] font-bold tracking-tight shadow-sm border border-black/20
                                                  ${comp._type === 'grid' ? 'bg-green-700/80 text-green-100' : 
                                                    comp._type === 'series' ? 'bg-blue-600/80 text-blue-100' : 
                                                    comp._type === 'title' ? 'bg-purple-600/80 text-purple-100' : 'bg-gray-600/80 text-white'}
                                              `} title={comp.label}>
                                                  {comp._type === 'grid' ? 'GRD' : comp._type === 'series' ? 'CHT' : 'TXT'}
                                              </div>
                                          ))}
                                      </div>
                                  )}
                              </div>
                          );
                      })}
                  </React.Fragment>
              ))}
          </div>
      </div>

      {/* 3. Contextual Properties */}
      {selection && (
          <div className="bg-gray-800 rounded p-3 border border-gray-700 shadow-lg">
               <div className="flex items-center justify-between mb-3 border-b border-gray-700 pb-2">
                   <div className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2">
                       <span className="bg-gray-900 px-1.5 py-0.5 rounded text-gray-200 border border-gray-700 font-mono">
                           {getColumnLabel(selection.c1)}{selection.r1 + 1} 
                           {(selection.c1 !== selection.c2 || selection.r1 !== selection.r2) ? `:${getColumnLabel(selection.c2)}${selection.r2 + 1}` : ''}
                       </span>
                       Contents
                   </div>
               </div>

               {/* Components List in Selection */}
               {(() => {
                   // Gather all components in selected range
                   const comps: any[] = [];
                   for (let c = selection.c1; c <= selection.c2; c++) {
                       for (let r = selection.r1; r <= selection.r2; r++) {
                           comps.push(...getComponentsAt(c, r));
                       }
                   }
                   
                   const uniqueComps = comps; 

                   if (uniqueComps.length > 0) return (
                       <div className="flex flex-col gap-1 mb-3">
                           {uniqueComps.map((comp, i) => (
                               <div key={i} className="flex items-center justify-between bg-gray-900 p-1.5 rounded border border-gray-700 hover:border-gray-500 transition-colors group">
                                   <div className="flex items-center gap-2 overflow-hidden">
                                       {comp._type === 'grid' && <GridIcon size={12} className="text-green-400 shrink-0" />}
                                       {comp._type === 'series' && <BarChart2 size={12} className="text-blue-400 shrink-0" />}
                                       {comp._type === 'title' && <Type size={12} className="text-purple-400 shrink-0" />}
                                       <span className="text-xs text-gray-300 truncate font-medium" title={comp.label}>{comp.label}</span>
                                       <span className="text-[9px] text-gray-600 font-mono ml-1">[{comp.coord.join(',')}]</span>
                                   </div>
                                   <button 
                                      onClick={() => dispatch(selectElement({ type: comp._type, path: `${comp._type}.${comp._index}`, label: comp.label }))}
                                      className="p-1 hover:bg-gray-800 rounded text-gray-500 hover:text-white transition-colors"
                                      title="Inspect Component"
                                   >
                                      <MoreHorizontal size={14} />
                                   </button>
                               </div>
                           ))}
                       </div>
                   );
                   return <div className="text-[10px] text-gray-600 italic mb-3 text-center py-2 bg-gray-900/50 rounded">Empty Cell</div>;
               })()}

               {/* Cell Text Editing */}
               {getMergedRegion(selection.c1, selection.r1) && (
                   <div className="border-t border-gray-700 pt-3">
                       <PropertyRow label="Cell Text">
                           <TextInput 
                               value={getMergedRegion(selection.c1, selection.r1).value || ''}
                               onChange={(v) => {
                                   const newData = [...bodyData];
                                   const region = getMergedRegion(selection.c1, selection.r1);
                                   const idx = newData.indexOf(region);
                                   if (idx !== -1) {
                                       newData[idx] = { ...newData[idx], value: v };
                                       onChange(`${path}.body.data`, newData);
                                   }
                               }}
                               placeholder="Label..."
                           />
                       </PropertyRow>
                   </div>
               )}
          </div>
      )}

      {/* 4. Global Matrix Properties */}
      <SectionHeader title="Matrix Positioning" />
      <PropertyRow label="Left">
        <TextInput value={matrix.left ?? '10%'} onChange={(v) => onChange(`${path}.left`, v)} />
      </PropertyRow>
      <PropertyRow label="Top">
        <TextInput value={matrix.top ?? '10%'} onChange={(v) => onChange(`${path}.top`, v)} />
      </PropertyRow>
      <PropertyRow label="Width">
        <TextInput value={matrix.width ?? 'auto'} onChange={(v) => onChange(`${path}.width`, v)} />
      </PropertyRow>
      <PropertyRow label="Height">
        <TextInput value={matrix.height ?? 'auto'} onChange={(v) => onChange(`${path}.height`, v)} />
      </PropertyRow>
    </div>
  );
};
