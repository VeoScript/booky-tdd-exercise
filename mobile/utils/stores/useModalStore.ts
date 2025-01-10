import { create } from 'zustand';

export interface TabState {
  isOpen: boolean;
  onToggle: (value: boolean) => void;
}

export const useDeleteModalState = create<TabState>((set) => ({
  isOpen: false,
  onToggle: (value) => set({ isOpen: value }),
}));
