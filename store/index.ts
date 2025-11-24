import { configureStore, createAction } from '@reduxjs/toolkit';
import editorReducer from './slices/editorSlice';
import chartReducer from './slices/chartSlice';
import historyReducer from './slices/historySlice';
import { undoableMiddleware } from './middleware/historyMiddleware';

// Define complex actions for history reducer here to avoid circular imports if needed,
// or just modify the slice to handle the stack logic properly.
// For now, we will add extra reducers to historySlice to handle undo/redo stack manipulation.

const undoAction = createAction('history/undo');
const redoAction = createAction('history/redo');

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    chart: chartReducer,
    history: historyReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({ serializableCheck: false }).concat(undoableMiddleware),
});

// We need to inject the reducer logic for undo/redo into the slice or handle it here?
// Redux Toolkit slices are pure. We'll verify historySlice logic in a moment.
// Actually, let's update historySlice to handle the POP/PUSH logic when undo/redo actions are dispatched.
// Since we used `extraReducers`, let's go back and fix historySlice.ts in the next file block if needed.
// Wait, I haven't implemented undo/redo reducers in historySlice yet. I will do that now.

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { undoAction, redoAction };