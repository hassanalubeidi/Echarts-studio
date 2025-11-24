import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorState, PanelType, ElementSelection } from '../../types';

interface ExtendedEditorState extends EditorState {
  inspectorMode: 'visual' | 'code';
  isInspectorWide: boolean;
}

const initialState: ExtendedEditorState = {
  selectedElement: null,
  activePanel: 'layers',
  isLeftPanelOpen: true,
  isInspectorOpen: true,
  inspectorMode: 'visual',
  isInspectorWide: false,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setActivePanel(state, action: PayloadAction<PanelType>) {
      // If clicking same panel, toggle it
      if (state.activePanel === action.payload && state.isLeftPanelOpen) {
        state.isLeftPanelOpen = false;
      } else {
        state.activePanel = action.payload;
        state.isLeftPanelOpen = true;
      }
    },
    toggleLeftPanel(state) {
      state.isLeftPanelOpen = !state.isLeftPanelOpen;
    },
    toggleInspector(state) {
      state.isInspectorOpen = !state.isInspectorOpen;
    },
    setInspectorMode(state, action: PayloadAction<'visual' | 'code'>) {
      state.inspectorMode = action.payload;
    },
    setInspectorWide(state, action: PayloadAction<boolean>) {
      state.isInspectorWide = action.payload;
    },
    selectElement(state, action: PayloadAction<ElementSelection | null>) {
      state.selectedElement = action.payload;
      // Auto-open inspector when selecting
      if (action.payload) {
        state.isInspectorOpen = true;
        // Default back to visual mode on new selection unless convenient
        state.inspectorMode = 'visual'; 
        // Automatically widen for matrix
        state.isInspectorWide = action.payload.type === 'matrix';
      } else {
        state.isInspectorWide = false;
      }
    }
  },
});

export const { setActivePanel, toggleLeftPanel, toggleInspector, selectElement, setInspectorMode, setInspectorWide } = editorSlice.actions;
export default editorSlice.reducer;