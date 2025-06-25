import { create } from 'zustand'
import type { PhoneticType, LoopWordTimesOption, PronunciationType, Dictionary } from '@/typings'
import type { ReviewRecord } from '@/utils/db/record'
import { defaultFontSizeConfig } from '@/constants'

export interface PhoneticConfig {
  isOpen: boolean
  type: PhoneticType
}

export interface PronunciationConfig {
  isOpen: boolean
  volume: number
  type: PronunciationType
  name: string
  isLoop: boolean
  isTransRead: boolean
  transVolume: number
  rate: number
}

export interface FontSizeConfig {
  foreignFont: number
  translateFont: number
}

export interface ReviewModeInfo {
  isReviewMode: boolean
  reviewRecord?: ReviewRecord
}

export interface WordDictationConfig {
  isOpen: boolean
  type: string
  openBy: string
}

interface TypingConfigState {
  phoneticConfig: PhoneticConfig
  pronunciationConfig: PronunciationConfig
  fontSizeConfig: FontSizeConfig
  isTextSelectable: boolean
  isShowPrevAndNextWord: boolean
  loopWordTimes: number
  reviewModeInfo: ReviewModeInfo
  wordDictationConfig: WordDictationConfig
  currentDictInfo: Dictionary | null
  isIgnoreCase: boolean
  isShowAnswerOnHover: boolean
  currentChapter: number
  setPhoneticConfig: (config: PhoneticConfig) => void
  setPronunciationConfig: (config: PronunciationConfig) => void
  setFontSizeConfig: (config: FontSizeConfig) => void
  setIsTextSelectable: (selectable: boolean) => void
  setIsShowPrevAndNextWord: (show: boolean) => void
  setLoopWordTimes: (times: number) => void
  setReviewModeInfo: (updater: (old: ReviewModeInfo) => ReviewModeInfo) => void
  setWordDictationConfig: (config: WordDictationConfig) => void
  setCurrentDictInfo: (dict: Dictionary | null) => void
  setIsIgnoreCase: (val: boolean) => void
  setIsShowAnswerOnHover: (val: boolean) => void
  setCurrentChapter: (val: number) => void
}

export const useTypingConfigStore = create<TypingConfigState>((set) => ({
  phoneticConfig: { isOpen: true, type: 'us' },
  pronunciationConfig: {
    isOpen: true,
    volume: 1,
    type: 'us',
    name: '美音',
    isLoop: false,
    isTransRead: false,
    transVolume: 1,
    rate: 1,
  },
  fontSizeConfig: defaultFontSizeConfig,
  isTextSelectable: false,
  isShowPrevAndNextWord: true,
  loopWordTimes: 1,
  reviewModeInfo: { isReviewMode: false },
  wordDictationConfig: { isOpen: false, type: 'hideAll', openBy: 'auto' },
  currentDictInfo: null,
  isIgnoreCase: true,
  isShowAnswerOnHover: true,
  currentChapter: 0,
  setPhoneticConfig: (config) => set({ phoneticConfig: config }),
  setPronunciationConfig: (config) => set({ pronunciationConfig: config }),
  setFontSizeConfig: (config) => set({ fontSizeConfig: config }),
  setIsTextSelectable: (selectable) => set({ isTextSelectable: selectable }),
  setIsShowPrevAndNextWord: (show) => set({ isShowPrevAndNextWord: show }),
  setLoopWordTimes: (times) => set({ loopWordTimes: times }),
  setReviewModeInfo: (updater) => set((state) => ({ reviewModeInfo: updater(state.reviewModeInfo) })),
  setWordDictationConfig: (config) => set({ wordDictationConfig: config }),
  setCurrentDictInfo: (dict) => set({ currentDictInfo: dict }),
  setIsIgnoreCase: (val) => set({ isIgnoreCase: val }),
  setIsShowAnswerOnHover: (val) => set({ isShowAnswerOnHover: val }),
  setCurrentChapter: (val) => set({ currentChapter: val }),
})) 