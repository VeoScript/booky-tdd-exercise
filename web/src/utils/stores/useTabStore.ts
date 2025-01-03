import { create } from 'zustand';

export enum Tabs {
  TO_BUY = 'to_buy',
  BOUGHT = 'bought',
}

export interface TabState {
  activeTab: Tabs;
  setActiveTab: (tab: Tabs) => void;
}

export const useTabStore = create<TabState>((set) => ({
  activeTab: Tabs.TO_BUY,
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
