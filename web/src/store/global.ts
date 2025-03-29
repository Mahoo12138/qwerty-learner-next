import { create } from 'zustand'


interface GlobalState {
  locale: Locale
  appearance: Appearance
  setLocale: (locale: Locale) => void
  setAppearance: (appearance: Appearance) => void
}

export const useGlobalStore = create<GlobalState>((set) => ({
  locale: 'en',
  appearance: 'system',
  setLocale: (locale) => set({ locale }),
  setAppearance: (appearance) => set({ appearance }),
}))