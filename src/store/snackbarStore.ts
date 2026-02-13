import { create } from 'zustand';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

interface Snackbar {
  id: string;
  message: string;
  type: SnackbarType;
}

interface SnackbarState {
  snackbars: Snackbar[];
  showSnackbar: (message: string, type?: SnackbarType) => void;
  hideSnackbar: (id: string) => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
  snackbars: [],
  
  showSnackbar: (message: string, type: SnackbarType = 'info') => {
    const id = `snackbar-${Date.now()}-${Math.random()}`;
    set((state) => ({
      snackbars: [...state.snackbars, { id, message, type }],
    }));
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      set((state) => ({
        snackbars: state.snackbars.filter((s) => s.id !== id),
      }));
    }, 5000);
  },
  
  hideSnackbar: (id: string) => {
    set((state) => ({
      snackbars: state.snackbars.filter((s) => s.id !== id),
    }));
  },
}));
