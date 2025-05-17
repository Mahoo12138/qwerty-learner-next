import { StatusData } from '@/typings/status';
import { create } from 'zustand'


interface GlobalState {
  locale: Locale
  appearance: Appearance
  isAppInit: boolean;
  statusData: StatusData | null;
  setLocale: (locale: Locale) => void
  setAppearance: (appearance: Appearance) => void
  setStatusData: (data: StatusData | null) => void;
  setIsAppInit: (init: boolean) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  locale: 'en',
  appearance: 'system',
  isAppInit: true,
  statusData: null,
  setLocale: (locale) => set({ locale }),
  setAppearance: (appearance) => set({ appearance }),
  setStatusData: (data) => set({ statusData: data }),
  setIsAppInit: (init: boolean) => set({ isAppInit: init }),
}))