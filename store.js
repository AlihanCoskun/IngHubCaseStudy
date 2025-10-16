import { createStore } from 'redux';
import employeeReducer from './employeeSlice.js';

// Load initial state from localStorage or use default
const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('employeeAppState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn('Could not load state from localStorage:', err);
    return undefined;
  }
};

// Save state to localStorage
const saveStateToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('employeeAppState', serializedState);
  } catch (err) {
    console.warn('Could not save state to localStorage:', err);
  }
};

// Create store with initial state from localStorage
const persistedState = loadStateFromLocalStorage();
export const store = createStore(employeeReducer, persistedState);

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveStateToLocalStorage(store.getState());
});

export default store;

