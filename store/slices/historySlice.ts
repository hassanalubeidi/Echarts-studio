import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';

interface HistoryState {
  past: any[];
  future: any[];
}

const initialState: HistoryState = {
  past: [],
  future: [],
};

const LIMIT = 50;

// Actions defined for middleware to catch
export const undo = createAction('history/undo');
export const redo = createAction('history/redo');

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    recordSnapshot(state, action: PayloadAction<any>) {
      // Deep clone to ensure we store a snapshot, not a reference
      // Although payload should be serializable from middleware
      state.past.push(action.payload);
      if (state.past.length > LIMIT) {
        state.past.shift();
      }
      state.future = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(undo, (state) => {
      if (state.past.length === 0) return;
      
      // 1. Get current option? 
      // Middleware handles applying the "past" state to the chart.
      // But we need to save the "current" (which is about to be replaced) into "future".
      // Wait, standard undo:
      // Past: [A, B] | Current: C | Future: []
      // Undo -> 
      // Past: [A] | Current: B | Future: [C]
      
      // Our middleware recorded "C" into 'past' BEFORE it changed to "D".
      // So Past: [A, B, C] | Current: D
      // Undo -> Restore C.
      // We need to move C from Past to Future.
      
      const previous = state.past.pop();
      // We also need to know what the "current" state was to push to future.
      // But the state is in another slice.
      // Simplification: We only track snapshots. 
      // When undoing, we pop from past. 
      // We need to push the *replaced* state to future? 
      // This requires the reducer to know the current chart state, which it doesn't.
      
      // Let's rely on the payload of the undo action providing the CURRENT state?
      // No, let's keep it simple: 
      // The middleware orchestrates.
      // It grabs current state, dispatches a "pushToFuture" action, then dispatches syncOption.
      
      // Re-thinking: Redux-Undo usually wraps the reducer.
      // Since we separated history, it's slightly manual.
      
      // Let's try this:
      // Undo removes from Past.
      // But we lose the ability to Redo unless we save the state we just overwrote.
      
      // Let's modify middleware to dispatch a `saveForRedo(currentState)` before restoring.
    });
    
    builder.addCase(redo, (state) => {
        if (state.future.length === 0) return;
        const next = state.future.pop();
        // Middleware restores 'next'.
        // We need to save the overwritten state to 'past'.
    });
  },
});

// We need new actions for the precise state manipulation
const historyInternalSlice = createSlice({
    name: 'historyInternal',
    initialState,
    reducers: {
        recordSnapshot(state, action: PayloadAction<any>) {
            state.past.push(action.payload);
            if (state.past.length > LIMIT) state.past.shift();
            state.future = [];
        },
        movePastToFuture(state, action: PayloadAction<any>) {
            // Called during UNDO. 
            // action.payload is the CURRENT state (before it gets overwritten by the undo).
            // We push this to future.
            state.future.push(action.payload);
            // We assume the caller (middleware) has already retrieved the state to restore from past
            // but we need to remove it from past here.
            state.past.pop();
        },
        moveFutureToPast(state, action: PayloadAction<any>) {
            // Called during REDO.
            // action.payload is the CURRENT state (before overwrite).
            state.past.push(action.payload);
            state.future.pop();
        }
    }
});

export const { recordSnapshot, movePastToFuture, moveFutureToPast } = historyInternalSlice.actions;
export default historyInternalSlice.reducer;