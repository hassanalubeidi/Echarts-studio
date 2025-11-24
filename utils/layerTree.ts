
import { 
    BarChart2, Grid, Type, Layout, List, Hash, Map, MousePointer2, ZoomIn, Palette, Wrench, Clock, Paintbrush, Box,
    ArrowRight
} from 'lucide-react';

export interface TreeNode {
    id: string; // Unique ID (path)
    label: string;
    type: string;
    path: string;
    icon: any;
    children?: TreeNode[];
    isMatrixChild?: boolean;
    coord?: number[];
    meta?: string;
    canReparent?: boolean; // Can be dragged
    parentId?: string; // For logical grouping reference
    visible?: boolean;
}

// Maps component keys to Icons
const ICON_MAP: Record<string, any> = {
    'series': BarChart2,
    'grid': Grid,
    'title': Type,
    'matrix': Layout,
    'legend': List,
    'xAxis': Hash,
    'yAxis': Hash,
    'graphic': Map,
    'tooltip': MousePointer2,
    'dataZoom': ZoomIn,
    'visualMap': Palette,
    'toolbox': Wrench,
    'timeline': Clock,
    'brush': Paintbrush,
    'grid3D': Box
};

// Helper to safely get axis config to resolve gridIndex
const getAxisConfig = (option: any, type: 'xAxis' | 'yAxis', index: number) => {
    const axes = option[type];
    if (!axes) return null;
    if (Array.isArray(axes)) return axes[index];
    if (index === 0) return axes;
    return null;
};

/**
 * Builds a logical hierarchy tree from the flat ECharts option object.
 * Hierarchy Rule:
 * 1. Matrix (if exists) -> Contains Grids (coordinateSystem: matrix) & direct items
 * 2. Grids -> Contain Axes (via gridIndex) and Series (via xAxisIndex->gridIndex)
 * 3. Root -> Everything else
 */
export const buildLayerTree = (option: any): TreeNode[] => {
    const rootNodes: TreeNode[] = [];
    
    // -- 1. Initialize Matrix Container --
    let matrixNode: TreeNode | null = null;
    if (option.matrix) {
        matrixNode = {
            id: 'matrix',
            label: 'Matrix System',
            type: 'matrix',
            path: 'matrix',
            icon: Layout,
            children: [], 
            canReparent: false,
            visible: option.matrix.show !== false
        };
    }

    // -- 2. Initialize Grid Nodes --
    const gridNodes: TreeNode[] = [];
    if (option.grid) {
        const isArray = Array.isArray(option.grid);
        const grids = isArray ? option.grid : [option.grid];
        grids.forEach((grid: any, index: number) => {
            const path = isArray ? `grid.${index}` : 'grid';
            const isMatrix = grid.coordinateSystem === 'matrix';
            const node: TreeNode = {
                id: path,
                label: grid.name || `Grid ${index + 1}`,
                type: 'grid',
                path,
                icon: Grid,
                children: [], // Will contain Axes and Series
                isMatrixChild: isMatrix,
                coord: grid.coord,
                meta: isMatrix && grid.coord ? `[${grid.coord.join(',')}]` : '',
                canReparent: true, // Grids can be moved in/out of matrix theoretically
                visible: grid.show !== false
            };
            gridNodes.push(node);
        });
    }

    // -- 3. Process All Components --
    const unassignedItems: TreeNode[] = [];

    const processList = (key: string, data: any) => {
        const isArray = Array.isArray(data);
        const list = isArray ? data : [data];

        list.forEach((item: any, index: number) => {
            if (!item) return;
            const path = isArray ? `${key}.${index}` : key;
            const label = item.name || item.text || item.id || `${key} ${index + 1}`;
            const icon = ICON_MAP[key] || Box;
            
            const node: TreeNode = {
                id: path,
                label,
                type: key,
                path,
                icon,
                children: [],
                canReparent: ['series', 'title', 'xAxis', 'yAxis'].includes(key),
                visible: item.show !== false
            };

            // Logic: Where does this node belong?
            let assigned = false;

            // A. Direct Matrix Coordinate System (e.g. Title positioned in matrix)
            if (item.coordinateSystem === 'matrix') {
                if (matrixNode) {
                    node.isMatrixChild = true;
                    node.coord = item.coord;
                    node.meta = item.coord ? `[${item.coord.join(',')}]` : '';
                    matrixNode.children!.push(node);
                    assigned = true;
                }
            }

            // B. Grid Dependency (Axes)
            if (!assigned && (key === 'xAxis' || key === 'yAxis')) {
                const gridIndex = item.gridIndex || 0;
                if (gridNodes[gridIndex]) {
                    gridNodes[gridIndex].children!.push(node);
                    node.meta = key === 'xAxis' ? '(X)' : '(Y)';
                    assigned = true;
                }
            }

            // C. Series Dependency on Grid (via Axes)
            if (!assigned && key === 'series') {
                // If cartesian (default) or unspecified
                if (item.coordinateSystem === 'cartesian2d' || !item.coordinateSystem) {
                    const xIndex = item.xAxisIndex || 0;
                    // Find the configuration for this axis to get its gridIndex
                    const xAxisConfig = getAxisConfig(option, 'xAxis', xIndex);
                    const gridIndex = xAxisConfig?.gridIndex || 0;
                    
                    if (gridNodes[gridIndex]) {
                        gridNodes[gridIndex].children!.push(node);
                        assigned = true;
                    }
                }
            }

            // D. Unassigned / Root
            if (!assigned) {
                unassignedItems.push(node);
            }
        });
    };

    // Process all potential array components
    if (option.series) processList('series', option.series);
    if (option.xAxis) processList('xAxis', option.xAxis);
    if (option.yAxis) processList('yAxis', option.yAxis);
    
    // Process other components
    ['title', 'legend', 'toolbox', 'tooltip', 'dataZoom', 'visualMap', 'timeline', 'brush', 'graphic', 'grid3D'].forEach(key => {
        if (option[key]) {
            processList(key, option[key]);
        }
    });

    // -- 4. Sort Grid Children --
    // Axes first, then Series
    gridNodes.forEach(grid => {
        if (grid.children) {
            grid.children.sort((a, b) => {
                const scoreA = a.type.includes('Axis') ? 0 : 1;
                const scoreB = b.type.includes('Axis') ? 0 : 1;
                return scoreA - scoreB;
            });
        }
    });

    // -- 5. Assemble Final Tree --

    // Distribute Grids into Matrix or Root
    gridNodes.forEach(grid => {
        if (grid.isMatrixChild && matrixNode) {
            matrixNode.children!.push(grid);
        } else {
            rootNodes.push(grid);
        }
    });

    // Add Matrix Node to Root (if it has content or exists)
    if (matrixNode) {
        rootNodes.unshift(matrixNode);
    }

    // Add remaining unassigned items
    rootNodes.push(...unassignedItems);

    return rootNodes;
};
