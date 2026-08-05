import { create } from "zustand";

interface AppState {
  isAppLoaded: boolean;
  setAppLoaded: (loaded: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  isAppLoaded: false,
  setAppLoaded: (loaded) => set({ isAppLoaded: loaded }),
}));
