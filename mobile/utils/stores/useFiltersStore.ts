import { create } from 'zustand';

export type Tabs = 'to-buy' | 'bought';

export type Filters = {
  type: Tabs;
  page?: number;
  limit?: number;
};

const initialFilters: Filters = {
  type: 'to-buy',
};

export interface FilterState {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export const useFiltersState = create<FilterState>((set) => ({
  filters: initialFilters,
  setFilters: (filters) => set({ filters }),
}));
