import React from 'react';
import { 
  Layout, 
  Layers, 
  Settings, 
  Database, 
  Palette, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Play, 
  RefreshCw,
  Maximize2,
  Menu,
  Box,
  BarChart2,
  Type,
  Hash,
  Grid,
  Map,
  MousePointer2,
  List,
  ZoomIn,
  Wrench,
  Clock,
  Paintbrush,
  Code,
  Eye,
  Check,
  X,
  Undo2,
  Redo2,
  Trash2,
  ZoomOut,
  Hand,
  MousePointer,
  Plus,
  ArrowRight,
  GripVertical,
  EyeOff,
  PlusCircle,
  Filter,
  ArrowUpDown,
  ListPlus,
  Calculator,
  Combine,
  Split,
  Columns,
  Rows,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Move,
  MoreHorizontal
} from 'lucide-react';

export const IconLayout = ({ className, size = 18 }: { className?: string, size?: number }) => <Layout className={className} size={size} />;
export const IconLayers = ({ className, size = 18 }: { className?: string, size?: number }) => <Layers className={className} size={size} />;
export const IconSettings = ({ className, size = 18 }: { className?: string, size?: number }) => <Settings className={className} size={size} />;
export const IconData = ({ className, size = 18 }: { className?: string, size?: number }) => <Database className={className} size={size} />;
export const IconPalette = ({ className, size = 18 }: { className?: string, size?: number }) => <Palette className={className} size={size} />;
export const IconChevronLeft = ({ className, size = 16 }: { className?: string, size?: number }) => <ChevronLeft className={className} size={size} />;
export const IconChevronRight = ({ className, size = 16 }: { className?: string, size?: number }) => <ChevronRight className={className} size={size} />;
export const IconChevronDown = ({ className, size = 16 }: { className?: string, size?: number }) => <ChevronDown className={className} size={size} />;
export const IconPlay = ({ className, size = 16 }: { className?: string, size?: number }) => <Play className={className} size={size} />;
export const IconRefresh = ({ className, size = 16 }: { className?: string, size?: number }) => <RefreshCw className={className} size={size} />;
export const IconMaximize = ({ className, size = 16 }: { className?: string, size?: number }) => <Maximize2 className={className} size={size} />;
export const IconMenu = ({ className, size = 18 }: { className?: string, size?: number }) => <Menu className={className} size={size} />;
export const IconBox = ({ className, size = 18 }: { className?: string, size?: number }) => <Box className={className} size={size} />;
export const IconChart = ({ className, size = 18 }: { className?: string, size?: number }) => <BarChart2 className={className} size={size} />;

// New exports for direct use in Layers and Toolbar
export { 
  Type, Hash, Grid, Map, BarChart2, Layout, ChevronRight, ChevronDown, 
  Code, Eye, Check, X,
  Undo2, Redo2, Trash2, ZoomIn, ZoomOut, Hand, MousePointer,
  Palette, MousePointer2, Wrench, Clock, Paintbrush, List,
  RefreshCw, Box, Plus, ArrowRight, GripVertical,
  EyeOff, PlusCircle, Filter, ArrowUpDown, ListPlus, Calculator,
  Combine, Split, Columns, Rows, AlignLeft, AlignCenter, AlignRight, Move,
  MoreHorizontal
};