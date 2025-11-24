
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { recordSnapshot, movePastToFuture, moveFutureToPast } from '../slices/historySlice';
import { syncOption } from '../slices/chartSlice';

let isRestoring = false;

export const undoableMiddleware: Middleware = store => next => action => {
    const type = (action as any).type;
    const state = store.getState() as RootState;

    if (type === 'history/undo') {
        const past = state.history.past;
        if (past.length === 0) return next(action);

        isRestoring = true;
        const stateToRestore = past[past.length - 1];
        const currentState = state.chart.option;

        // 1. Move current to Future, Pop from Past
        store.dispatch(movePastToFuture(currentState));
        
        // 2. Apply old state
        store.dispatch(syncOption(stateToRestore));
        
        isRestoring = false;
        return; // We consumed the action
    }

    if (type === 'history/redo') {
        const future = state.history.future;
        if (future.length === 0) return next(action);

        isRestoring = true;
        const stateToRestore = future[future.length - 1];
        const currentState = state.chart.option;

        // 1. Move current to Past, Pop from Future
        store.dispatch(moveFutureToPast(currentState));
        
        // 2. Apply new state
        store.dispatch(syncOption(stateToRestore));

        isRestoring = false;
        return;
    }

    // Recording Logic
    const recordableActions = [
        'chart/updateOptionProperty',
        'chart/updateOptionProperties', // Added batch update action
        'chart/updateConfig',
        'chart/regenerateData',
        'chart/addElement',
        'chart/removeElement',
        'chart/reparentElement'
    ];

    if (recordableActions.includes(type) && !isRestoring) {
        // Record state BEFORE change
        const currentOption = state.chart.option;
        // Deep clone might be needed if state is mutable, but RTK uses Immer so it's likely a proxy or frozen.
        // We'll trust RTK selector provides a snapshottable object.
        // ECharts options are big, JSON parse/stringify is safest for true decoupling.
        const snapshot = JSON.parse(JSON.stringify(currentOption));
        
        store.dispatch(recordSnapshot(snapshot));
    }

    return next(action);
};
