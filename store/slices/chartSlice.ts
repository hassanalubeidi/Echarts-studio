
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChartConfig, FinancialData } from '../../types';
import { generateFinancialData, generateOption } from '../../utils/financialLogic';
import { set, get } from '../../utils/objectUtils';
import { getElementDefault } from '../../utils/echartsDefaults';

interface ChartState {
  config: ChartConfig;
  data: FinancialData;
  option: any; // ECharts Option
  lastUpdated: number;
}

const initialConfig: ChartConfig = {
  colors: {
    up: '#47b262',
    down: '#eb5454',
    text: '#9ca3af',
    subtext: '#6b7280',
    grid: '#333333',
    split: '#444444'
  },
  layout: {
    matrixMargin: 10,
    barWidth: '70%',
  },
  simulation: {
    initialPrice: 50,
    volatility: 0.02
  }
};

const initialData = generateFinancialData(initialConfig);
const initialOption = generateOption(initialData, initialConfig, 1200, 800);

const initialState: ChartState = {
  config: initialConfig,
  data: initialData,
  option: initialOption,
  lastUpdated: Date.now()
};

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    updateConfig(state, action: PayloadAction<{ path: string; value: any }>) {
      const { path, value } = action.payload;
      
      if (path.startsWith('simulation.')) {
        const key = path.split('.')[1] as keyof ChartConfig['simulation'];
        state.config.simulation[key] = value;
      } else if (path.startsWith('colors.')) {
         const key = path.split('.')[1] as keyof ChartConfig['colors'];
         state.config.colors[key] = value;
      } else if (path.startsWith('layout.')) {
         const key = path.split('.')[1] as keyof ChartConfig['layout'];
         (state.config.layout as any)[key] = value;
      }
      
      const newData = generateFinancialData(state.config);
      state.data = newData;
      state.option = generateOption(newData, state.config, 1200, 800);
      state.lastUpdated = Date.now();
    },

    updateOptionProperty(state, action: PayloadAction<{ path: string; value: any }>) {
      state.option = set(state.option, action.payload.path, action.payload.value);
      state.lastUpdated = Date.now();
    },

    // New reducer for batch updates
    updateOptionProperties(state, action: PayloadAction<{ updates: { path: string; value: any }[] }>) {
      const { updates } = action.payload;
      let newOption = state.option;
      updates.forEach(({ path, value }) => {
          newOption = set(newOption, path, value);
      });
      state.option = newOption;
      state.lastUpdated = Date.now();
    },

    toggleVisibility(state, action: PayloadAction<{ path: string }>) {
        const { path } = action.payload;
        const element = get(state.option, path);
        if (element) {
            const current = element.show !== false;
            state.option = set(state.option, `${path}.show`, !current);
            state.lastUpdated = Date.now();
        }
    },

    regenerateData(state) {
      const newData = generateFinancialData(state.config);
      state.data = newData;
      state.option.dataset = newData.datasets;
      state.lastUpdated = Date.now();
    },
    
    syncOption(state, action: PayloadAction<any>) {
        state.option = action.payload;
        state.lastUpdated = Date.now();
    },

    addElement(state, action: PayloadAction<{ type: string; parentPath?: string; initialValues?: any }>) {
      const { type, parentPath, initialValues } = action.payload;
      const componentKey = type.split('.')[0];
      const subType = type.split('.')[1];
      
      let newElement: any = { ...getElementDefault(type) };

      // === SERIES DATA LOGIC ===
      // If dataset exists, prefer dataset binding over hardcoded data
      if (componentKey === 'series') {
          const datasets = state.option.dataset ? (Array.isArray(state.option.dataset) ? state.option.dataset : [state.option.dataset]) : [];
          if (datasets.length > 0) {
              newElement.datasetIndex = 0;
              delete newElement.data; // Remove default hardcoded data to ensure dataset usage
          }
      }

      // === MATRIX PARENT HANDLING ===
      if (parentPath === 'matrix') {
          const isCartesian = ['line', 'bar', 'candlestick', 'scatter', 'effectScatter', 'boxplot', 'heatmap'].includes(subType);
          
          if (componentKey === 'series' && isCartesian) {
              // 1. Create Grid
              const grids = state.option.grid ? (Array.isArray(state.option.grid) ? state.option.grid : [state.option.grid]) : [];
              const newGridIndex = grids.length;
              
              const grid: any = {
                  coordinateSystem: 'matrix',
                  coord: initialValues?.coord || [0, 0],
                  containLabel: true,
                  show: false, // Default hidden grid box for clean look
                  ...getElementDefault('grid')
              };
              // Ensure matrix props
              grid.coordinateSystem = 'matrix';
              grid.coord = initialValues?.coord || [0, 0];
              // Remove cartesian positioning
              delete grid.left;
              delete grid.top;
              delete grid.right;
              delete grid.bottom;

              // 2. Create Axes
              const xAxes = state.option.xAxis ? (Array.isArray(state.option.xAxis) ? state.option.xAxis : [state.option.xAxis]) : [];
              const yAxes = state.option.yAxis ? (Array.isArray(state.option.yAxis) ? state.option.yAxis : [state.option.yAxis]) : [];
              
              const xAxis = { type: 'category', gridIndex: newGridIndex, show: true, boundaryGap: subType === 'bar' };
              const yAxis = { type: 'value', gridIndex: newGridIndex, show: true };

              // 3. Configure Series
              newElement.xAxisIndex = newGridIndex;
              newElement.yAxisIndex = newGridIndex;
              newElement.coordinateSystem = 'cartesian2d'; 
              
              // Apply generic initial values (excluding coords/system which went to grid/series logic)
              if (initialValues) {
                  const { coord, coordinateSystem, ...rest } = initialValues;
                  newElement = { ...newElement, ...rest };
              }

              state.option.grid = [...grids, grid];
              state.option.xAxis = [...xAxes, xAxis];
              state.option.yAxis = [...yAxes, yAxis];
              state.option.series = [...(state.option.series || []), newElement];
              state.lastUpdated = Date.now();
              return;
          }

          // Handle components that can sit directly in matrix (Title, Legend, Pie, etc)
          if (['series', 'grid', 'title', 'legend', 'graphic', 'timeline'].includes(componentKey)) {
              newElement.coordinateSystem = 'matrix';
              newElement.coord = initialValues?.coord || [0, 0];
              // Remove absolute positioning
              delete newElement.left;
              delete newElement.top;
              delete newElement.right;
              delete newElement.bottom;
          }
      } 
      // === GRID PARENT HANDLING ===
      else if (parentPath && parentPath.startsWith('grid')) {
          const parts = parentPath.split('.');
          const gridIndex = parts.length > 1 ? parseInt(parts[1]) : 0;
          if (!isNaN(gridIndex) && componentKey === 'series') {
               newElement.xAxisIndex = gridIndex;
               newElement.yAxisIndex = gridIndex;
               newElement.coordinateSystem = 'cartesian2d';
          }
      }

      // Apply specific initial values if not handled by Matrix block logic or merged above
      if (initialValues && parentPath !== 'matrix') {
          newElement = { ...newElement, ...initialValues };
      }

      // Auto-create dependencies for Cartesian Series if missing (Prevent i.getBaseAxis error)
      if (componentKey === 'series' && ['line', 'bar', 'scatter', 'candlestick', 'heatmap'].includes(subType)) {
          // Check Grid
          if (!state.option.grid || (Array.isArray(state.option.grid) && state.option.grid.length === 0)) {
                if (!state.option.grid) state.option.grid = [];
                // Use default grid
                const grid = getElementDefault('grid');
                if (Array.isArray(state.option.grid)) state.option.grid.push(grid);
                else state.option.grid = [state.option.grid, grid];
          }
          // Check X Axis
          if (!state.option.xAxis || (Array.isArray(state.option.xAxis) && state.option.xAxis.length === 0)) {
                if (!state.option.xAxis) state.option.xAxis = [];
                const ax = getElementDefault('xAxis');
                if (Array.isArray(state.option.xAxis)) state.option.xAxis.push(ax);
                else state.option.xAxis = [state.option.xAxis, ax];
          }
          // Check Y Axis
          if (!state.option.yAxis || (Array.isArray(state.option.yAxis) && state.option.yAxis.length === 0)) {
                if (!state.option.yAxis) state.option.yAxis = [];
                const ax = getElementDefault('yAxis');
                if (Array.isArray(state.option.yAxis)) state.option.yAxis.push(ax);
                else state.option.yAxis = [state.option.yAxis, ax];
          }
      }
      
      const current = state.option[componentKey];
      
      if (['series', 'xAxis', 'yAxis', 'grid', 'dataZoom', 'visualMap', 'graphic', 'dataset'].includes(componentKey) || Array.isArray(current)) {
         if (!current) {
             state.option[componentKey] = [newElement];
         } else if (Array.isArray(current)) {
             state.option[componentKey] = [...current, newElement];
         } else {
             state.option[componentKey] = [current, newElement];
         }
      } else {
          if (['title', 'legend', 'toolbox', 'tooltip', 'brush', 'timeline'].includes(componentKey)) {
              if (Array.isArray(current)) {
                  state.option[componentKey] = [...current, newElement];
              } else if (current) {
                  state.option[componentKey] = [current, newElement];
              } else {
                  state.option[componentKey] = newElement;
              }
          } else {
             state.option[componentKey] = newElement;
          }
      }
      state.lastUpdated = Date.now();
    },

    removeElement(state, action: PayloadAction<{ path: string }>) {
       const { path } = action.payload;
       const parts = path.split('.');
       
       if (parts.length === 1) {
           delete state.option[parts[0]];
       } else {
           let current = state.option;
           for (let i = 0; i < parts.length - 1; i++) {
               current = current[parts[i]];
           }
           
           if (current) {
                const indexOrKey = parts[parts.length - 1];
                if (Array.isArray(current)) {
                    const idx = parseInt(indexOrKey);
                    if (!isNaN(idx)) {
                        current.splice(idx, 1);
                    }
                } else {
                    delete current[indexOrKey];
                }
           }
       }
       state.lastUpdated = Date.now();
    },

    reparentElement(state, action: PayloadAction<{ path: string; targetId: string; targetType: string }>) {
        const { path, targetId, targetType } = action.payload;
        const element = get(state.option, path);
        if (!element) return;

        const elementType = path.split('.')[0]; 
        const subType = element.type || '';

        // 1. Move to MATRIX
        if (targetType === 'matrix') {
             const isCartesian = ['line', 'bar', 'candlestick', 'scatter', 'effectScatter', 'boxplot', 'heatmap'].includes(subType);
             
             if (elementType === 'series' && isCartesian) {
                // Auto-create Grid Wrapper
                const grids = state.option.grid ? (Array.isArray(state.option.grid) ? state.option.grid : [state.option.grid]) : [];
                const newGridIndex = grids.length;
                const grid: any = {
                    coordinateSystem: 'matrix',
                    coord: [0, 0],
                    containLabel: true,
                    show: false,
                    ...getElementDefault('grid')
                };
                // Force matrix layout on the wrapper grid
                grid.coordinateSystem = 'matrix';
                grid.coord = [0, 0];
                delete grid.left; delete grid.top; delete grid.right; delete grid.bottom;

                // Create Axes
                const xAxes = state.option.xAxis ? (Array.isArray(state.option.xAxis) ? state.option.xAxis : [state.option.xAxis]) : [];
                const yAxes = state.option.yAxis ? (Array.isArray(state.option.yAxis) ? state.option.yAxis : [state.option.yAxis]) : [];
                const xAxis = { type: 'category', gridIndex: newGridIndex, show: true };
                const yAxis = { type: 'value', gridIndex: newGridIndex, show: true };
                
                // Update State
                state.option.grid = [...grids, grid];
                state.option.xAxis = [...xAxes, xAxis];
                state.option.yAxis = [...yAxes, yAxis];
                
                // Update Series
                element.coordinateSystem = 'cartesian2d';
                element.xAxisIndex = newGridIndex;
                element.yAxisIndex = newGridIndex;
                delete element.coord; 
             } 
             else if (['series', 'grid', 'title', 'legend', 'graphic'].includes(elementType)) {
                // Non-Cartesian or Layout components can go direct
                element.coordinateSystem = 'matrix';
                if (!element.coord) element.coord = [0, 0];
                delete element.left;
                delete element.top;
                delete element.right;
                delete element.bottom;
                
                if (elementType === 'grid') {
                     // If moving a grid to matrix, ensure it has matrix config
                     element.coordinateSystem = 'matrix';
                     delete element.left; delete element.top; delete element.right; delete element.bottom;
                }
                
                delete element.xAxisIndex;
                delete element.yAxisIndex;
                delete element.gridIndex;
            }
        } 
        
        // 2. Move to GRID
        else if (targetType === 'grid') {
            const parts = targetId.split('.');
            const gridIndex = parts.length > 1 ? parseInt(parts[1]) : 0;
            
            if (elementType === 'series') {
                const xAxes = state.option.xAxis || [];
                const yAxes = state.option.yAxis || [];
                
                let targetXIndex = 0;
                let targetYIndex = 0;

                // Attempt to find axes belonging to this grid
                if (Array.isArray(xAxes)) {
                    const idx = xAxes.findIndex((ax: any) => (ax.gridIndex || 0) === gridIndex);
                    if (idx !== -1) targetXIndex = idx;
                }
                if (Array.isArray(yAxes)) {
                    const idx = yAxes.findIndex((ax: any) => (ax.gridIndex || 0) === gridIndex);
                    if (idx !== -1) targetYIndex = idx;
                }
                
                element.coordinateSystem = 'cartesian2d';
                element.xAxisIndex = targetXIndex;
                element.yAxisIndex = targetYIndex;
                delete element.coord;
            }
            else if (elementType === 'xAxis' || elementType === 'yAxis') {
                element.gridIndex = gridIndex;
            }
        }

        // 3. Move to ROOT (Detach)
        else {
             delete element.coordinateSystem;
             delete element.coord;
             
             if (elementType === 'series') {
                 // Revert to default cartesian if no system
                 if (['line', 'bar', 'scatter', 'heatmap', 'candlestick'].includes(subType)) {
                     element.coordinateSystem = 'cartesian2d';
                     
                     // Ensure valid axes exist at index 0, or find first available
                     let xAxisCount = Array.isArray(state.option.xAxis) ? state.option.xAxis.length : (state.option.xAxis ? 1 : 0);
                     let yAxisCount = Array.isArray(state.option.yAxis) ? state.option.yAxis.length : (state.option.yAxis ? 1 : 0);
                     
                     // If no axes, CREATE them to prevent ECharts "i.getBaseAxis" error
                     if (xAxisCount === 0) {
                         const newAxis = getElementDefault('xAxis');
                         state.option.xAxis = [newAxis];
                         xAxisCount = 1;
                     }
                     if (yAxisCount === 0) {
                         const newAxis = getElementDefault('yAxis');
                         state.option.yAxis = [newAxis];
                         yAxisCount = 1;
                     }
                     // Ensure grid exists
                     const gridCount = Array.isArray(state.option.grid) ? state.option.grid.length : (state.option.grid ? 1 : 0);
                     if (gridCount === 0) {
                        state.option.grid = [getElementDefault('grid')];
                     }

                     element.xAxisIndex = 0;
                     element.yAxisIndex = 0;
                 }
             }
             if (elementType === 'xAxis' || elementType === 'yAxis') {
                 element.gridIndex = 0;
             }
             // Restore default positioning if it was stripped
             if (!element.left && !element.right && !element.top && !element.bottom) {
                 element.left = 'center';
                 element.top = 'center';
             }
        }
        
        state.lastUpdated = Date.now();
    }
  },
});

export const { updateConfig, updateOptionProperty, updateOptionProperties, regenerateData, syncOption, addElement, removeElement, reparentElement, toggleVisibility } = chartSlice.actions;
export default chartSlice.reducer;
