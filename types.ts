
export interface ChartConfig {
  colors: {
    up: string;
    down: string;
    text: string;
    subtext: string;
    grid: string;
    split: string;
  };
  layout: {
    matrixMargin: number;
    barWidth: string;
  };
  simulation: {
    initialPrice: number;
    volatility: number;
  };
}

export interface Dataset {
  id: string;
  source: (string | number)[][];
  dimensions?: string[];
}

export interface FinancialData {
  datasets: Dataset[];
  lastClose: number;
  maxAbs: number;
  breakStartTime: number;
  breakEndTime: number;
}

export type PanelType = 'layers' | 'properties' | 'data' | 'settings';

export interface ElementSelection {
  type: 'series' | 'axis' | 'component' | 'graphic' | 'xAxis' | 'yAxis' | 'grid' | 'title' | 'legend' | 'tooltip' | 'dataZoom' | 'visualMap' | 'toolbox' | 'matrix' | 'brush' | 'timeline' | 'dataset';
  path: string; // e.g., 'series.0', 'xAxis.1', 'title.0'
  label: string;
}

export interface EditorState {
  selectedElement: ElementSelection | null;
  activePanel: PanelType;
  isLeftPanelOpen: boolean;
  isInspectorOpen: boolean;
  inspectorMode: 'visual' | 'code';
  isInspectorWide: boolean;
}
