import { create } from 'zustand';

export type Tabs = 'to-buy' | 'bought';

export interface TabState {
  activeTab: Tabs;
  setActiveTab: (tab: Tabs) => void;
}

export const useTabStore = create<TabState>((set) => ({
  activeTab: 'to-buy',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
